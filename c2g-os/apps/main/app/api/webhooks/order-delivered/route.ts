import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendPushNotification } from "../../../../utils/push";

// Initialize a Supabase admin client to bypass RLS for webhook operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
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

      if (!customerId) {
        return NextResponse.json({ message: "No customer ID found on order" }, { status: 200 });
      }

      // 1. Fetch user's push subscriptions
      const { data: subscriptions, error: subError } = await supabaseAdmin
        .from("push_subscriptions")
        .select("subscription")
        .eq("user_id", customerId);

      if (subError) {
        console.error("Error fetching push subscriptions:", subError);
      }

      // 2. Create in-app notification
      const { error: notifError } = await supabaseAdmin
        .from("notifications")
        .insert({
          user_id: customerId,
          title: "Order Delivered!",
          message: `Your C2G Mall order #${orderId.slice(0,8)} has been delivered. Tap to leave a review!`,
          link: `/dashboard/mall-orders/${orderId}`,
          read: false,
        });

      if (notifError) {
        console.error("Error creating in-app notification:", notifError);
      }

      // 3. Send Push Notifications
      if (subscriptions && subscriptions.length > 0) {
        const pushPayload = {
          title: "Order Delivered! 📦",
          body: `Your C2G Mall order has arrived. Tap to review your items!`,
          url: `/dashboard/mall-orders/${orderId}`,
        };

        const pushPromises = subscriptions.map((sub: any) =>
          sendPushNotification(sub.subscription, pushPayload)
        );

        await Promise.allSettled(pushPromises);
      }

      return NextResponse.json({ success: true, message: "Review notifications sent" });
    }

    return NextResponse.json({ message: "Ignored: Status not delivered" }, { status: 200 });
  } catch (error: any) {
    console.error("Order Delivery Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
