import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface Props {
  items: BreadcrumbItem[];
  light?: boolean;
}

export default function Breadcrumbs({ items, light = false }: Props) {
  return (
    <nav className="flex items-center space-x-2 text-xs font-light select-none relative z-10 mb-6" aria-label="Breadcrumb">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <div key={item.url + idx} className="flex items-center space-x-2">
            {idx > 0 && (
              <ChevronRight className={`w-3.5 h-3.5 ${light ? "text-white/35" : "text-gray-400/50"}`} />
            )}
            {isLast ? (
              <span className={`line-clamp-1 max-w-[200px] sm:max-w-none font-normal ${light ? "text-gold" : "text-gold"}`}>
                {item.name}
              </span>
            ) : (
              <Link
                href={item.url}
                className={`transition-colors hover:underline ${
                  light ? "text-white/60 hover:text-white" : "text-gray-400 hover:text-navy"
                }`}
              >
                {item.name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
