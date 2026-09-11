-- Schedule the cleanup job to run at midnight every day
-- Uses pg_net to call the Next.js API endpoint securely

SELECT cron.unschedule('cleanup-expired-search-cache');

SELECT cron.schedule(
  'cleanup-expired-search-cache',
  '0 0 * * *',
  $$
    SELECT net.http_get(
        url:='https://c2g-logistics.com/api/cron/cleanup-cache',
        headers:='{"Authorization": "Bearer 651fd01d706691af0f260762060047a0c9f696c164946b68f44ebf13b3accaee"}'::jsonb
    );
  $$
);
