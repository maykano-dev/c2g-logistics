import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendPushNotification } from "../../../../utils/push";


export async function POST(req: Request) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const payload = await req.json();

    if (payload.type !== "UPDATE" || payload.table !== "packages") {
      return NextResponse.json({ message: "Ignored: Not a package update" }, { status: 200 });
    }

    const newRecord = payload.record;
    const oldRecord = payload.old_record;

    // Trigger only if status actually changed
    if (newRecord.status !== oldRecord.status) {
      const customerId = newRecord.user_id;
      const trackingNumber = newRecord.tracking_number;

      if (!customerId) {
        return NextResponse.json({ message: "No user ID found on package" }, { status: 200 });
      }

      // Format status nicely (e.g. "in_transit" -> "In Transit")
      const formattedStatus = newRecord.status
        .split('_')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Create in-app notification and send push notification automatically
      const { createNotification } = await import("../../../../utils/notifications");
      
      await createNotification({
        userId: customerId,
        title: "Package Status Updated 🚚",
        message: `Package ${trackingNumber} is now ${formattedStatus}.`,
        type: "package_status_update",
        link: `/dashboard/packages/${newRecord.id}`
      });

      return NextResponse.json({ success: true, message: "Package status notifications sent" });
    }

    return NextResponse.json({ message: "Ignored: Status unchanged" }, { status: 200 });
  } catch (error: any) {
    console.error("Package Status Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
