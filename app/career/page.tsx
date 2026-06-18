import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, jobPostingListSchema } from "@/lib/structuredData";
import { company } from "@/data/company";
import { careerJobs } from "@/data/careerJobs";
import { careerFaq } from "@/data/faqData";
import FaqAccordion from "@/components/faq/FaqAccordion";
import { getPublishedFaqsByPage } from "@/lib/firestoreServerService";
import JobOpeningsList from "@/components/career/JobOpeningsList";
import ApplicationForm from "@/components/career/ApplicationForm";
import { RevealGrid, RevealCard } from "@/components/ui/RevealGrid";
import { FadeInOnScroll } from "@/components/FadeInOnScroll";
import {
  DollarSign, TrendingUp, GraduationCap, CalendarDays, Award, Coffee, Heart, MapPin,
} from "lucide-react";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";

export const metadata: Metadata = buildMetadata({
  title: "Careers at RealHubb Ventures Bangalore | RealHubb",
  description:
    "Join RealHubb Ventures — Bangalore's fastest-growing real estate channel partner. Open positions for sales, telesales and digital marketing roles.",
  keywords:
    "real estate jobs bangalore, sales executive jobs bangalore, telesales jobs bangalore, digital marketing jobs bangalore, realhubb careers",
  canonical: `${SITE_URL}/career`,
});

const benefits = [
  { icon: DollarSign, title: "Competitive Salary", description: "Industry-leading compensation with performance-based incentives" },
  { icon: TrendingUp, title: "Career Growth", description: "Clear career progression path with regular promotions" },
  { icon: GraduationCap, title: "Training & Development", description: "Regular training programs and skill development workshops" },
  { icon: CalendarDays, title: "Flexible Hours", description: "Work-life balance with flexible working arrangements" },
  { icon: Award, title: "Recognition Programs", description: "Monthly and annual awards for top performers" },
  { icon: Coffee, title: "Fun Work Culture", description: "Team outings, celebrations, and a supportive environment" },
  { icon: Heart, title: "Employee Wellness", description: "Mental health support and wellness initiatives" },
  { icon: MapPin, title: "Travel Allowances", description: "Conveyance support for property site visits and client meetings" },
];

const breadcrumbs = [
  { name: "Home", url: SITE_URL },
  { name: "Careers", url: `${SITE_URL}/career` },
];

export default async function CareerPage() {
  const dbFaqs = await getPublishedFaqsByPage("career");
  const faqs = dbFaqs.length > 0
    ? dbFaqs.map(f => ({ question: f.question, answer: f.answer }))
    : careerFaq;

  const jobSchema = jobPostingListSchema(
    careerJobs.map((job) => ({
      title: job.title,
      description: job.description,
      location: job.location,
      datePosted: "2026-03-01",
    }))
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }} />

      <div className="min-h-screen bg-cream">
        
        {/* ── HERO ── */}
        <section className="relative pt-32 pb-24 bg-navy overflow-hidden text-white">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80"
              alt="Join Our Growing Team"
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
                Careers
              </p>
              <h1 className="text-4xl md:text-[56px] font-heading font-normal text-white leading-tight mb-6 max-w-3xl animate-fadeIn">
                Join our <span className="text-gold">growing team.</span>
              </h1>
              <p className="text-white/60 text-base leading-relaxed max-w-2xl mb-8 font-light animate-fadeIn">
                Be part of Bangalore&apos;s leading real estate channel partner. Build your career with us
                and make a difference in people&apos;s lives.
              </p>
              
              <div className="flex flex-wrap justify-center gap-3 animate-fadeIn">
                {[
                  { label: "10+ Team Members", cls: "bg-white/10 border-white/10 text-white/80" },
                  { label: "95% Employee Satisfaction", cls: "bg-gold/10 border-gold/20 text-gold" },
                  { label: "100% Growth Opportunity", cls: "bg-green-900/30 border-green-700/30 text-green-400" },
                ].map((b) => (
                  <span key={b.label} className={`inline-flex items-center whitespace-nowrap px-6 py-2.5 rounded-full border text-xs font-normal transition-colors duration-300 ${b.cls}`}>
                    {b.label}
                  </span>
                ))}
              </div>
            </FadeInOnScroll>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <section className="py-28 bg-cream border-t border-gray-100">
          <div className="page-padding max-w-7xl mx-auto">
            <FadeInOnScroll direction="up">
              <p className="text-gold text-[10px] tracking-[0.28em] uppercase font-normal mb-3 text-center">
                Why Join Us
              </p>
              <h2 className="text-3xl md:text-[40px] font-heading font-normal text-navy leading-tight mb-16 text-center">
                More than just a job — a <span className="text-gold">career.</span>
              </h2>
            </FadeInOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {benefits.map((benefit, index) => (
                <FadeInOnScroll key={index} delay={index * 80} direction="up">
                  <div className="relative bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gold/20 hover:-translate-y-0.5 transition-all duration-355 overflow-hidden h-full flex flex-col justify-between group">
                    {/* styled background watermark number */}
                    <span className="absolute -top-3 -right-2 text-[80px] font-heading font-bold text-gold/[0.04] group-hover:text-gold/[0.08] select-none leading-none transition-colors duration-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                      <div>
                        <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-gold/20 transition-all duration-300">
                          <benefit.icon className="h-5.5 w-5.5" />
                        </div>
                        <h3 className="text-navy font-heading font-normal text-base mb-3 group-hover:text-gold transition-colors">
                          {benefit.title}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed font-light">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </FadeInOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ── JOB OPENINGS ── */}
        <section className="py-28 bg-navy relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[140px] pointer-events-none" />

          <div className="page-padding max-w-7xl mx-auto relative z-10">
            <FadeInOnScroll direction="up">
              <p className="text-gold text-[10px] tracking-[0.28em] uppercase font-normal mb-3 text-center">
                Open Positions
              </p>
              <h2 className="text-3xl md:text-[40px] font-heading font-normal text-white leading-tight mb-16 text-center">
                Current <span className="text-gold">openings.</span>
              </h2>
            </FadeInOnScroll>

            <FadeInOnScroll direction="up" delay={150}>
              <JobOpeningsList />
            </FadeInOnScroll>
          </div>
        </section>

        {/* ── APPLICATION FORM ── */}
        <section id="apply" className="py-28 bg-cream border-t border-gray-100">
          <div className="page-padding max-w-4xl mx-auto">
            <FadeInOnScroll direction="up">
              <p className="text-gold text-[10px] tracking-[0.28em] uppercase font-normal mb-3 text-center">
                Apply Now
              </p>
              <h2 className="text-3xl md:text-[40px] font-heading font-normal text-navy leading-tight mb-4 text-center">
                Ready to <span className="text-gold">join us?</span>
              </h2>
              <p className="text-gray-500 text-base font-light mb-12 text-center max-w-xl mx-auto leading-relaxed">
                Fill out the form below and attach your resume. We&apos;ll review your profile and reach out within 48 hours.
              </p>
            </FadeInOnScroll>

            <FadeInOnScroll direction="up" delay={150}>
              <div className="bg-white rounded-3xl shadow-md p-8 md:p-12 border border-gray-150 hover:shadow-xl transition-shadow duration-300">
                <ApplicationForm />
              </div>
            </FadeInOnScroll>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-28 bg-cream border-t border-gray-100">
          <div className="page-padding max-w-5xl mx-auto">
            <FadeInOnScroll direction="up">
              <p className="text-gold text-[10px] tracking-[0.28em] uppercase font-normal mb-3 text-center">
                FAQ
              </p>
              <h2 className="text-3xl md:text-[40px] font-heading font-normal text-navy leading-tight mb-16 text-center">
                Career <span className="text-gold">questions.</span>
              </h2>
            </FadeInOnScroll>

            <FadeInOnScroll direction="up" delay={100}>
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-150/80 hover:shadow-md transition-shadow duration-300">
                <FaqAccordion items={faqs} />
                
                <p className="text-sm text-gray-400 mt-8 text-center font-light">
                  Still have questions?{" "}
                  <a href={`mailto:${company.email}`} className="text-gold font-normal underline underline-offset-2 hover:text-gold/80 transition-colors">
                    Email our HR team →
                  </a>
                </p>
              </div>
            </FadeInOnScroll>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-28 bg-cream">
          <div className="page-padding max-w-5xl mx-auto">
            <FadeInOnScroll direction="up">
              <div className="bg-[#00274D] border border-gold/30 rounded-[32px] p-10 md:p-16 shadow-2xl relative overflow-hidden text-white text-center">
                {/* Subtle absolute glows */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative z-10 max-w-2xl mx-auto">
                  <p className="text-gold text-[10px] tracking-[0.28em] uppercase font-normal mb-4">
                    Get in Touch
                  </p>
                  <h2 className="text-3xl md:text-[40px] font-heading font-normal text-white leading-tight mb-6">
                    Have questions about <span className="text-gold">our roles?</span>
                  </h2>
                  <p className="text-white/60 text-base mb-10 font-light leading-relaxed">
                    Our human resources team is here to assist you. Reach out to us with any inquiries about our application process or team culture.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href={`mailto:${company.email}`}
                      className="px-8 py-3.5 rounded-full bg-gold hover:bg-gold/90 text-navy font-semibold text-sm transition-all duration-200 hover:scale-105 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Email HR Team
                    </a>
                    <a
                      href={`tel:${company.phone}`}
                      className="px-8 py-3.5 rounded-full border border-white/20 text-white hover:bg-white/10 font-medium text-sm transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Call HR Team
                    </a>
                  </div>
                </div>
              </div>
            </FadeInOnScroll>
          </div>
        </section>

      </div>
    </>
  );
}
