import type { Metadata } from "next";
import Image from "next/image";
import { buildMetadata } from "@/lib/seo";
import { getAllTeamMembers } from "@/lib/firestoreServerService";
import { company } from "@/data/company";
import { personSchema, breadcrumbSchema } from "@/lib/structuredData";

import { RevealGrid, RevealCard } from "@/components/ui/RevealGrid";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";

export const metadata: Metadata = buildMetadata({
  title: "Meet Our Team — Real Estate Advisors | RealHubb",
  // 147 chars ✅
  description:
    "Meet RealHubb's advisors — Sanjeev Ranjan Singh, Srikanth B and more. Expert property consultants across Bangalore, Hyderabad & Chennai.",
  keywords:
    "Sanjeev Ranjan Singh, Srikanth B, RealHubb team, real estate advisor Bangalore, property advisor",
  canonical: `${SITE_URL}/team`,
});

export default async function TeamPage() {
  const team = await getAllTeamMembers().catch(() => []);

  const breadcrumbs = [
    { name: "Home", url: SITE_URL },
    { name: "Our Team", url: `${SITE_URL}/team` },
  ];

  return (
    <>
      {team.map((m) => (
        <script key={m.id} type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema({ name: m.name, role: m.role, linkedin: m.linkedin, specialisation: m.specialisation })) }} />
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(breadcrumbs)) }} />

      <div className="pt-20">
        <div className="bg-navy py-14 page-padding">

          <h1 className="font-heading text-3xl md:text-5xl text-white font-normal mt-4">
            Meet the RealHubb Team
          </h1>
          <p className="text-white/60 text-base mt-3 max-w-2xl">
            Our advisors — including {company.advisors.join(" and ")} — are dedicated to helping
            you find the perfect property with zero brokerage and full transparency.
          </p>
        </div>

        <div className="page-padding py-14">
          <RevealGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((m) => (
              <RevealCard key={m.id}>
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow h-full">
                <div className="bg-navy/5 h-48 flex items-center justify-center relative overflow-hidden">
                  {m.photo ? (
                    <Image
                      src={m.photo}
                      alt={m.name}
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-navy/20 rounded-full flex items-center justify-center">
                      <span className="font-heading text-navy text-4xl font-normal">{m.name[0]}</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="font-heading text-navy text-xl font-normal">{m.name}</h2>
                  <p className="section-overline text-gold mt-1 mb-3">{m.role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{m.bio}</p>
                  <div className="space-y-1.5 text-xs text-gray-400">
                    <p><span className="text-navy/60">Specialises in:</span> {m.specialisation}</p>
                    <p><span className="text-navy/60">Experience:</span> {m.experience}</p>
                    <p><span className="text-navy/60">Languages:</span> {(m.languages ?? []).join(", ")}</p>
                  </div>
                  {(m.achievements ?? []).length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {m.achievements.map((a) => (
                        <span key={a} className="px-2 py-0.5 bg-gold/10 text-gold rounded-full text-[10px]">{a}</span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 flex gap-3">
                    {m.phone && (
                      <a href={`tel:${m.phone}`} className="flex-1 text-center py-2 bg-navy text-white text-xs rounded-lg hover:bg-navy/90 transition-colors">
                        Call
                      </a>
                    )}
                    {m.linkedin && (
                      <a href={m.linkedin} target="_blank" rel="noopener noreferrer"
                        className="flex-1 text-center py-2 border border-navy/20 text-navy text-xs rounded-lg hover:border-gold hover:text-gold transition-colors">
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </div>
              </RevealCard>
            ))}
          </RevealGrid>
        </div>
      </div>
    </>
  );
}
