"use client";

import { trackCall, trackEmail, trackWhatsApp } from "@/lib/ga";

interface Props {
  href: string;
  kind: "call" | "email" | "whatsapp";
  context: string;
  className?: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
  ariaLabel?: string;
}

const trackers = {
  call: trackCall,
  email: trackEmail,
  whatsapp: trackWhatsApp,
};

// Wraps a tel:/mailto:/wa.me link with GA + Clarity click tracking for use
// inside Server Components, where an inline onClick handler isn't allowed.
export default function TrackedLink({ href, kind, context, className, children, target, rel, ariaLabel }: Props) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      onClick={() => trackers[kind](context)}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
