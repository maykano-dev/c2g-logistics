"use server";

import { createClient } from "@/utils/supabase/server";

export async function getActiveAnnouncements() {
  const supabase = await createClient();

  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData?.user) {
    return { announcements: [] };
  }

  const userId = userData.user.id;
  const now = new Date().toISOString();

  // Fetch active announcements
  const { data: allAnnouncements, error: fetchError } = await supabase
    .from("announcements")
    .select("*")
    .eq("is_active", true)
    .or(`start_date.is.null,start_date.lte.${now}`)
    .or(`end_date.is.null,end_date.gte.${now}`)
    .order("priority", { ascending: false })
    .order("created_at", { ascending: false });

  if (fetchError || !allAnnouncements || allAnnouncements.length === 0) {
    return { announcements: [] };
  }

  // Fetch dismissed announcements
  const { data: dismissed } = await supabase
    .from("user_dismissed_announcements")
    .select("announcement_id")
    .eq("user_id", userId);

  const dismissedIds = dismissed ? dismissed.map((d) => d.announcement_id) : [];

  // Filter out dismissed and map DB fields to UI fields
  const activeAnnouncements = allAnnouncements
    .filter((ann) => !dismissedIds.includes(ann.id))
    .map((ann) => ({
      ...ann,
      message: ann.message || ann.content || "", // Handle schema differences
      icon: ann.icon || "megaphone",
      type: ann.type || "info",
      priority: ann.priority || 1,
    }));

  return { announcements: activeAnnouncements };
}

export async function dismissAnnouncement(announcementId: string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return { success: false };

  const { error } = await supabase.from("user_dismissed_announcements").insert({
    user_id: userData.user.id,
    announcement_id: announcementId,
  });

  if (error) {
    console.error("Failed to dismiss announcement:", error);
    // If it's a duplicate key error (already dismissed), that's fine.
    if (error.code !== '23505') {
      return { success: false, error };
    }
  }

  return { success: true };
}

export async function dismissAllAnnouncements(announcementIds: string[]) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user || announcementIds.length === 0) return { success: false };

  const dismissals = announcementIds.map((id) => ({
    user_id: userData.user.id,
    announcement_id: id,
  }));

  const { error } = await supabase
    .from("user_dismissed_announcements")
    .insert(dismissals);

  if (error) {
    console.error("Failed to dismiss all announcements:", error);
    if (error.code !== '23505') {
      return { success: false, error };
    }
  }

  return { success: true };
}
