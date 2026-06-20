'use client';

import { useState } from 'react';
import { markAsRead, markAllAsRead, deleteNotification } from './actions';
import { Bell, Check, CheckCircle2, Package, MapPin, CreditCard, ShoppingBag, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotificationsClient({ initialNotifications }: { initialNotifications: any[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const handleMarkAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    await markAsRead(id);
    router.refresh(); // Refresh to update bell icon count
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeletingId(id);
    await deleteNotification(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    setDeletingId(null);
    router.refresh();
  };

  const handleNotificationClick = async (notification: any) => {
    if (!notification.is_read) {
      await handleMarkAsRead(notification.id);
    }
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const handleMarkAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    await markAllAsRead();
    router.refresh();
  };

  const getIcon = (type: string) => {
    if (!type) return <Bell className="w-5 h-5" />;
    if (type.includes('payment')) return <CreditCard className="w-5 h-5" />;
    if (type.includes('package') || type.includes('shipment')) return <Package className="w-5 h-5" />;
    if (type.includes('order')) return <ShoppingBag className="w-5 h-5" />;
    if (type.includes('warehouse')) return <MapPin className="w-5 h-5" />;
    return <Bell className="w-5 h-5" />;
  };

  const getPriorityStyles = (priority: string, isRead: boolean) => {
    if (isRead) return { 
      bg: 'bg-background/50 hover:bg-secondary/20', 
      border: 'border-border/50', 
      iconBg: 'bg-secondary text-muted-foreground',
      opacity: 'opacity-70'
    };
    
    switch (priority) {
      case 'critical':
        return { bg: 'bg-destructive/10 hover:bg-destructive/20', border: 'border-destructive/30', iconBg: 'bg-background shadow-sm text-destructive', opacity: '' };
      case 'important':
        return { bg: 'bg-amber-500/10 hover:bg-amber-500/20', border: 'border-amber-500/30', iconBg: 'bg-background shadow-sm text-amber-500', opacity: '' };
      case 'marketing':
        return { bg: 'bg-green-500/10 hover:bg-green-500/20', border: 'border-green-500/30', iconBg: 'bg-background shadow-sm text-green-500', opacity: '' };
      case 'info':
      default:
        return { bg: 'bg-secondary/40 hover:bg-secondary/60', border: 'border-primary/20', iconBg: 'bg-background shadow-sm text-primary', opacity: '' };
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
          notifications.map((notification) => {
            const styles = getPriorityStyles(notification.priority, notification.is_read);
            
            return (
              <div 
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer shadow-sm ${styles.bg} ${styles.border} ${styles.opacity}`}
              >
                <div className={`mt-0.5 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${styles.iconBg}`}>
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
                <div className="flex items-center gap-1 shrink-0">
                  {!notification.is_read && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleMarkAsRead(notification.id); }}
                      className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-background"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={(e) => handleDelete(e, notification.id)}
                    disabled={deletingId === notification.id}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-full hover:bg-background disabled:opacity-50"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
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
