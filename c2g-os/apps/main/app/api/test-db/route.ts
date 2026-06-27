import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();
  
  const { data: constraint } = await supabase.rpc('query_pg', {
    query: "SELECT pg_get_constraintdef(oid) FROM pg_constraint WHERE conname = 'employees_status_check'"
  });
  
  // If no RPC, let's just create one manually using raw sql. 
  // Wait, no RPC available. Let me just use standard fetch from pg_constraint directly if possible.
  // Actually, Supabase blocks pg_constraint from anon.
  // Let me just test inserting with status 'Active' to see if it succeeds!
  const { error: err1 } = await supabase.from('employees').insert({ user_id: '00000000-0000-0000-0000-000000000000', email: 'test1@test.com', full_name: 't', staff_role: 'admin', status: 'Active' });
  const { error: err2 } = await supabase.from('employees').insert({ user_id: '00000000-0000-0000-0000-000000000000', email: 'test2@test.com', full_name: 't', staff_role: 'admin', status: 'ACTIVE' });
  
  return NextResponse.json({
    err1: err1?.message,
    err2: err2?.message,
  });
}
