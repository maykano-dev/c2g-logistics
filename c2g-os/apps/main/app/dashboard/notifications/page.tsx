import { getNotifications } from "./actions";
import NotificationsClient from "./notifications-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications | C2G Logistics",
};

export default async function NotificationsPage() {
  const notifications = await getNotifications();

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications Center</h1>
        <p className="text-muted-foreground mt-1">Stay updated on your orders and shipments.</p>
      </div>

      <NotificationsClient initialNotifications={notifications} />
    </div>
  );
}
