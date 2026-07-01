import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // 1. Log to Firestore using Admin SDK (bypasses Firestore Security Rules)
    let leadId = "";
    try {
      const db = getAdminDb();
      const leadData = {
        name: data.name || "N/A",
        phone: data.phone || "N/A",
        email: data.email || "",
        message: data.message || data.coverLetter || "",
        timestamp: new Date().toISOString(),
        type: data.type || "general",
        city: data.city || "",
        propertyName: data.propertyName || "",
        position: data.position || "",
        experience: data.experience || "",
        resumeUrl: data.resumeUrl || "",
      };

      const docRef = await db.collection("leads").add(leadData);
      leadId = docRef.id;
    } catch (dbErr) {
      console.error("[Leads API] Firestore write failed:", dbErr);
      // We still want to proceed and forward to Google Sheets even if local Firestore logs fail
    }

    // 2. Forward to Google Sheet & Email (Google Apps Script Web App)
    const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL;

    if (googleScriptUrl) {
      try {
        const payload = {
          timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
          formType: data.type || "General Inquiry",
          name: data.name || "N/A",
          phone: data.phone || "N/A",
          email: data.email || "N/A",
          city: data.city || "N/A",
          propertyName: data.propertyName || "N/A",
          position: data.position || "N/A",
          experience: data.experience ? data.experience + (data.experience.includes("year") ? "" : " years") : "N/A",
          resumeUrl: data.resumeUrl || "N/A",
          message: data.message || data.coverLetter || "N/A",
        };

        const response = await fetch(googleScriptUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          console.error(`[Leads API] Google Apps Script Web App responded with status: ${response.status}`);
        }
      } catch (gsErr) {
        console.error("[Leads API] Failed to forward lead to Google Apps Script:", gsErr);
      }
    } else {
      console.warn("[Leads API] GOOGLE_SCRIPT_URL is not defined in the environment variables.");
    }

    return NextResponse.json({ success: true, leadId });
  } catch (err) {
    console.error("[Leads API] Error in lead API route:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
