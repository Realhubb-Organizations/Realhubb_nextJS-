export interface NotifPayload {
  title: string;
  body: string;
  url?: string;
}

export async function sendNotification(payload: NotifPayload) {
  const res = await fetch("/api/send-notification", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
