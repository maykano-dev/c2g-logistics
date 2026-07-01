import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role to bypass RLS
    );
    const { data: addresses, error } = await supabase.from('warehouse_addresses').select('*');
    return NextResponse.json({ addresses, error });
  } catch (e: any) {
    return NextResponse.json({ error: e.message });
  }
}
