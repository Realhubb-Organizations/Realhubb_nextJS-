import { type NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, message, type, city, propertyName, position, experience, resumeUrl, coverLetter } = body;

    // Basic Validation
    if (!name || !phone) {
      return NextResponse.json({ error: "Name and Phone are required fields" }, { status: 400 });
    }

    // 1. Log to Firestore
    let firestoreSaved = false;
    let firestoreId = "";
    try {
      const db = getAdminDb();
      const leadData = {
        name,
        phone,
        email: email || "",
        message: message || coverLetter || "",
        timestamp: new Date().toISOString(),
        type: type || "general",
        city: city || "",
        propertyName: propertyName || "",
        position: position || "",
        experience: experience || "",
        resumeUrl: resumeUrl || "",
      };
      
      const docRef = await db.collection("leads").add(leadData);
      firestoreSaved = true;
      firestoreId = docRef.id;
    } catch (fsErr) {
      console.error("Failed to save lead to Firestore:", fsErr);
    }

    // 2. Forward to Google Sheet & Email (Google Apps Script Web App)
    let googleSheetSaved = false;
    const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbyZHMdf-F61QxgHF2Gbx3A_rltJBD7Xn7W_0S6T4e0XuLYFGzKkaxwQ3dlRVTxVkbc_wg/exec"; // Default/Fallback to existing macro if set

    if (googleScriptUrl) {
      try {
        const payload = {
          timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
          formType: type || "General Inquiry",
          name,
          phone,
          email: email || "N/A",
          city: city || "N/A",
          propertyName: propertyName || "N/A",
          position: position || "N/A",
          experience: experience ? experience + " years" : "N/A",
          resumeUrl: resumeUrl || "N/A",
          message: message || coverLetter || "N/A",
        };

        const response = await fetch(googleScriptUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          // Note: fetch to Google Script redirect can sometimes cause CORS issues on frontend, 
          // but from Next.js server route we can fetch normally and follow redirects.
          redirect: "follow",
        });

        if (response.ok) {
          googleSheetSaved = true;
        } else {
          console.warn("Google script returned status:", response.status);
        }
      } catch (gsErr) {
        console.error("Failed to forward lead to Google Apps Script:", gsErr);
      }
    }

    return NextResponse.json({
      success: true,
      leadId: firestoreId,
      firestoreSaved,
      googleSheetSaved,
    });

  } catch (err) {
    console.error("Error in leads API route:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
