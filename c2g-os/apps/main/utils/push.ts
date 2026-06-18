import webpush from 'web-push';

let isVapidSet = false;

export async function sendPushNotification(subscription: any, payload: any) {
  try {
    if (!isVapidSet) {
      if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
        webpush.setVapidDetails(
          'mailto:support@c2g-logistics.com',
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
          process.env.VAPID_PRIVATE_KEY
        );
        isVapidSet = true;
      } else {
        console.warn('VAPID keys not set. Skipping push notification.');
        return;
      }
    }
    await webpush.sendNotification(subscription, JSON.stringify(payload));
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}
