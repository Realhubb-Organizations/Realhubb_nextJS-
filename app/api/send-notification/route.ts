import { type NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { getAdminDb, getAdminAuth } from "@/lib/firebase-admin";

const VAPID_SUBJECT = process.env.VAPID_SUBJECT ?? "mailto:info@realhubb.in";
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  try {
    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  } catch (err) {
    console.error("Error setting VAPID details:", err);
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Verify Authorization Header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const auth = getAdminAuth();
    try {
      await auth.verifyIdToken(idToken);
    } catch (authErr) {
      console.error("Push notification unauthorized:", authErr);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json() as { title: string; body: string; url?: string };

    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
      console.warn("VAPID keys are not configured. Skipping push notification sending.");
      return NextResponse.json({
        sent: 0,
        expired: 0,
        warning: "VAPID keys are not configured on the server."
      });
    }

    const db = getAdminDb();
    const snap = await db.collection("pushSubscriptions").get();
    const expired: string[] = [];

    const sends = snap.docs.map(async (docSnap) => {
      const { subscription } = docSnap.data() as {
        subscription: webpush.PushSubscription;
      };
      try {
        await webpush.sendNotification(
          subscription,
          JSON.stringify({ title: body.title, body: body.body, url: body.url ?? "/" })
        );
      } catch (err: unknown) {
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 410 || status === 404) expired.push(docSnap.id);
      }
    });

    await Promise.allSettled(sends);

    // Clean expired subscriptions
    for (const id of expired) {
      await db.collection("pushSubscriptions").doc(id).delete();
    }

    return NextResponse.json({ sent: snap.size - expired.length, expired: expired.length });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
