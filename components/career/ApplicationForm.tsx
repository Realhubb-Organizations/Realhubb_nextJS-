"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { trackLead } from "@/lib/ga";
import { careerJobs } from "@/data/careerJobs";
import { uploadRawToCloudinary } from "@/lib/uploadToCloudinary";
import { submitLead } from "@/lib/leads";

const inputClass =
  "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold disabled:opacity-60";
const labelClass = "block text-[10px] font-normal text-navy uppercase tracking-[0.15em] mb-1.5";

export default function ApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", position: "", experience: "",
    resume: null as File | null, coverLetter: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        e.target.value = "";
        return;
      }
      setFormData({ ...formData, resume: file });
    }
  };

  const [uploadProgressMsg, setUploadProgressMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(false);
    setUploadProgressMsg("");
    try {
      let resumeUrl = "";
      if (formData.resume) {
        setUploadProgressMsg("Uploading resume...");
        resumeUrl = await uploadRawToCloudinary(formData.resume);
      }

      setUploadProgressMsg("Saving application...");
      const res = await submitLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        experience: formData.experience,
        resumeUrl: resumeUrl || "No file uploaded",
        coverLetter: formData.coverLetter || "",
        type: "career",
      });

      if (res.success) {
        trackLead("career");
        setSubmitted(true);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Error submitting application:", err);
      setError(true);
    } finally {
      setIsSubmitting(false);
      setUploadProgressMsg("");
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <p className="font-heading text-green-700 text-xl mb-2">Application Received!</p>
        <p className="text-green-600 text-sm">
          Thank you for applying. We&apos;ll review your application and get back to you within 48 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Full Name *</label>
          <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className={inputClass} placeholder="Enter your full name" disabled={isSubmitting} suppressHydrationWarning />
        </div>
        <div>
          <label className={labelClass}>Email *</label>
          <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className={inputClass} placeholder="your.email@example.com" disabled={isSubmitting} suppressHydrationWarning />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Phone Number *</label>
          <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className={inputClass} placeholder="+91 XXXXX XXXXX" disabled={isSubmitting} suppressHydrationWarning />
        </div>
        <div>
          <label className={labelClass}>Position Applied For *</label>
          <select name="position" required value={formData.position} onChange={handleInputChange} className={inputClass} disabled={isSubmitting} suppressHydrationWarning>
            <option value="">Select a position</option>
            {careerJobs.map((job) => (
              <option key={job.id} value={job.title}>{job.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Years of Experience *</label>
        <input type="text" name="experience" required value={formData.experience} onChange={handleInputChange} className={inputClass} placeholder="e.g., 3 years" disabled={isSubmitting} suppressHydrationWarning />
      </div>

      <div>
        <label className={labelClass}>Upload Resume * (PDF, DOC, DOCX — Max 5MB)</label>
        <input type="file" name="resume" required onChange={handleFileChange} accept=".pdf,.doc,.docx" className={`${inputClass} file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-gold/10 file:text-gold file:text-xs file:font-normal cursor-pointer`} disabled={isSubmitting} suppressHydrationWarning />
        {formData.resume && <p className="text-xs text-gray-400 mt-1.5">Selected: {formData.resume.name}</p>}
      </div>

      <div>
        <label className={labelClass}>Cover Letter (Optional)</label>
        <textarea name="coverLetter" value={formData.coverLetter} onChange={handleInputChange} rows={5} className={inputClass} placeholder="Tell us why you're a great fit for this role…" disabled={isSubmitting} />
      </div>

      {error && (
        <p className="text-sm text-red-500 text-center">
          There was an error submitting your application. Please try again or email us directly.
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        suppressHydrationWarning
        className="w-full py-3 rounded-full bg-gold hover:bg-gold/90 text-navy font-normal text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> {uploadProgressMsg || "Submitting…"}</>
        ) : (
          <><Send className="h-4 w-4" /> Submit Application</>
        )}
      </button>

      <p className="text-xs text-center text-gray-400">
        By submitting this form, you agree to our privacy policy and terms of service.
      </p>
    </form>
  );
}
