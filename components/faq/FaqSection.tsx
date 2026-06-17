import FaqAccordion from "@/components/faq/FaqAccordion";
import type { FaqItem } from "@/types/seo";

interface Props {
  title: string;
  icon: string;
  items: FaqItem[];
}

export default function FaqSection({ title, icon, items }: Props) {
  return (
    <div>
      <h2 className="font-heading text-xl text-navy font-normal mb-5 flex items-center gap-2">
        <span aria-hidden>{icon}</span> {title}
      </h2>
      <FaqAccordion items={items} />
    </div>
  );
}
