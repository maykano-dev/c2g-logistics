"use client";

import { Bell, ShoppingBag, Wallet, Info, Check, Trash2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from "@/app/dashboard/notifications/actions";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    setLoading(true);
    const data = await getNotifications();
    setNotifications(data);
    setLoading(false);
  }

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    await loadNotifications();
  };

  const handleMarkRead = async (id: string) => {
    await markAsRead(id);
    await loadNotifications();
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
    await loadNotifications();
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1">Stay updated on your store's activity.</p>
        </div>
        <button 
          onClick={handleMarkAllRead}
          className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          Mark all as read
        </button>
      </div>

      <div className="glass-panel shadow-lg border-border/50 divide-y divide-border/50">
        {notifications.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No notifications found.
          </div>
        )}
        {notifications.map((notif) => {
          let Icon = Info;
          let color = "text-blue-500";
          let bg = "bg-blue-500/10";

          if (notif.type === 'ecom_order_created' || notif.type === 'order') {
            Icon = ShoppingBag;
            color = "text-green-500";
            bg = "bg-green-500/10";
          } else if (notif.type === 'wallet') {
            Icon = Wallet;
            color = "text-amber-500";
            bg = "bg-amber-500/10";
          }

          return (
            <div key={notif.id} className={`p-4 sm:p-6 flex flex-col sm:flex-row gap-4 transition-colors hover:bg-secondary/5 ${!notif.is_read ? 'bg-primary/5' : ''}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${bg}`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                  <h3 className={`text-base font-bold ${!notif.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {notif.title}
                  </h3>
                  <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                    {new Date(notif.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {notif.message}
                </p>
              </div>

              <div className="flex items-center sm:justify-end gap-2 mt-4 sm:mt-0">
                {!notif.is_read && (
                  <button 
                    onClick={() => handleMarkRead(notif.id)}
                    className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(notif.id)}
                  className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-destructive/10 hover:text-destructive transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
