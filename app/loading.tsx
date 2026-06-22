import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-cream animate-fade-in-delay">
      <div className="relative flex items-center justify-center w-48 h-48 select-none">
        {/* Pulsing glow background */}
        <div className="absolute inset-4 rounded-full bg-gold/5 blur-xl animate-pulse-slow" />
        
        {/* SVG loading rings */}
        <svg className="absolute w-full h-full" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D7A764" stopOpacity="1" />
              <stop offset="50%" stopColor="#FAF6F1" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#D7A764" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Outer Dashed Golden Circle - rotates slowly clockwise */}
          <circle
            cx="100"
            cy="100"
            r="82"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            className="origin-center animate-spin-clockwise"
            style={{ animationDuration: "12s" }}
          />

          {/* Middle Solid Golden Circle Track (Subtle guide) */}
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke="#D7A764"
            strokeWidth="1"
            strokeOpacity="0.1"
          />

          {/* Middle Active Spinner Ring - rotates counter-clockwise */}
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="3"
            strokeDasharray="440"
            strokeDashoffset="140"
            strokeLinecap="round"
            className="origin-center animate-spin-counter"
            style={{ animationDuration: "3s" }}
          />

          {/* Inner Navy Ring - static subtle guide */}
          <circle
            cx="100"
            cy="100"
            r="58"
            fill="none"
            stroke="#00274D"
            strokeWidth="1"
            strokeOpacity="0.08"
          />

          {/* Inner Accent Ring - fast clockwise dash-spin */}
          <circle
            cx="100"
            cy="100"
            r="58"
            fill="none"
            stroke="#00274D"
            strokeWidth="1.5"
            strokeDasharray="40 180"
            strokeDashoffset="0"
            strokeLinecap="round"
            className="origin-center animate-spin-clockwise"
            style={{ animationDuration: "2s" }}
          />
        </svg>

        {/* Centered Mnemonic Logo */}
        <div className="relative w-[76px] h-[76px] flex items-center justify-center bg-white rounded-full p-2.5 shadow-lg border border-gold/15 animate-logo-pulse">
          <Image
            src="/realhubb-logo-mnemonics.png"
            alt="RealHubb"
            width={56}
            height={56}
            priority
            className="object-contain"
          />
        </div>
      </div>

      {/* Loading branding text below */}
      <div className="mt-8 flex flex-col items-center gap-1.5 select-none">
        <span className="text-navy font-heading font-medium text-sm tracking-[0.35em] uppercase animate-shimmer-text">
          RealHubb
        </span>
        <span className="text-[10px] text-gold/80 font-heading tracking-[0.25em] uppercase animate-pulse">
          Loading Data
        </span>
      </div>
    </div>
  );
}

