import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();
  
  // Test with string array
  const { data: p1, error: e1 } = await supabase.from('products').select('id').in('id', ["28"]);
  
  // Test with number array
  const { data: p2, error: e2 } = await supabase.from('products').select('id').in('id', [28]);

  return NextResponse.json({
    stringArrayResult: { data: p1, error: e1 },
    numberArrayResult: { data: p2, error: e2 },
  });
}
