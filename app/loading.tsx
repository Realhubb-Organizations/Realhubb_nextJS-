import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-cream animate-fade-in-delay">
      <div className="relative flex flex-col items-center justify-center">
        {/* Soft pulsing outer golden glow ring */}
        <div className="absolute w-36 h-36 rounded-full border border-gold/10 animate-ping opacity-45" />
        
        {/* Spinning thin gold accent border */}
        <div className="absolute w-28 h-28 rounded-full border-2 border-gold/10 border-t-gold animate-spin" />
        
        {/* 3D Flip-Flop logo image in the center */}
        <div className="relative w-16 h-16 flex items-center justify-center select-none">
          <Image
            src="/realhubb-logo-icon.png"
            alt="Loading..."
            width={64}
            height={64}
            priority
            className="object-contain animate-flip-flop"
          />
        </div>
      </div>
    </div>
  );
}
