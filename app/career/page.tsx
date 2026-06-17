import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, jobPostingListSchema } from "@/lib/structuredData";
import { company } from "@/data/company";
import { careerJobs } from "@/data/careerJobs";
import { careerFaq } from "@/data/faqData";
import BreadcrumbNav from "@/components/seo/BreadcrumbNav";
import FaqAccordion from "@/components/faq/FaqAccordion";
import { getPublishedFaqsByPage } from "@/lib/firestoreServerService";
import JobOpeningsList from "@/components/career/JobOpeningsList";
import ApplicationForm from "@/components/career/ApplicationForm";
import { RevealGrid, RevealCard } from "@/components/ui/RevealGrid";
import {
  DollarSign, TrendingUp, GraduationCap, CalendarDays, Award, Coffee, Heart,
} from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realhubb.in";

export const metadata: Metadata = buildMetadata({
  title: "Careers at RealHubb Ventures Bangalore | RealHubb",
  // 149 chars ✅
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

      <div className="pt-20">
        {/* ── HERO ── */}
        <div className="bg-navy py-14 page-padding">
          <BreadcrumbNav items={breadcrumbs} dark />
          <h1 className="font-heading text-3xl md:text-5xl text-white font-normal mt-4 max-w-3xl">
            Join our <span className="text-gold">growing team.</span>
          </h1>
          <p className="text-white/60 text-base mt-3 max-w-2xl">
            Be part of Bangalore&apos;s leading real estate channel partner. Build your career with us
            and make a difference in people&apos;s lives.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            {[
              { label: "10+ Team Members", cls: "bg-white/10 border-white/10 text-white/80" },
              { label: "95% Employee Satisfaction", cls: "bg-gold/10 border-gold/20 text-gold" },
              { label: "100% Growth Opportunity", cls: "bg-green-900/30 border-green-700/30 text-green-400" },
            ].map((b) => (
              <span key={b.label} className={`inline-flex items-center px-4 py-2 rounded-full border text-xs font-normal ${b.cls}`}>
                {b.label}
              </span>
            ))}
          </div>
        </div>

        {/* ── BENEFITS ── */}
        <section className="py-16 page-padding">
          <p className="section-overline text-gold mb-3">Why Join Us</p>
          <h2 className="font-heading text-2xl md:text-3xl text-navy font-normal mb-8">
            More than just a job — a <span className="text-gold">career.</span>
          </h2>
          <RevealGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map((benefit) => (
              <RevealCard key={benefit.title}>
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 text-center h-full">
                  <div className="w-11 h-11 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-5 w-5 text-gold" />
                  </div>
                  <h3 className="text-navy font-normal text-sm mb-2">{benefit.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{benefit.description}</p>
                </div>
              </RevealCard>
            ))}
          </RevealGrid>
        </section>

        {/* ── JOB OPENINGS ── */}
        <section className="py-16 bg-navy page-padding">
          <p className="section-overline text-gold mb-3">Open Positions</p>
          <h2 className="font-heading text-2xl md:text-3xl text-white font-normal mb-8">
            Current <span className="text-gold">openings.</span>
          </h2>
          <JobOpeningsList />
        </section>

        {/* ── APPLICATION FORM ── */}
        <section id="apply" className="py-16 page-padding">
          <div className="text-center mb-10">
            <p className="section-overline text-gold mb-3">Apply Now</p>
            <h2 className="font-heading text-2xl md:text-3xl text-navy font-normal mb-4">
              Ready to <span className="text-gold">join us?</span>
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Fill out the form below and attach your resume. We&apos;ll get back to you within 48 hours.
            </p>
          </div>
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-10">
            <ApplicationForm />
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-16 bg-navy page-padding">
          <div className="text-center mb-10">
            <p className="section-overline text-gold mb-3">FAQ</p>
            <h2 className="font-heading text-2xl md:text-3xl text-white font-normal">
              Career <span className="text-gold">questions.</span>
            </h2>
          </div>
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <FaqAccordion items={faqs} />
            <p className="text-sm text-gray-400 mt-6 text-center">
              Still have questions?{" "}
              <a href={`mailto:${company.email}`} className="text-gold underline underline-offset-2 hover:text-gold/80 transition-colors">
                Email our HR team →
              </a>
            </p>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-16 page-padding">
          <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm text-center">
            <h2 className="font-heading text-xl md:text-2xl text-navy font-normal mb-3">Have Questions?</h2>
            <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
              Our HR team is here to help. Reach out to us for any queries about careers at RealHubb.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`mailto:${company.email}`}
                className="px-8 py-3 rounded-full bg-navy hover:bg-navy/90 text-white font-normal text-sm transition-colors duration-200">
                Email HR Team
              </a>
              <a href={`tel:${company.phone}`}
                className="px-8 py-3 rounded-full border border-gold text-gold hover:bg-gold hover:text-navy font-normal text-sm transition-colors duration-200">
                Call Us
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
