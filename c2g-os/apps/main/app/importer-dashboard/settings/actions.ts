"use server";

import { createClient } from "@/utils/supabase/server";

export async function getImporterProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Unauthorized' };

  const { data: importer, error } = await supabase
    .from('importers')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, importer };
}

export async function updateImporterProfile(data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Unauthorized' };

  const { error } = await supabase
    .from('importers')
    .update(data)
    .eq('user_id', user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updatePassword(password: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Unauthorized' };

  const { error } = await supabase.auth.updateUser({
    password: password
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
