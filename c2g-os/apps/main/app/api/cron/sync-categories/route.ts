import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
// TODO: Migrate to HioBuy category sync

export const maxDuration = 60;

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log("[CRON] Category Sync disabled pending HioBuy migration.");
  return NextResponse.json({ success: true, message: "Migration to HioBuy pending" });
}
