import { Star } from "lucide-react";
import Link from "next/link";
import { RevealGrid, RevealCard } from "@/components/ui/RevealGrid";

const testimonials = [
  {
    name: "Rahul Mehta",
    city: "Bangalore",
    property: "Prestige Spring Heights, Whitefield",
    text: "RealHubb made the entire process seamless. Sanjeev Ranjan Singh was incredibly knowledgeable and helped us get the best deal. Zero brokerage as promised!",
    rating: 5,
  },
  {
    name: "Preethi Nair",
    city: "Bangalore",
    property: "Brigade Horizon, Sarjapur Road",
    text: "We were first-time buyers with a lot of questions. The team was patient, thorough, and guided us through every step from site visit to registration.",
    rating: 5,
  },
  {
    name: "Arun Kumar",
    city: "Hyderabad",
    property: "Godrej Zenith, Gachibowli",
    text: "The RealHubb advisor in Hyderabad helped me shortlist exactly the right property for my budget. RERA verification gave me complete peace of mind.",
    rating: 5,
  },
  {
    name: "Deepika S.",
    city: "Bangalore",
    property: "Sobha Dream Acres, Panathur",
    text: "Srikanth B understood our requirements perfectly and found us a project 20% under our budget with better amenities. Highly recommend!",
    rating: 5,
  },
];

export default function TestimonialsStrip() {
  return (
    <section className="py-20 bg-navy">
      <div className="page-padding">
        <div className="text-center mb-12">
          <p className="section-overline text-gold mb-2">Client Stories</p>
          <h2 className="font-heading text-3xl md:text-4xl text-white font-normal">
            What Our Clients Say
          </h2>
        </div>

        <RevealGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t) => (
            <RevealCard key={t.name}>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 h-full flex flex-col">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-4 italic flex-1">
                  "{t.text}"
                </p>
                <div>
                  <p className="text-white text-sm font-normal">{t.name}</p>
                  <p className="text-gold text-xs">{t.city}</p>
                  <p className="text-white/40 text-xs">{t.property}</p>
                </div>
              </div>
            </RevealCard>
          ))}
        </RevealGrid>

        <div className="text-center mt-12">
          <Link
            href="/testimonials"
            className="inline-block bg-gold hover:bg-gold/90 text-navy px-8 py-3 rounded-full text-sm font-medium transition-colors"
          >
            All Testimonials →
          </Link>
        </div>
      </div>
    </section>
  );
}
