import { createClient } from "@supabase/supabase-js";

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("aliexpress_credentials")
    .select("access_token, expires_at")
    .eq("id", "default")
    .single();

  if (error) {
    console.error("DB Error:", error);
  } else {
    console.log("Token:", data.access_token);
    console.log("Expires:", data.expires_at);
    
    // Check if it's expired
    const expiresAt = new Date(data.expires_at);
    if (new Date().getTime() + 5 * 60 * 1000 >= expiresAt.getTime()) {
      console.log("EXPIRED!");
    } else {
      console.log("VALID.");
    }
  }
}

main();
