"use client";

import { useState } from "react";
import type { TeamMember } from "@/types/team";
import { Mail, Phone, MessageSquare, Award } from "lucide-react";
import Image from "next/image";

interface Props {
  member: TeamMember;
  index: number;
}

export default function TeamCard({ member: m, index }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="w-full h-[380px] perspective-1000 cursor-pointer"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full duration-700 preserve-3d transition-transform ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front Card */}
        <div className="absolute inset-0 w-full h-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden backface-hidden flex flex-col">
          {/* Photo */}
          <div className="relative h-48 w-full bg-white flex items-center justify-center overflow-hidden border-b border-gray-50">
            {m.photo ? (
              <Image
                src={m.photo}
                alt={m.name}
                fill
                className="object-contain p-1"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            ) : (
              <div className="w-24 h-24 bg-navy/10 rounded-full flex items-center justify-center text-navy font-heading text-4xl">
                {m.name[0]}
              </div>
            )}
          </div>
          {/* Details */}
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-heading text-navy text-lg font-normal mb-1">{m.name}</h3>
              <p className="text-gold text-xs section-overline tracking-wider">{m.role}</p>
            </div>
            <div className="space-y-1 text-[11px] text-gray-400">
              {m.specialisation && (
                <p className="line-clamp-1">
                  <strong className="text-navy/60 font-medium">Speciality:</strong> {m.specialisation}
                </p>
              )}
              {m.experience && (
                <p>
                  <strong className="text-navy/60 font-medium">Experience:</strong> {m.experience}
                </p>
              )}
            </div>
            <div className="pt-3 border-t border-gray-50 text-[10px] text-gray-400 flex items-center justify-between">
              <span>Hover to reveal story</span>
              <span className="text-gold font-normal">View details →</span>
            </div>
          </div>
        </div>

        {/* Back Card (Flipped) */}
        <div className="absolute inset-0 w-full h-full bg-navy text-white rounded-2xl p-6 shadow-xl backface-hidden rotate-y-180 flex flex-col justify-between overflow-y-auto scrollbar-hide">
          <div>
            <h3 className="font-heading text-white text-lg font-normal mb-0.5">{m.name}</h3>
            <p className="text-gold text-[10px] section-overline tracking-wider mb-3">{m.role}</p>
            <p className="text-white/70 text-xs leading-relaxed mb-4 line-clamp-6">
              {m.bio}
            </p>
          </div>

          <div className="space-y-3">
            {m.achievements && m.achievements.length > 0 && (
              <div className="space-y-1">
                <p className="text-[10px] section-overline text-gold tracking-widest flex items-center gap-1">
                  <Award className="w-3 h-3" /> Key Milestones
                </p>
                <div className="flex flex-wrap gap-1">
                  {m.achievements.slice(0, 2).map((ach, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-white/10 rounded text-[9px] text-white/80">
                      {ach}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
              {m.phone && (
                <a
                  href={`tel:${m.phone}`}
                  title="Call Advisor"
                  className="flex-1 bg-white text-navy hover:bg-gold hover:text-navy text-center py-1.5 rounded text-[11px] font-medium transition-colors"
                >
                  Call
                </a>
              )}
              {m.linkedin && (
                <a
                  href={m.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="LinkedIn Profile"
                  className="w-8 h-8 rounded bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-colors text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.762 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11.334 20h-3v-10h3v10zm-1.5-11.269c-.966 0-1.75-.792-1.75-1.77s.784-1.77 1.75-1.77 1.75.792 1.75 1.77-.784 1.77-1.75 1.77zm13.834 11.269h-3v-5.604c0-1.337-.027-3.06-1.865-3.06-1.866 0-2.153 1.46-2.153 2.967v5.697h-3v-10h2.879v1.367h.041c.401-.758 1.381-1.558 2.844-1.558 3.04 0 3.604 2.004 3.604 4.61v5.581z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
