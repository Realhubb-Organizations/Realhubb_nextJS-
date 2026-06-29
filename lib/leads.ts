import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

export interface LeadSubmission {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  type?: string;
  city?: string;
  propertyName?: string;
  position?: string;
  experience?: string;
  resumeUrl?: string;
  coverLetter?: string;
}

export async function submitLead(data: LeadSubmission): Promise<{ success: boolean; leadId?: string }> {
  try {
    // 1. Log to Firestore
    const leadData = {
      name: data.name,
      phone: data.phone,
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

    const docRef = await addDoc(collection(db, "leads"), leadData);

    // 2. Forward to Google Sheet & Email (Google Apps Script Web App)
    const googleScriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

    if (googleScriptUrl) {
      try {
        const payload = {
          timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
          formType: data.type || "General Inquiry",
          name: data.name,
          phone: data.phone,
          email: data.email || "N/A",
          city: data.city || "N/A",
          propertyName: data.propertyName || "N/A",
          position: data.position || "N/A",
          experience: data.experience ? data.experience + " years" : "N/A",
          resumeUrl: data.resumeUrl || "N/A",
          message: data.message || data.coverLetter || "N/A",
        };

        // Note: Using mode: "no-cors" is critical so the browser doesn't block the Apps Script 302 redirect.
        await fetch(googleScriptUrl, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } catch (gsErr) {
        console.error("Failed to forward lead to Google Apps Script:", gsErr);
      }
    }

    return { success: true, leadId: docRef.id };
  } catch (err) {
    console.error("Error submitting lead:", err);
    return { success: false };
  }
}
