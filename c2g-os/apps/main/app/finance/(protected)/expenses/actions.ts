'use server';

import { createClient } from '@/utils/supabase/server';
import { logAudit } from '@/utils/audit';

export async function getExpenses() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const { data, error } = await supabase
    .from('expenses')
    .select(`
      id,
      category,
      amount,
      currency,
      description,
      receipt_url,
      status,
      created_at,
      submitter:submitted_by(id, email),
      approver:approved_by(id, email)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching expenses:", error);
    return { success: false, error: error.message };
  }

  return { success: true, expenses: data };
}

export async function updateExpenseStatus(expenseId: string, newStatus: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const { data: current, error: fetchErr } = await supabase
    .from('expenses')
    .select('status')
    .eq('id', expenseId)
    .single();

  if (fetchErr || !current) return { success: false, error: 'Expense not found' };
  if (current.status === newStatus) return { success: true };

  const updates: any = { status: newStatus };
  if (newStatus === 'approved') updates.approved_by = user.id;
  if (newStatus === 'paid') updates.paid_at = new Date().toISOString();

  const { error } = await supabase
    .from('expenses')
    .update(updates)
    .eq('id', expenseId);

  if (error) return { success: false, error: error.message };

  await logAudit({
    userId: user.id,
    action: `UPDATE_EXPENSE_STATUS`,
    entity: 'expense',
    entityId: expenseId,
    oldValue: { status: current.status },
    newValue: { status: newStatus }
  });

  return { success: true };
}
