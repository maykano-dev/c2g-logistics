import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Poor man's dotenv to avoid missing module errors
const envFile = fs.readFileSync(".env.local", "utf8");
envFile.split("\n").forEach(line => {
  const [key, ...values] = line.split("=");
  if (key && values.length > 0 && !key.startsWith("#")) {
    process.env[key.trim()] = values.join("=").trim().replace(/^"|"$/g, "");
  }
});

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase.from("announcements").select("*").limit(1);
  console.log("ANNOUNCEMENTS DATA:", data);
  const { data: d2, error: e2 } = await supabase.from("user_dismissed_announcements").select("*").limit(1);
  console.log("DISMISSED DATA:", d2);
  console.log("DISMISSED ERROR:", e2);
}

run();
