-- Note: pg_cron and pg_net extensions must be enabled in your Supabase Dashboard under Database -> Extensions.
-- (They are usually enabled by default on new projects).

-- (If you ever need to stop this cron job, you can run: SELECT cron.unschedule('sync-mall-orders'); )

-- 3. Define the cron schedule (runs at minute 0 of every hour)
-- IMPORTANT: 
-- 1. Change 'https://c2glogistics.com' to your actual domain if it's different.
-- 2. Ensure you add CRON_SECRET="651fd01d706691af0f260762060047a0c9f696c164946b68f44ebf13b3accaee" to your Netlify Environment Variables!
SELECT cron.schedule(
  'sync-mall-orders',
  '0 * * * *',
  $$
    SELECT net.http_get(
        url:='https://c2glogistics.com/api/cron/sync-mall-orders',
        headers:='{"Authorization": "Bearer 651fd01d706691af0f260762060047a0c9f696c164946b68f44ebf13b3accaee"}'::jsonb
    );
  $$
);
