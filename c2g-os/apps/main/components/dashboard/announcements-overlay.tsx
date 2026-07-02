"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, AlertTriangle, Megaphone, Star, Info, Mailbox } from "lucide-react";
import {
  getActiveAnnouncements,
  dismissAnnouncement,
  dismissAllAnnouncements,
} from "../../app/dashboard/announcement-actions";

type Announcement = {
  id: string;
  title: string;
  message: string;
  type: string;
  icon: string;
  priority: number;
  created_at: string;
  action_label?: string;
  action_url?: string;
};

export default function AnnouncementsOverlay() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const { announcements: data } = await getActiveAnnouncements();
        if (data && data.length > 0) {
          setAnnouncements(data);
          // Small delay before showing modal
          setTimeout(() => setIsOpen(true), 500);
        }
      } catch (error) {
        console.error("Failed to load announcements", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnnouncements();
  }, []);

  const handleDismiss = async (id: string) => {
    // Optimistic UI update
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    if (announcements.length <= 1) {
      setTimeout(() => setIsOpen(false), 500);
    }
    await dismissAnnouncement(id);
  };

  const handleDismissAll = async () => {
    const ids = announcements.map((a) => a.id);
    setAnnouncements([]);
    setTimeout(() => setIsOpen(false), 500);
    await dismissAllAnnouncements(ids);
  };

  if (isLoading || !isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm pointer-events-auto"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl glass-panel pointer-events-auto overflow-hidden flex flex-col max-h-[85vh] shadow-2xl border-primary/20"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 sm:p-8 border-b border-border/50 bg-secondary/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">Updates & Announcements</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content List */}
            <div className="relative flex-1 overflow-hidden min-h-[300px]">
              <div className="absolute inset-0 overflow-y-auto p-6 sm:p-8 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <AnimatePresence>
                  {announcements.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-10 text-center"
                    >
                      <Mailbox className="w-16 h-16 text-muted-foreground/30 mb-4" />
                      <h4 className="text-lg font-bold">You're all caught up!</h4>
                      <p className="text-muted-foreground mt-1">No new announcements at this time.</p>
                    </motion.div>
                  ) : (
                    announcements.map((ann) => (
                      <motion.div
                        key={ann.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className={`relative p-6 sm:p-8 rounded-2xl border ${
                          ann.priority > 5 
                            ? "bg-primary/5 border-primary/30" 
                            : "bg-secondary/20 border-border/50"
                        }`}
                      >
                        <button
                          onClick={() => handleDismiss(ann.id)}
                          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/20 dark:hover:bg-white/20 transition-colors text-muted-foreground"
                          title="Dismiss"
                        >
                          <X className="w-4 h-4" />
                        </button>
  
                        <div className="pr-8">
                          <div className="flex items-center gap-2 mb-2">
                            {ann.priority > 5 && (
                              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                <Star className="w-3 h-3" /> Priority
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground font-medium">
                              {new Date(ann.created_at).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                              })}
                            </span>
                          </div>
                          <h4 className="text-xl font-bold mb-3 leading-tight flex items-center gap-3">
                            <IconSelector type={ann.icon} />
                            {ann.title}
                          </h4>
                          <p className="text-base text-muted-foreground leading-relaxed">
                            {ann.message}
                          </p>
                          
                          {ann.action_url && ann.action_label && (
                            <a
                              href={ann.action_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center mt-6 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
                            >
                              {ann.action_label} <span className="ml-1">→</span>
                            </a>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
              
              {/* Scroll Indicator Gradient */}
              {announcements.length > 2 && (
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
              )}
            </div>

            {/* Footer */}
            {announcements.length > 0 && (
              <div className="p-5 sm:p-6 border-t border-border/50 bg-secondary/30 flex justify-end">
                <button
                  onClick={handleDismissAll}
                  className="px-6 py-2.5 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
                >
                  Dismiss All
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function IconSelector({ type }: { type: string }) {
  switch (type) {
    case "alert-triangle":
      return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    case "megaphone":
      return <Megaphone className="w-5 h-5 text-blue-500" />;
    case "star":
      return <Star className="w-5 h-5 text-yellow-500" />;
    default:
      return <Info className="w-5 h-5 text-primary" />;
  }
}
