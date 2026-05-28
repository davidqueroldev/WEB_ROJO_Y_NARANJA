import { Star, Quote } from "lucide-react";
import { useInView } from "../hooks/useInView";

const reviews = [
  {
    name: "Inés",
    location: "España",
    apt: "Apartamento Oro",
    stars: 5,
    text: "El apartamento es muy bonito y tiene todo lo necesario. La ubicación en el centro de Morella es perfecta, lo tienes todo a mano. Volveremos seguro.",
    avatar: "https://i.pravatar.cc/60?img=5",
  },
  {
    name: "Álvaro",
    location: "España",
    apt: "Apartamento Rojo",
    stars: 5,
    text: "La climatización funciona perfectamente y la ubicación es inmejorable, en pleno centro histórico. Ideal para visitar Morella con comodidad.",
    avatar: "https://i.pravatar.cc/60?img=47",
  },
  {
    name: "Patricia & Marcos",
    location: "Valencia",
    apt: "Apartamento Plata",
    stars: 5,
    text: "Una escapada romántica perfecta. El jacuzzi con cromoterapia y la chimenea eléctrica son espectaculares. Morella de noche desde el apartamento es mágico.",
    avatar: "https://i.pravatar.cc/60?img=12",
  },
  {
    name: "Familia Martínez",
    location: "Zaragoza",
    apt: "Apartamento Naranja",
    stars: 5,
    text: "Nos alojamos cuatro adultos y estuvimos comodísimos. El apartamento está muy bien equipado y en el mejor sitio posible. El castillo a dos pasos.",
    avatar: "https://i.pravatar.cc/60?img=28",
  },
];

function ReviewCard({ review, index }) {
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref}
      className={`glass-card p-6 transition-all duration-600 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <Quote size={24} className="text-brand-orange/30 mb-4" />

      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: review.stars }).map((_, i) => (
          <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
        ))}
        <span className="ml-2 text-xs font-bold text-amber-600">10/10</span>
      </div>

      <p className="text-brand-dark leading-relaxed mb-5 italic">&ldquo;{review.text}&rdquo;</p>

      <div className="flex items-center gap-3">
        <img
          src={review.avatar}
          alt={review.name}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-orange/20"
        />
        <div>
          <p className="font-semibold text-brand-dark text-sm">{review.name}</p>
          <p className="text-brand-stone text-xs">
            {review.location} · {review.apt}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const { ref, inView } = useInView();

  return (
    <section className="py-24 bg-gradient-to-br from-brand-dark via-brand-dark/95 to-brand-red/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-amber-300 text-sm font-semibold mb-4">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            Lo que dicen nuestros huéspedes
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Valoración perfecta
            <span className="italic text-amber-300"> en todas las plataformas</span>
          </h2>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            10/10 en Escapada Rural. Huéspedes que repiten y recomiendan.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {reviews.map((r, i) => (
            <ReviewCard key={r.name} review={r} index={i} />
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-16 text-center">
          {[
            { value: "10/10", label: "Valoración media",   sub: "Escapada Rural" },
            { value: "100%", label: "Respuesta garantizada", sub: "en menos de 1 hora" },
            { value: "4",    label: "Apartamentos únicos",   sub: "en Morella" },
          ].map(({ value, label, sub }) => (
            <div key={label}>
              <p className="font-display text-4xl md:text-5xl font-bold text-amber-300 mb-1">{value}</p>
              <p className="text-white font-semibold text-sm">{label}</p>
              <p className="text-white/50 text-xs">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
