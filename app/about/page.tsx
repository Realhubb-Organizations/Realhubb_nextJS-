import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { company, companyInfo } from "@/data/company";
import {
  BriefcaseBusiness,
  Target,
  Eye,
  Award,
  Users,
  TrendingUp,
  MessageSquare,
  MapPin,
  FileText,
  HeadphonesIcon,
  Home,
  Rocket,
} from "lucide-react";
import { getAllTeamMembers, getPublishedFaqsByPage } from "@/lib/firestoreServerService";
import TeamCard from "@/components/team/TeamCard";
import CountingNumber from "@/components/ui/counting_text";
import { FadeInOnScroll } from "@/components/FadeInOnScroll";
import { personSchema, breadcrumbSchema, webPageSchema, faqSchema } from "@/lib/structuredData";
import { faqCategories } from "@/data/faqData";
import FaqAccordion from "@/components/faq/FaqAccordion";
import ContactCTA from "@/components/home/ContactCTA";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";

export const metadata: Metadata = buildMetadata({
  title: "About RealHubb Ventures | Real Estate Advisor Bangalore",
  description: "RealHubb Ventures is a trusted real estate partner. We help buyers find verified RERA properties in Bangalore, Hyderabad & Chennai with expert advisory.",
  keywords: "about RealHubb, RealHubb Ventures, real estate partner Bangalore, RERA approved properties",
  canonical: `${SITE_URL}/about`,
  ogImage: "https://www.realhubb.in/og/about-realhubb.jpg",
  ogType: "website",
});

export default async function AboutPage() {
  const team = await getAllTeamMembers().catch(() => []);

  const breadcrumbs = [
    { name: "Home", url: SITE_URL },
    { name: "About Us", url: `${SITE_URL}/about` },
  ];

  // Core Team contains static co-founders
  const coreTeam = companyInfo.team;

  // RealHeroes contains all dynamic database members (excluding co-founders to avoid duplicates)
  const staticNames = companyInfo.team.map((m) => m.name.toLowerCase());
  const realHeroes = team.filter((m) => !staticNames.includes(m.name.toLowerCase()));

  const dbFaqs = await getPublishedFaqsByPage("about");
  const aboutFaqCategory = {
    title: "About RealHubb",
    icon: "🏢",
    items: dbFaqs.length > 0
      ? dbFaqs.map(f => ({ question: f.question, answer: f.answer }))
      : faqCategories.find((c) => c.id === "about")?.items || []
  };

  const aboutFaqItems = aboutFaqCategory.items;

  const webPage = {
    name: "About RealHubb Ventures | Real Estate Channel Partner in Bangalore",
    description: "RealHubb Ventures Pvt. Ltd. is a trusted real estate channel partner in Bangalore. We help buyers find verified RERA-approved properties in Bangalore, Hyderabad & Chennai with expert advisory and site visits.",
    url: `${SITE_URL}/about`,
    speakableSelectors: [".speakable-title", ".speakable-summary"],
  };

  return (
    <>
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema(webPage)) }}
      />
      {aboutFaqItems.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(aboutFaqItems)) }}
        />
      )}
      {team.map((m) => (
        <script
          key={m.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              personSchema({
                name: m.name,
                role: m.role,
                linkedin: m.linkedin,
                specialisation: m.specialisation,
              })
            ),
          }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(breadcrumbs)) }}
      />

      <div className="min-h-screen bg-cream">
        
        {/* ── HERO ── */}
        <section className="relative pt-32 pb-24 bg-navy overflow-hidden text-white">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
              alt="RealHubb Ventures"
              className="w-full h-full object-cover opacity-45 filter brightness-95"
            />
            {/* Smooth linear top-to-bottom gradient overlay to maintain readability for centered text */}
            <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/55 to-navy" />
          </div>

          {/* Symmetrical branding glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

          <div className="page-padding relative z-10 flex flex-col items-center text-center">
            <FadeInOnScroll direction="up" className="flex flex-col items-center text-center">
              <p className="text-gold text-[10px] tracking-[0.28em] uppercase font-normal mb-4 animate-fadeIn">
                About RealHubb
              </p>
              <h1 className="speakable-title text-4xl md:text-[56px] font-heading font-normal text-white leading-tight mb-6 max-w-3xl animate-fadeIn">
                Building India's most <span className="text-gold">trusted</span> real estate platform.
              </h1>
              <p className="speakable-summary text-white/60 text-base leading-relaxed max-w-2xl mb-8 font-light animate-fadeIn">
                Realhubb Ventures Pvt. Ltd. — a RERA-compliant channel partner connecting thousands
                of families with verified properties across Bangalore, Hyderabad, and Chennai.
              </p>
              <a
                href={companyInfo.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gold hover:bg-gold/90 text-navy font-normal text-sm transition-all duration-200 hover:scale-105 shadow-md"
              >
                <Image src="/whatsapp.png" alt="WhatsApp icon" width={16} height={16} unoptimized className="w-4 h-4" />
                Chat with Us
              </a>
            </FadeInOnScroll>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="py-20 bg-cream">
          <div className="page-padding">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[
                { icon: <Award className="w-5 h-5 text-gold" />, label: "Properties Sold", stat: companyInfo.stats.propertiesSold },
                { icon: <Users className="w-5 h-5 text-gold" />, label: "Happy Clients", stat: companyInfo.stats.happyClients },
                { icon: <TrendingUp className="w-5 h-5 text-gold" />, label: "Years Experience", stat: companyInfo.stats.yearsExperience },
                { icon: <Users className="w-5 h-5 text-gold" />, label: "Expert Advisors", stat: companyInfo.stats.expertAdvisors },
              ].map((item, i) => (
                <FadeInOnScroll key={i} delay={i * 100} direction="up">
                  <div className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow duration-200 text-center border border-gray-100">
                    <div className="w-11 h-11 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                      {item.icon}
                    </div>
                    <div className="flex items-end justify-center gap-0.5">
                      <CountingNumber
                        fromNumber={0}
                        number={Number(String(item.stat).replace(/[^0-9.]/g, ""))}
                        decimalPlaces={0}
                        className="text-3xl font-heading font-normal text-navy"
                        inView
                      />
                      <span className="text-3xl font-heading font-normal text-navy">+</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{item.label}</p>
                  </div>
                </FadeInOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHO WE ARE ── */}
        <section id="who-we-are" className="py-28 bg-navy relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="page-padding relative z-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5">
                <FadeInOnScroll direction="up">
                  <p className="text-gold text-[10px] tracking-[0.28em] uppercase font-normal mb-4">
                    Who We Are
                  </p>
                  <h2 className="text-4xl md:text-[48px] font-heading font-normal text-white leading-tight mb-6">
                    A team that puts <span className="text-gold">your home</span> first.
                  </h2>
                  <span className="block h-0.5 w-16 bg-gold mb-6" />
                  <p className="text-white/85 text-lg font-light leading-relaxed mb-6">
                    Delivering trusted advisory, absolute transparency, and seamless end-to-end buying experiences across India's top real estate markets.
                  </p>
                </FadeInOnScroll>
              </div>

              <div className="lg:col-span-7">
                <FadeInOnScroll direction="up" delay={200}>
                  <div className="relative bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-2xl overflow-hidden">
                    {/* Top corner glow inside card */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/10 rounded-full blur-2xl pointer-events-none" />
                    
                    <p className="text-white/70 text-base leading-relaxed mb-8 font-light relative z-10">
                      At <strong className="text-white font-normal">Realhubb Ventures Pvt. Ltd.</strong>, we take pride in being one of
                      Bangalore's most trusted channel partners in real estate. With over{" "}
                      <strong className="text-gold font-normal">{companyInfo.stats.yearsExperience} years of experience</strong>, we have
                      helped thousands of families discover their dream homes and investors find
                      profitable opportunities. Our focus on transparency, customer-first service, and
                      end-to-end assistance ensures a seamless buying experience from start to finish.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/15 text-xs text-white/80 relative z-10 font-light">
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-gold shrink-0 animate-pulse" />
                        RERA Compliant Channel Partner
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-gold shrink-0 animate-pulse" />
                        Zero Brokerage on New Launches
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-gold shrink-0 animate-pulse" />
                        Verified properties only
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-gold shrink-0 animate-pulse" />
                        Complete legal & home loan support
                      </div>
                    </div>
                  </div>
                </FadeInOnScroll>
              </div>
            </div>
          </div>
        </section>

        {/* ── MISSION & VISION ── */}
        <section className="py-28 bg-cream relative overflow-hidden">
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

          <div className="page-padding relative z-10">
            <div className="max-w-7xl mx-auto">
              <FadeInOnScroll direction="up">
                <p className="text-gold text-[10px] tracking-[0.28em] uppercase font-normal mb-3 text-center">
                  Mission & Vision
                </p>
                <h2 className="text-3xl md:text-[44px] font-heading font-normal text-navy leading-tight mb-16 text-center">
                  What drives us <span className="text-gold">every day.</span>
                </h2>
              </FadeInOnScroll>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                <FadeInOnScroll delay={0} direction="left">
                  <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-150 hover:border-gold/30 hover:shadow-xl hover:shadow-gold/5 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between group">
                    <div>
                      <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-gold/20 transition-all duration-300">
                        <Target className="h-6 w-6 text-gold" />
                      </div>
                      <h3 className="text-2xl font-heading font-normal text-navy mb-4">Our Mission</h3>
                      <span className="block h-0.5 w-8 bg-gold group-hover:w-16 transition-all duration-300 mb-6" />
                      <p className="text-gray-500 leading-relaxed text-sm font-light">
                        {companyInfo.aboutUs.mission}
                      </p>
                    </div>
                  </div>
                </FadeInOnScroll>

                <FadeInOnScroll delay={200} direction="right">
                  <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-150 hover:border-gold/30 hover:shadow-xl hover:shadow-gold/5 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between group">
                    <div>
                      <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-gold/20 transition-all duration-300">
                        <Eye className="h-6 w-6 text-gold" />
                      </div>
                      <h3 className="text-2xl font-heading font-normal text-navy mb-4">Our Vision</h3>
                      <span className="block h-0.5 w-8 bg-gold group-hover:w-16 transition-all duration-300 mb-6" />
                      <p className="text-gray-500 leading-relaxed text-sm font-light">
                        {companyInfo.aboutUs.vision}
                      </p>
                    </div>
                  </div>
                </FadeInOnScroll>
              </div>
            </div>
          </div>
        </section>

        {/* ── CORE VALUES ── */}
        <section className="py-24 bg-cream border-t border-gray-100">
          <div className="page-padding">
            <div className="max-w-7xl mx-auto">
              <FadeInOnScroll direction="up">
                <p className="text-gold text-[10px] tracking-[0.28em] uppercase font-normal mb-3 text-center">
                  Core Values
                </p>
                <h2 className="text-3xl md:text-[40px] font-heading font-normal text-navy leading-tight mb-16 text-center">
                  The principles that <span className="text-gold">guide us.</span>
                </h2>
              </FadeInOnScroll>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {companyInfo.aboutUs.values.map((value, index) => (
                  <FadeInOnScroll key={index} delay={index * 80} direction="up">
                    <div className="relative bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gold/20 hover:-translate-y-0.5 transition-all duration-350 overflow-hidden h-full flex flex-col justify-between group">
                      {/* styled background watermark number */}
                      <span className="absolute -top-3 -right-2 text-[80px] font-heading font-bold text-gold/[0.04] group-hover:text-gold/[0.08] select-none leading-none transition-colors duration-300">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="flex items-start gap-4 pr-10 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0 font-heading font-normal text-sm group-hover:bg-gold group-hover:text-navy transition-all duration-300">
                          {index + 1}
                        </div>
                        <p className="text-navy font-heading font-normal text-base leading-relaxed pt-1.5">
                          {value}
                        </p>
                      </div>
                    </div>
                  </FadeInOnScroll>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section id="what-we-offer" className="py-28 bg-navy relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.02] via-transparent to-transparent pointer-events-none" />
          <div className="page-padding relative z-10">
            <div className="max-w-7xl mx-auto">
              <FadeInOnScroll direction="up">
                <p className="text-gold text-[10px] tracking-[0.28em] uppercase font-normal mb-3 text-center">
                  What We Offer
                </p>
                <h2 className="text-3xl md:text-[44px] font-heading font-normal text-white leading-tight mb-16 text-center">
                  Services built around <span className="text-gold">you.</span>
                </h2>
              </FadeInOnScroll>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {companyInfo.services.map((service, i) => {
                  const iconMap: Record<string, React.ReactNode> = {
                    MessageSquare: <MessageSquare className="h-5.5 w-5.5 text-gold" />,
                    MapPin:        <MapPin className="h-5.5 w-5.5 text-gold" />,
                    FileText:      <FileText className="h-5.5 w-5.5 text-gold" />,
                    HeadphonesIcon:<HeadphonesIcon className="h-5.5 w-5.5 text-gold" />,
                    Home:          <Home className="h-5.5 w-5.5 text-gold" />,
                    Rocket:        <Rocket className="h-5.5 w-5.5 text-gold" />,
                  };
                  return (
                    <FadeInOnScroll key={i} delay={i * 80} direction="up">
                      <div className="group bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 backdrop-blur-md rounded-2xl p-8 hover:border-gold/30 hover:bg-white/5 transition-all duration-350 flex flex-col h-full justify-between">
                        <div>
                          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-gold/10 transition-all duration-300">
                            {iconMap[service.icon] ?? <BriefcaseBusiness className="h-5.5 w-5.5 text-gold" />}
                          </div>
                          <h3 className="text-white font-heading font-normal text-lg mb-3 group-hover:text-gold transition-colors">
                            {service.title}
                          </h3>
                          <span className="block h-px w-8 bg-gold mb-4 group-hover:w-16 transition-all duration-350" />
                          <p className="text-white/60 text-sm leading-relaxed font-light">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </FadeInOnScroll>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── CORE TEAM ── */}
        <section className="py-28 bg-cream">
          <div className="page-padding">
            <div className="max-w-7xl mx-auto">
              <FadeInOnScroll direction="up">
                <p className="text-gold text-[10px] tracking-[0.28em] uppercase font-normal mb-3 text-center">
                  Core Team
                </p>
                <h2 className="text-3xl md:text-[40px] font-heading font-normal text-navy leading-tight mb-16 text-center">
                  Meet the people <span className="text-gold">behind RealHubb.</span>
                </h2>
              </FadeInOnScroll>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {coreTeam.map((member, index) => (
                  <FadeInOnScroll key={index} delay={index * 125} direction="up">
                    <div className="bg-white rounded-3xl shadow-sm hover:shadow-xl hover:border-gold/20 border border-gray-100 flex flex-col overflow-hidden h-full transition-all duration-300 group">
                      {/* Photo Container */}
                      <div className="relative h-72 w-full bg-gradient-to-b from-navy/[0.02] to-navy/[0.06] flex items-center justify-center overflow-hidden border-b border-gray-100">
                        {member.image ? (
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-contain p-4 group-hover:scale-103 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        ) : (
                          <div className="w-28 h-28 bg-navy/10 rounded-full flex items-center justify-center text-navy font-heading text-5xl">
                            {member.name[0]}
                          </div>
                        )}
                      </div>
                      {/* Content */}
                      <div className="p-8 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-navy text-xl font-heading font-normal mb-1 group-hover:text-gold transition-colors">
                            {member.name}
                          </h3>
                          <p className="text-gold text-xs section-overline tracking-wider mb-4 font-normal">
                            {member.designation}
                          </p>
                          <span className="block h-0.5 w-8 bg-gold mb-4 group-hover:w-16 transition-all duration-300" />
                          <p className="text-gray-500 text-sm leading-relaxed mb-6 font-light">
                            {member.bio}
                          </p>
                        </div>
                        
                        {member.linkedin && (
                          <div className="pt-4 border-t border-gray-100">
                            <a
                              href={member.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-[#0A66C2] hover:text-[#0a66c2]/85 text-xs font-medium transition"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.762 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11.334 20h-3v-10h3v10zm-1.5-11.269c-.966 0-1.75-.792-1.75-1.77s.784-1.77 1.75-1.77 1.75.792 1.75 1.77-.784 1.77-1.75 1.77zm13.834 11.269h-3v-5.604c0-1.337-.027-3.06-1.865-3.06-1.866 0-2.153 1.46-2.153 2.967v5.697h-3v-10h2.879v1.367h.041c.401-.758 1.381-1.558 2.844-1.558 3.04 0 3.604 2.004 3.604 4.61v5.581z" />
                              </svg>
                              LinkedIn Profile
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </FadeInOnScroll>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── REALHUBB REAL HEROES ── */}
        <section className="py-24 bg-navy">
          <div className="page-padding">
            <FadeInOnScroll direction="up">
              <p className="text-gold text-[10px] tracking-[0.28em] uppercase font-normal mb-3">
                RealHubb RealHeroes
              </p>
              <h2 className="text-3xl md:text-[40px] font-heading font-normal text-white leading-tight mb-3">
                The people who make it <span className="text-gold">happen every day.</span>
              </h2>
              <p className="text-white/50 text-sm max-w-xl mb-10 font-light leading-relaxed">
                Our advisors, specialists, and support team — the real force behind every successful transaction.
                Hover over a card to know their story.
              </p>
            </FadeInOnScroll>

            {/* Flip card grid of dynamic Firestore team members */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {realHeroes.map((member, index) => (
                <FadeInOnScroll key={member.id} delay={index * 80} direction="up">
                  <TeamCard member={member} index={index} />
                </FadeInOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ── LEADERSHIP RECOGNITION ── */}
        <section id="leadership-recognition" className="py-28 bg-navy border-t border-white/10 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[140px] pointer-events-none" />

          <div className="page-padding relative z-10">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <FadeInOnScroll direction="up">
                  <p className="text-gold text-[10px] tracking-[0.28em] uppercase font-normal mb-3">
                    Leadership Recognition
                  </p>
                  <h2 className="text-3xl md:text-[40px] font-heading font-normal text-white leading-tight mb-4">
                    A proud <span className="text-gold">national milestone.</span>
                  </h2>
                  <p className="text-white/60 text-sm max-w-xl mx-auto font-light leading-relaxed">
                    A proud milestone for Realhubb Ventures — our Co-founder &amp; CEO earns national recognition.
                  </p>
                </FadeInOnScroll>
              </div>

              <FadeInOnScroll direction="up" delay={150}>
                <div className="relative bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/15 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden group">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none transition-opacity group-hover:opacity-75" />
                  
                  <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14 relative z-10">
                    <div className="flex-shrink-0 flex flex-col items-center">
                      <div className="p-5 bg-white rounded-3xl shadow-2xl mb-4 relative w-40 h-40 flex items-center justify-center border border-gray-100 hover:scale-103 transition-transform duration-300">
                        <Image
                          src="/crea-logo.png"
                          alt="Confederation of Real Estate Associates India"
                          fill
                          className="object-contain p-3"
                        />
                      </div>
                      <span className="text-gold text-[11px] font-normal uppercase tracking-widest text-center">
                        CREA(I) APPROVED
                      </span>
                    </div>

                    <div className="hidden md:block w-px h-48 bg-white/10" />

                    <div className="flex-1 text-center md:text-left">
                      <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-2 rounded-full text-xs font-normal mb-5">
                        <Award className="h-4 w-4" />
                        National Leadership Committee
                      </div>
                      <h3 className="text-3xl font-heading font-normal text-white mb-2">Mr. Sanjeev R Singh</h3>
                      <p className="text-gold font-normal text-base mb-5">
                        Co-Founder &amp; CEO — Realhubb Ventures Pvt. Ltd.
                      </p>
                      <p className="text-white/70 leading-relaxed text-sm font-light">
                        We are immensely proud to announce that <strong className="text-white font-normal">Mr. Sanjeev R Singh</strong> has been
                        officially inducted as a <strong className="text-gold font-normal">CREA(I) Committee Member</strong> — the
                        Confederation of Real Estate Associates India. This prestigious recognition
                        reflects his outstanding contributions to India's real estate industry and his
                        dedication to professionalising the channel partner ecosystem at a national level.
                      </p>
                      <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                        <span className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs text-white/80 font-light">
                          CREA(I) Committee Member
                        </span>
                        <span className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs text-white/80 font-light">
                          National Association of Realtors – India
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeInOnScroll>
            </div>
          </div>
        </section>

        {/* ── WHY CHOOSE US ── */}
        <section className="py-28 bg-cream border-t border-gray-100">
          <div className="page-padding">
            <div className="max-w-7xl mx-auto">
              <FadeInOnScroll direction="up">
                <p className="text-gold text-[10px] tracking-[0.28em] uppercase font-normal mb-3 text-center">
                  Why Choose Us
                </p>
                <h2 className="text-3xl md:text-[40px] font-heading font-normal text-navy leading-tight mb-16 text-center">
                  Why families trust <span className="text-gold">Realhubb.</span>
                </h2>
              </FadeInOnScroll>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {companyInfo.whyChooseUs.map((reason, index) => (
                  <FadeInOnScroll key={index} delay={index * 100} direction="up">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-gold/20 hover:-translate-y-0.5 transition-all duration-350 relative overflow-hidden flex flex-col justify-between group">
                      {/* Left border accent */}
                      <span className="absolute top-0 left-0 bottom-0 w-1 bg-gold/30 group-hover:bg-gold transition-all duration-300" />
                      <div className="pl-2">
                        <h3 className="text-navy font-heading font-normal text-lg mb-3 group-hover:text-gold transition-colors">
                          {reason.title}
                        </h3>
                        <span className="block h-px w-8 bg-gold mb-4 group-hover:w-16 transition-all duration-350" />
                        <p className="text-gray-500 text-sm leading-relaxed font-light">
                          {reason.description}
                        </p>
                      </div>
                    </div>
                  </FadeInOnScroll>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        {aboutFaqCategory && (
          <section className="py-20 bg-cream border-t border-gray-100">
            <div className="page-padding max-w-7xl mx-auto">
              <FadeInOnScroll direction="up">
                <p className="text-gold text-[10px] tracking-[0.28em] uppercase font-normal mb-3 text-center">
                  FAQ
                </p>
                <h2 className="text-3xl md:text-[40px] font-heading font-normal text-navy leading-tight mb-10 text-center">
                  Frequently asked <span className="text-gold">questions.</span>
                </h2>
              </FadeInOnScroll>

              <FadeInOnScroll direction="up" delay={100}>
                <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-150/80 hover:shadow-md transition-shadow duration-300">
                  <FaqAccordion items={aboutFaqCategory.items} />
                  
                  <p className="text-sm text-gray-400 mt-8 text-center font-light">
                    Have more questions?{" "}
                    <Link href="/faq" className="text-gold font-normal underline underline-offset-2 hover:text-gold/80 transition-colors">
                      Browse all FAQs →
                    </Link>
                  </p>
                </div>
              </FadeInOnScroll>
            </div>
          </section>
        )}

        {/* ── CTA ── */}
        <ContactCTA />

      </div>
    </>
  );
}
