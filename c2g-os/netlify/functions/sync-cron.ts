import { schedule } from "@netlify/functions";

// This runs every hour at minute 0
export const handler = schedule("0 * * * *", async (event) => {
  // Replace this with your actual production domain
  const API_URL = "https://YOUR_DOMAIN.com/api/cron/sync-mall-orders";
  const CRON_SECRET = process.env.CRON_SECRET || "";

  console.log("Triggering Mall Order Sync Cron Job...");

  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${CRON_SECRET}`
      }
    });

    const data = await response.json();
    console.log("Cron execution result:", data);

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Failed to execute cron:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to trigger cron" }),
    };
  }
});
