import FaqAccordion from "@/components/faq/FaqAccordion";
import type { FaqItem } from "@/types/seo";

interface Props {
  title: string;
  icon: string;
  items: FaqItem[];
}

export default function FaqSection({ title, icon, items }: Props) {
  return (
    <div className="space-y-6">
      <h2 className="font-heading text-xl md:text-2xl text-navy font-normal flex items-center gap-3">
        <span className="w-10 h-10 rounded-2xl bg-gold/10 text-gold flex items-center justify-center text-lg shrink-0" aria-hidden>
          {icon}
        </span>
        {title}
      </h2>
      <FaqAccordion items={items} />
    </div>
  );
}
