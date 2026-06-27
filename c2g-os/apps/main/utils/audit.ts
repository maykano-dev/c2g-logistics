import { createClient } from './supabase/server';

export interface AuditLogParams {
  userId?: string;
  action: string;
  entity: string;
  entityId: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
  browserInfo?: string;
}

/**
 * Standard utility to securely record audit logs in the system.
 */
export async function logAudit(params: AuditLogParams) {
  const supabase = await createClient(); // uses service_role or standard client depending on context
  
  try {
    const { error } = await supabase.from('audit_logs').insert({
      user_id: params.userId,
      action: params.action,
      entity_type: params.entity,
      entity_id: params.entityId,
      details: {
        old_value: params.oldValue,
        new_value: params.newValue
      },
      ip_address: params.ipAddress,
      user_agent: params.browserInfo
    });

    if (error) {
      console.error("[AUDIT LOG ERROR] Failed to write audit log:", error);
    }
  } catch (e) {
    console.error("[AUDIT LOG EXCEPTION] Failed to write audit log:", e);
  }
}
