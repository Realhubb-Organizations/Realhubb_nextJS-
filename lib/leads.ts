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
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Failed to submit lead: status ${res.status}`);
    }

    const result = await res.json();
    return { success: result.success, leadId: result.leadId };
  } catch (err) {
    console.error("Error submitting lead:", err);
    return { success: false };
  }
}
