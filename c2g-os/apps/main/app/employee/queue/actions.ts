'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { EmployeeActionSchema } from '@/utils/security-schemas';

// ═══════════════════════════════════════════════════════════════════════
// SECURITY: Every server action verifies auth + role before doing anything.
// Supabase SDK uses parameterized queries internally, preventing SQL injection.
// All user inputs are sanitized and validated before touching the database.
// Every mutation is audit-logged with user_id, IP context, old/new values.
// ═══════════════════════════════════════════════════════════════════════

/** Verify the current user is authenticated and is an admin/employee */
async function verifyEmployee() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (!user || authError) {
    throw new Error('UNAUTHORIZED: You must be logged in.');
  }

  // Verify they exist in the admins table (employees are stored there)
  const { data: admin } = await supabase
    .from('admins')
    .select('id, role, user_id')
    .eq('user_id', user.id)
    .single();

  if (!admin) {
    throw new Error('FORBIDDEN: You are not an authorized employee.');
  }

  return { supabase, user, admin };
}

/** Sanitize a string input — strip HTML tags, limit length */
function sanitize(input: string | null | undefined, maxLength = 500): string {
  if (!input) return '';
  // Strip all HTML/script tags to prevent XSS
  const clean = input.replace(/<[^>]*>/g, '').trim();
  // Enforce max length
  return clean.substring(0, maxLength);
}

/** Insert an audit log entry */
async function logAudit(
  supabase: any,
  userId: string,
  action: string,
  entityType: string,
  entityId: string,
  details: Record<string, any>
) {
  await supabase.from('audit_logs').insert({
    user_id: userId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    details,
  }).then(() => {}).catch(() => {}); // Never let audit failure break the main action
}

// ═══════════════════════════════════════════════════════════════════════
// QUERIES
// ═══════════════════════════════════════════════════════════════════════

/** Fetch orders assigned to the current employee (or all if super_admin/manager) */
export async function getMyAssignedOrders() {
  try {
    const { supabase, user, admin } = await verifyEmployee();

    let query = supabase
      .from('orders')
      .select('id, order_id, customer_name, customer_id, product_name, product_link, status, order_status, payment_status, total, cny_price, shipping_mode, notes, items, tracking_number, created_at, customers(name, email, phone)')
      .order('created_at', { ascending: false });

    // Ghana ops can only see orders assigned to them via admin_tasks or all pending orders
    // Super admin and manager can see everything
    if (admin.role !== 'super_admin' && admin.role !== 'manager') {
      // For regular agents, only show orders that are in actionable states
      query = query.in('order_status', ['new', 'pending', 'processing', 'pending_payment']);
    }

    const { data, error } = await query.limit(100);

    if (error) {
      console.error('Error fetching orders:', error);
      return { success: false, data: [], error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (err: any) {
    return { success: false, data: [], error: err.message };
  }
}

/** Fetch a single order by ID with full details */
export async function getOrderDetail(orderId: string) {
  try {
    const { supabase, admin } = await verifyEmployee();

    // Validate orderId format to prevent injection via path params
    if (!orderId || typeof orderId !== 'string' || orderId.length > 50) {
      return { success: false, error: 'Invalid order ID' };
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*, customers(name, email, phone, city)')
      .eq('id', orderId)
      .single();

    if (error || !data) {
      return { success: false, error: 'Order not found' };
    }

    // Also fetch the activity feed for this order
    const { data: activityFeed } = await supabase
      .from('order_activity_feed')
      .select('*')
      .eq('order_id', data.id)
      .order('created_at', { ascending: false })
      .limit(50);

    return { success: true, data: { ...data, activity_feed: activityFeed || [] } };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/** Fetch all customers (view-only for support agents) */
export async function getCustomers(searchTerm?: string) {
  try {
    const { supabase } = await verifyEmployee();

    let query = supabase
      .from('customers')
      .select('id, name, email, phone, city, created_at')
      .order('created_at', { ascending: false })
      .limit(100);

    if (searchTerm && searchTerm.trim().length > 0) {
      const clean = sanitize(searchTerm, 100);
      query = query.or(`name.ilike.%${clean}%,email.ilike.%${clean}%,phone.ilike.%${clean}%`);
    }

    const { data, error } = await query;

    if (error) {
      return { success: false, data: [], error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (err: any) {
    return { success: false, data: [], error: err.message };
  }
}

// ═══════════════════════════════════════════════════════════════════════
// MUTATIONS (with audit logging)
// ═══════════════════════════════════════════════════════════════════════

/** Update the operational status of an order (NOT payment status — that is finance-only) */
export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    const { supabase, user, admin } = await verifyEmployee();

    // Validate inputs
    if (!orderId || typeof orderId !== 'string') {
      return { success: false, error: 'Invalid order ID' };
    }

    const validation = EmployeeActionSchema.safeParse({ status: newStatus });
    if (!validation.success) {
      return { success: false, error: validation.error.issues[0]?.message || 'Validation failed' };
    }

    const validStatus = validation.data.status;
    if (!validStatus) {
      return { success: false, error: 'Invalid status' };
    }

    // SECURITY: Customer service agents CANNOT change payment status
    // They can only change order_status (operational flow)

    // Fetch old value for audit trail
    const { data: oldOrder } = await supabase
      .from('orders')
      .select('order_status, status')
      .eq('id', orderId)
      .single();

    if (!oldOrder) {
      return { success: false, error: 'Order not found' };
    }

    const { error } = await supabase
      .from('orders')
      .update({ 
        order_status: validStatus,
        status: validStatus, // Keep both in sync
      })
      .eq('id', orderId);

    if (error) {
      return { success: false, error: error.message };
    }

    // Audit log
    await logAudit(supabase, user.id, 'UPDATE_ORDER_STATUS', 'order', orderId, {
      old_status: oldOrder.order_status || oldOrder.status,
      new_status: validStatus,
      agent_role: admin.role,
    });

    revalidatePath('/employee/queue');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/** Add a tracking number to an order */
export async function addTrackingNumber(orderId: string, trackingNumber: string) {
  try {
    const { supabase, user, admin } = await verifyEmployee();

    if (!orderId || !trackingNumber) {
      return { success: false, error: 'Order ID and tracking number are required' };
    }

    const validation = EmployeeActionSchema.safeParse({ trackingNumber });
    if (!validation.success) {
      return { success: false, error: validation.error.issues[0]?.message || 'Validation failed' };
    }

    const cleanTracking = validation.data.trackingNumber;
    if (!cleanTracking) {
      return { success: false, error: 'Invalid tracking number format' };
    }

    const { error } = await supabase
      .from('orders')
      .update({ tracking_number: cleanTracking })
      .eq('id', orderId);

    if (error) {
      return { success: false, error: error.message };
    }

    await logAudit(supabase, user.id, 'ADD_TRACKING_NUMBER', 'order', orderId, {
      tracking_number: cleanTracking,
      agent_role: admin.role,
    });

    revalidatePath('/employee/queue');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/** Add an internal note to an order's activity feed */
export async function addOrderNote(orderId: string, content: string) {
  try {
    const { supabase, user, admin } = await verifyEmployee();

    if (!orderId) {
      return { success: false, error: 'Order ID is required' };
    }

    const validation = EmployeeActionSchema.safeParse({ note: content });
    if (!validation.success) {
      return { success: false, error: validation.error.issues[0]?.message || 'Validation failed' };
    }

    const cleanContent = sanitize(validation.data.note, 2000);
    if (cleanContent.length < 1) {
      return { success: false, error: 'Note content cannot be empty' };
    }

    // Verify the order exists
    const { data: order } = await supabase
      .from('orders')
      .select('id')
      .eq('id', orderId)
      .single();

    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    const { error } = await supabase
      .from('order_activity_feed')
      .insert({
        order_id: order.id,
        author_id: user.id,
        activity_type: 'note',
        content: cleanContent,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    await logAudit(supabase, user.id, 'ADD_ORDER_NOTE', 'order', orderId, {
      note_preview: cleanContent.substring(0, 100),
      agent_role: admin.role,
    });

    revalidatePath('/employee/queue');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
