export interface CareerJob {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
}

export const careerJobs: CareerJob[] = [
  {
    id: 1,
    title: "Real Estate Sales Executive",
    department: "Sales",
    location: "Bangalore, Karnataka",
    type: "Full-time",
    experience: "1-3 years",
    salary: "₹3-6 LPA + Incentives",
    description:
      "We're looking for passionate sales professionals to help clients find their dream properties.",
    responsibilities: [
      "Meet with clients to understand property requirements",
      "Showcase properties and conduct site visits",
      "Negotiate deals and close sales",
      "Build and maintain client relationships",
      "Achieve monthly sales targets",
    ],
    requirements: [
      "1-3 years experience in real estate sales",
      "Excellent communication and negotiation skills",
      "Strong knowledge of Bangalore real estate market",
      "Two-wheeler/car with valid license",
      "Graduate in any discipline",
    ],
  },
  {
    id: 2,
    title: "Telesales Executive",
    department: "Sales",
    location: "Bangalore, Karnataka",
    type: "Full-time",
    experience: "0-1 years",
    salary: "₹3-4 LPA",
    description:
      "Join our telesales team to generate leads and convert inquiries into successful property sales.",
    responsibilities: [
      "Make outbound calls to potential clients",
      "Understand client needs and recommend suitable properties",
      "Schedule site visits and follow up with leads",
      "Maintain accurate records in CRM",
      "Achieve monthly lead conversion targets",
    ],
    requirements: [
      "0-1 years experience in telesales or telemarketing",
      "Strong communication and persuasion skills",
      "Ability to handle rejection and stay motivated",
      "Familiarity with CRM software is a plus",
      "Graduate in any discipline",
    ],
  },
  {
    id: 3,
    title: "Digital Marketing Specialist",
    department: "Marketing",
    location: "Bangalore, Karnataka",
    type: "Full-time",
    experience: "2-4 years",
    salary: "₹4-7 LPA",
    description:
      "Drive our digital presence and lead generation through strategic online marketing campaigns.",
    responsibilities: [
      "Manage social media platforms and content strategy",
      "Run paid advertising campaigns (Google Ads, Facebook, Instagram)",
      "Generate quality leads through digital channels",
      "Analyze campaign performance and optimize ROI",
      "Collaborate with sales team on lead nurturing",
    ],
    requirements: [
      "2-4 years experience in digital marketing",
      "Expertise in Google Ads, Facebook Ads, SEO/SEM",
      "Experience with real estate marketing preferred",
      "Strong analytical and creative skills",
      "Proficiency in marketing tools and analytics platforms",
    ],
  },
];
