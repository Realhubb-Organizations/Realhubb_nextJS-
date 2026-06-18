import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BreadcrumbItem } from "@/types/seo";

interface Props {
  items: BreadcrumbItem[];
  dark?: boolean;
}

export default function BreadcrumbNav({ items, dark = false }: Props) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap gap-1 text-xs">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.url}-${i}`} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRight
                  className={cn("w-3 h-3", dark ? "text-white/30" : "text-gray-300")}
                />
              )}

              {isLast ? (
                <span className={cn(dark ? "text-white/50" : "text-gray-400")}>
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className={cn(
                    "hover:underline transition-colors",
                    dark ? "text-white/60 hover:text-gold" : "text-navy/60 hover:text-gold"
                  )}
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
