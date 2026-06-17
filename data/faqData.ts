import type { FaqItem, FaqCategory } from "@/types/seo";

export const generalFaq: FaqItem[] = [
  {
    question: "What is RealHubb Ventures?",
    answer:
      "RealHubb Ventures Pvt. Ltd. is a leading real estate channel partner operating across Bangalore, Hyderabad, and Chennai. We help buyers find verified, RERA-registered properties from top developers with zero brokerage.",
  },
  {
    question: "Is RealHubb RERA registered?",
    answer:
      "Yes, RealHubb Ventures is RERA registered. We only deal with RERA-approved projects and ensure full transparency in all property transactions.",
  },
  {
    question: "What are the charges for RealHubb's services?",
    answer:
      "RealHubb operates on a zero brokerage model for buyers. Our services — property search, site visits, documentation guidance, and home loan assistance — are completely free for buyers.",
  },
  {
    question: "What cities does RealHubb operate in?",
    answer:
      "RealHubb currently operates in Bangalore, Hyderabad, and Chennai, covering all major localities and micro-markets in each city.",
  },
  {
    question: "How can I book a free site visit through RealHubb?",
    answer:
      "You can book a free site visit by calling us, sending a WhatsApp message, or filling out the enquiry form on any property page. Our advisor will contact you within 15 minutes.",
  },
  {
    question: "Does RealHubb help with home loans?",
    answer:
      "Yes, RealHubb has partnerships with leading banks and NBFCs. We can connect you with home loan advisors for the best rates and fastest approvals.",
  },
  {
    question: "How is the property information on RealHubb verified?",
    answer:
      "Every property listed on RealHubb is personally verified by our team. We check RERA registration, builder credentials, project approvals, and construction quality before listing.",
  },
  {
    question: "Can NRIs use RealHubb's services?",
    answer:
      "Yes, RealHubb actively works with NRI buyers. We provide virtual site visits, complete documentation support, and power of attorney guidance for overseas buyers.",
  },
];

export const propertyFaq: FaqItem[] = [
  {
    question: "What documents should I check before buying a property in Bangalore?",
    answer:
      "Key documents include: RERA registration certificate, Encumbrance Certificate (EC), Khata certificate, approved building plan, sale deed, and possession certificate. RealHubb assists you in verifying all these.",
  },
  {
    question: "What is RERA and why is it important?",
    answer:
      "RERA (Real Estate Regulatory Authority) is a statutory body that protects home buyers' interests. All projects above 500 sq.m must be registered. It ensures builders deliver on time, maintains escrow accounts, and provides dispute resolution.",
  },
  {
    question: "What is the registration charge for property in Bangalore?",
    answer:
      "In Bangalore (Karnataka), stamp duty is 5% and registration charge is 1% of the property value. Total cost is approximately 6% of the property value.",
  },
];

export const careerFaq: FaqItem[] = [
  {
    question: "How long does the hiring process take?",
    answer:
      "Our hiring process typically takes 5–7 working days. After you submit your application, our HR team will review it within 48 hours and reach out to shortlisted candidates for a phone screening, followed by an in-person or virtual interview.",
  },
  {
    question: "Do I need prior real estate experience to apply?",
    answer:
      "Not for all roles. Our Telesales Executive role is open to freshers with strong communication skills. For Sales Executive and Digital Marketing roles, we prefer 1–3 years of relevant experience. We provide thorough onboarding and training regardless of your background.",
  },
  {
    question: "What is the interview process at RealHubb?",
    answer:
      "Our interview process has two rounds: an initial HR screening call to understand your background and expectations, followed by a final round with the department head. The entire process is completed within a week of your application.",
  },
  {
    question: "Are the roles remote or in-office?",
    answer:
      "Our current openings are based out of our Bangalore office. We offer flexible working arrangements for certain roles. The specific work model will be discussed during the interview process.",
  },
  {
    question: "What growth opportunities does RealHubb offer?",
    answer:
      "RealHubb has a clear career progression path — top performers are promoted within 6–12 months. We invest in our team through regular training programs, mentorship, and skill development workshops.",
  },
];

export const faqCategories: FaqCategory[] = [
  { id: "about", title: "About RealHubb", icon: "🏢", items: generalFaq.slice(0, 4) },
  { id: "services", title: "Our Services", icon: "🤝", items: generalFaq.slice(4) },
  { id: "buying", title: "Property Buying", icon: "🏠", items: propertyFaq },
  { id: "careers", title: "Careers", icon: "💼", items: careerFaq },
];
