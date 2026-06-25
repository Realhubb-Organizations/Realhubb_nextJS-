import FaqAccordion from "@/components/faq/FaqAccordion";
import { FadeInOnScroll } from "@/components/FadeInOnScroll";

interface FaqItem {
  question: string;
  answer: string;
}

interface Props {
  faqs: FaqItem[];
}

export default function HomeFaqs({ faqs }: Props) {
  if (faqs.length === 0) return null;

  return (
    <section className="py-20 bg-cream border-t border-gray-100">
      <div className="page-padding max-w-4xl mx-auto">
        <FadeInOnScroll direction="up">
          <p className="text-gold-800 text-[10px] tracking-[0.28em] uppercase font-normal mb-3 text-center">
            FAQ
          </p>
          <h2 className="text-3xl md:text-[40px] font-heading font-normal text-navy leading-tight mb-10 text-center">
            Frequently asked <span className="text-gold-800">questions.</span>
          </h2>
        </FadeInOnScroll>

        <FadeInOnScroll direction="up" delay={100}>
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100">
            <FaqAccordion items={faqs} />
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
