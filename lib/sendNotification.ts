export interface NotifPayload {
  title: string;
  body: string;
  url?: string;
}

export async function sendNotification(payload: NotifPayload, idToken?: string): Promise<{ sent: number; failed: number }> {
  console.warn("Push notifications require serverless hosting (e.g. Vercel or Firebase Cloud Functions) to execute the Web-Push backend. This feature is disabled on static shared hosting.");
  throw new Error("Push notifications are disabled in static export mode. Deploy this logic via a Firebase Cloud Function to enable it.");
}
