'use client';

import { useState } from 'react';
import { markAsRead, markAllAsRead } from './actions';
import { Bell, Check, CheckCircle2, Package, MapPin, CreditCard, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotificationsClient({ initialNotifications }: { initialNotifications: any[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const router = useRouter();

  const handleMarkAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    await markAsRead(id);
    router.refresh(); // Refresh to update bell icon count
  };

  const handleMarkAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    await markAllAsRead();
    router.refresh();
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'payment': return <CreditCard className="w-5 h-5 text-green-500" />;
      case 'shipment': return <Package className="w-5 h-5 text-blue-500" />;
      case 'order': return <ShoppingBag className="w-5 h-5 text-purple-500" />;
      case 'warehouse': return <MapPin className="w-5 h-5 text-orange-500" />;
      default: return <Bell className="w-5 h-5 text-primary" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-secondary/30 p-4 rounded-2xl border border-border/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold">You have {unreadCount} unread notifications</p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllAsRead}
            className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div 
              key={notification.id}
              onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
              className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${
                notification.is_read 
                  ? 'bg-background/50 border-border/50 opacity-70' 
                  : 'bg-secondary/40 border-primary/20 shadow-sm cursor-pointer hover:bg-secondary/60'
              }`}
            >
              <div className={`mt-0.5 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notification.is_read ? 'bg-secondary' : 'bg-background shadow-sm'}`}>
                {getIcon(notification.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <h4 className={`font-bold ${notification.is_read ? 'text-foreground/80' : 'text-foreground'}`}>
                    {notification.title}
                  </h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(notification.created_at).toLocaleString('en-GB', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${notification.is_read ? 'text-muted-foreground' : 'text-foreground/90 font-medium'}`}>
                  {notification.message}
                </p>
              </div>
              {!notification.is_read && (
                <button 
                  onClick={(e) => { e.stopPropagation(); handleMarkAsRead(notification.id); }}
                  className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-background"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 px-4 glass-panel border-dashed">
            <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-lg font-bold mb-1">No notifications yet</h3>
            <p className="text-muted-foreground text-sm">When you get updates on your packages or orders, they'll appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
