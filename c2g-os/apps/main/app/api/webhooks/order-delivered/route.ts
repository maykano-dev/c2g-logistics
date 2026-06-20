import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendPushNotification } from "../../../../utils/push";

export async function POST(req: Request) {
  try {
    // Initialize a Supabase admin client to bypass RLS for webhook operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const payload = await req.json();

    // Ensure this is an UPDATE event on ecom_orders
    if (payload.type !== "UPDATE" || payload.table !== "ecom_orders") {
      return NextResponse.json({ message: "Ignored: Not an order update" }, { status: 200 });
    }

    const newRecord = payload.record;
    const oldRecord = payload.old_record;

    // Check if status changed to 'delivered'
    if (newRecord.status === "delivered" && oldRecord.status !== "delivered") {
      const customerId = newRecord.customer_id;
      const orderId = newRecord.id;
      const orderIdFormatted = orderId.slice(0, 8);

      if (!customerId) {
        return NextResponse.json({ message: "No customer ID found on order" }, { status: 200 });
      }

      // Create in-app notification and push automatically
      const { createNotification } = await import("../../../../utils/notifications");
      
      await createNotification({
        userId: customerId,
        title: "Order Delivered 🎉",
        message: `Your order #${orderIdFormatted} has been delivered!`,
        type: "order_delivered",
        link: `/dashboard/orders/mall/${orderId}`
      });

      return NextResponse.json({ success: true, message: "Order delivery notifications sent" });
    }

    return NextResponse.json({ message: "Ignored: Status not delivered" }, { status: 200 });
  } catch (error: any) {
    console.error("Order Delivery Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
