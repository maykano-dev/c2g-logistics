import { createClient } from "@supabase/supabase-js";
import { sendPushNotification } from "./push";

/**
 * Centralized utility to create an in-app notification and optionally send a web push notification.
 */
export async function createNotification({
  userId,
  title,
  message,
  type,
  priority = "info",
  link,
  metadata,
}: {
  userId: string;
  title: string;
  message: string;
  type: string;
  priority?: "critical" | "important" | "info" | "marketing";
  link?: string;
  metadata?: any;
}) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.warn("createNotification: Missing Supabase environment variables");
    return { success: false, error: "Missing environment variables" };
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

  try {
    // 1. Insert In-App Notification
    const { error: insertError } = await supabaseAdmin.from("notifications").insert({
      user_id: userId,
      title,
      message,
      type,
      priority,
      link,
      metadata: metadata || {},
      is_read: false,
    });

    if (insertError) {
      console.error("Failed to insert notification:", insertError);
      return { success: false, error: insertError.message };
    }

    // 2. Fetch Push Subscriptions
    const { data: subscriptions, error: subError } = await supabaseAdmin
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth")
      .eq("user_id", userId);

    if (subError) {
      console.error("Error fetching push subscriptions:", subError);
    }

    // 3. Send Web Push
    if (subscriptions && subscriptions.length > 0) {
      const pushPayload = {
        title,
        body: message,
        url: link || "/dashboard/notifications",
      };

      const pushPromises = subscriptions.map((sub: any) => {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth
          }
        };
        return sendPushNotification(pushSubscription, pushPayload);
      });
      await Promise.allSettled(pushPromises);
    }

    return { success: true };
  } catch (err: any) {
    console.error("createNotification error:", err);
    return { success: false, error: err.message };
  }
}
