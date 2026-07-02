import type { FaqItem, FaqCategory } from "@/types/seo";

export const generalFaq: FaqItem[] = [
  {
    question: "How do I verify a builder's JDA status in Bangalore?",
    answer:
      "To verify a Joint Development Agreement (JDA), cross-check the registered JDA document number on the Kaveri 2.0 portal, confirm the landowner share ratio, and verify that the specific flat number is allocated to the developer's share under the supplementary allocation deed.",
  },
  {
    question: "What are the stamp duty and registration charges for buying a flat in Bangalore?",
    answer:
      "In Bangalore (Karnataka), the stamp duty is 5% of the property value, the registration fee is 1%, and surcharge/cess adds about 0.5%. Overall, budget approximately 6.5% of the guidance value or sale agreement value for government registry fees.",
  },
  {
    question: "How can I check if a new property project is RERA approved?",
    answer:
      "Visit the Karnataka RERA website (rera.karnataka.gov.in) or your state's respective RERA portal. Go to the 'Project Status' search tab, enter the project name or builder name, and verify the registration details, timeline, approvals, and any complaints filed.",
  },
  {
    question: "What are the hidden charges over the base property price?",
    answer:
      "Beyond the base cost, developers add mandatory charges: stamp duty & registration (6-7%), GST (5% for under-construction residential properties, 1% for affordable housing, 0% for ready-to-move-in with OC), car parking, corpus fund, advance maintenance, club membership, electricity/water deposit, and legal documentation fees.",
  },
  {
    question: "Is it better to buy a ready-to-move-in flat or an under-construction project?",
    answer:
      "Ready-to-move-in properties have zero GST, eliminate construction delay risks, and allow you to inspect the final quality, but cost 15-25% more. Under-construction projects offer flexible payment structures and higher capital appreciation, but require verification of the RERA possession date.",
  },
  {
    question: "Does RealHubb charge any brokerage or service fees for home buyers?",
    answer:
      "No, RealHubb operates on a 100% zero brokerage model. Our end-to-end services—including property search, personalized shortlisting, accompanied site visits, home loan assistance, and legal documentation guidance—are completely free for buyers.",
  },
  {
    question: "How does RealHubb verify the properties listed on the portal?",
    answer:
      "Every project listed undergoes a detailed screening. We verify RERA registration, cross-reference approved municipal plans (BBMP/BDA/BMRDA), check land title clarity, assess the builder's delivery track record, and monitor construction progress.",
  },
  {
    question: "Can NRIs purchase residential properties through RealHubb?",
    answer:
      "Yes, NRIs can buy residential and commercial properties in India under FEMA guidelines. RealHubb provides specialized virtual site walkthroughs, video call verifications, legal Power of Attorney (POA) templates, and banking connections for NRI home loans.",
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
