'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';
import { broadcastNotification } from '@/utils/notifications';

export async function createMarketingAnnouncement(title: string, message: string, type: string) {
  const supabase = createAdminClient();
  
  try {
    const { error } = await supabase.from('announcements').insert({
      title,
      message,
      type,
      icon: 'megaphone',
      is_active: true,
      start_date: new Date().toISOString(),
      target_audience: 'all'
    });

    if (error) throw error;
    
    // Broadcast notification in background
    broadcastNotification({
      title: "New Announcement",
      message: title,
      type: "system",
      priority: "info",
      link: "/dashboard"
    }).catch(console.error);

    revalidatePath('/admin/commerce/marketing');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create announcement' };
  }
}

export async function createShopAd(imageUrl: string, link: string) {
  const supabase = createAdminClient();
  
  try {
    const { error } = await supabase.from('shop_ads').insert({
      image_url: imageUrl,
      link,
      is_active: true
    });

    if (error) throw error;
    
    revalidatePath('/admin/commerce/marketing');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create shop ad' };
  }
}

export async function createTelegramBroadcast(messageText: string, audience: string, channel: string) {
  const supabase = createAdminClient();
  
  try {
    const { error } = await supabase.from('telegram_broadcasts').insert({
      message_text: messageText,
      audience,
      channel,
      status: 'pending'
    });

    if (error) throw error;
    
    revalidatePath('/admin/commerce/marketing');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create broadcast' };
  }
}

export async function deleteMarketingItem(id: string, table: 'announcements' | 'shop_ads' | 'telegram_broadcasts') {
  const supabase = createAdminClient();
  
  try {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
    
    revalidatePath('/admin/commerce/marketing');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete item' };
  }
}

export async function bulkDeleteMarketingItems(ids: string[], table: 'announcements' | 'shop_ads' | 'telegram_broadcasts') {
  const supabase = createAdminClient();
  
  try {
    const { error } = await supabase.from(table).delete().in('id', ids);
    if (error) throw error;
    
    revalidatePath('/admin/commerce/marketing');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to bulk delete items' };
  }
}

export async function resendMarketingItem(id: string, table: 'announcements' | 'telegram_broadcasts') {
  const supabase = createAdminClient();
  
  try {
    const now = new Date().toISOString();
    
    // First, update the item's date to make it 'new'
    // announcements use start_date, broadcasts might just use created_at, but we'll update what makes sense.
    const updateData: any = {};
    if (table === 'announcements') {
      updateData.start_date = now;
      updateData.created_at = now;
    } else {
      updateData.created_at = now;
      updateData.status = 'pending'; // reset status for broadcasts
    }

    const { data: item, error: updateError } = await supabase
      .from(table)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;
    if (!item) throw new Error('Item not found');

    // Trigger notification if it's an announcement
    if (table === 'announcements') {
      broadcastNotification({
        title: "New Announcement",
        message: item.title,
        type: "system",
        priority: "info",
        link: "/dashboard"
      }).catch(console.error);
    }
    
    revalidatePath('/admin/commerce/marketing');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to resend item' };
  }
}
