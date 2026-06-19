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

  // Filter out dismissed
  const activeAnnouncements = allAnnouncements.filter(
    (ann) => !dismissedIds.includes(ann.id)
  );

  return { announcements: activeAnnouncements };
}

export async function dismissAnnouncement(announcementId: string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return { success: false };

  const { error } = await supabase.from("user_dismissed_announcements").upsert({
    user_id: userData.user.id,
    announcement_id: parseInt(announcementId),
  }, { onConflict: "user_id, announcement_id" });

  return { success: !error };
}

export async function dismissAllAnnouncements(announcementIds: string[]) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user || announcementIds.length === 0) return { success: false };

  const dismissals = announcementIds.map((id) => ({
    user_id: userData.user.id,
    announcement_id: parseInt(id),
  }));

  const { error } = await supabase
    .from("user_dismissed_announcements")
    .upsert(dismissals, { onConflict: "user_id, announcement_id" });

  return { success: !error };
}
