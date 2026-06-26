export interface NotifPayload {
  title: string;
  body: string;
  url?: string;
}

export async function sendNotification(payload: NotifPayload, idToken?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (idToken) {
    headers["Authorization"] = `Bearer ${idToken}`;
  }
  const res = await fetch("/api/send-notification", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to send notification");
  }

  const data = await res.json();
  return {
    sent: data.sent ?? 0,
    failed: data.expired ?? 0,
  };
}
