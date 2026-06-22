"use client";

import { useState } from "react";
import { Briefcase, MapPin, Clock, DollarSign, ArrowRight, Send } from "lucide-react";
import { careerJobs } from "@/data/careerJobs";

export default function JobOpeningsList() {
  const [selectedJob, setSelectedJob] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {careerJobs.map((job) => (
        <div key={job.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div className="flex-1">
              <h3 className="text-white font-normal text-xl mb-1">{job.title}</h3>
              <p className="text-white/60 text-sm mb-4">{job.description}</p>
              <div className="flex flex-wrap gap-4 text-xs text-white/40">
                {[
                  { icon: <Briefcase className="w-3.5 h-3.5 text-gold" />, text: job.department },
                  { icon: <MapPin className="w-3.5 h-3.5 text-gold" />, text: job.location },
                  { icon: <Clock className="w-3.5 h-3.5 text-gold" />, text: job.type },
                  { icon: <DollarSign className="w-3.5 h-3.5 text-gold" />, text: job.salary },
                ].map((item, i) => (
                  <span key={i} className="flex items-center gap-1.5">{item.icon}{item.text}</span>
                ))}
              </div>
            </div>
            <button
              onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
              suppressHydrationWarning
              className="w-full md:w-auto shrink-0 px-5 py-2.5 rounded-full bg-gold hover:bg-gold/90 text-navy font-normal text-sm flex items-center justify-center gap-2 transition-colors duration-200"
            >
              {selectedJob === job.id ? "Hide Details" : "View Details"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {selectedJob === job.id && (
            <div className="pt-6 border-t border-white/10">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-gold text-xs font-normal uppercase tracking-[0.2em] mb-3">
                    Key Responsibilities
                  </h4>
                  <ul className="space-y-2">
                    {job.responsibilities.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                        <span className="text-gold mt-1 shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-gold text-xs font-normal uppercase tracking-[0.2em] mb-3">
                    Requirements
                  </h4>
                  <ul className="space-y-2">
                    {job.requirements.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                        <span className="text-gold mt-1 shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <a href="#apply">
                <button className="px-6 py-2.5 rounded-full border border-gold text-gold text-sm font-normal hover:bg-gold hover:text-navy transition-colors duration-200 flex items-center gap-2">
                  Apply for this role
                  <Send className="w-3.5 h-3.5" />
                </button>
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
