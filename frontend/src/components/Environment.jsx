import { Castle, Church, TreePine, Microscope, Stars, UtensilsCrossed, Shield, Mountain } from "lucide-react";
import { useInView } from "../hooks/useInView";
import { morella, imgOro, imgRojo } from "../assets/images";

const highlights = [
  {
    icon: Castle,
    title: "Castillo de Morella",
    desc: "Fortaleza medieval del siglo X dominando la ciudad desde 1.072 m de altura. A 5 minutos a pie.",
    color: "text-amber-700",
    bg: "bg-amber-50",
  },
  {
    icon: Shield,
    title: "Murallas medievales",
    desc: "2,5 km de muralla perfectamente conservada que rodea toda la ciudad. Declarada Bien de Interés Cultural.",
    color: "text-stone-600",
    bg: "bg-stone-50",
  },
  {
    icon: Church,
    title: "Santa María la Mayor",
    desc: "Magnífica basílica arciprestal gótica de los siglos XIII-XIV. Una de las más importantes del Levante.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: TreePine,
    title: "Parque Natural Els Ports",
    desc: "Paisaje de montaña mediterránea con rutas de senderismo, BTT y escalada para todos los niveles.",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: Microscope,
    title: "Dinosaurios y prehistoria",
    desc: "Morella es tierra de dinosaurios. El museo paleontológico y las huellas fosilizadas son únicos.",
    color: "text-brand-red",
    bg: "bg-red-50",
  },
  {
    icon: Stars,
    title: "Observatorio astronómico",
    desc: "Cielos libres de contaminación lumínica. El observatorio de Morella organiza sesiones nocturnas.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
];

const gallery = [morella[0], morella[1], imgOro[7], imgOro[8], imgRojo[0]];

function HighlightCard({ item, index }) {
  const { ref, inView } = useInView();
  const Icon = item.icon;

  return (
    <div
      ref={ref}
      className={`flex gap-4 p-5 rounded-2xl bg-white border border-amber-100 shadow-sm hover:shadow-md transition-all duration-500 ${
        inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className={`shrink-0 w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center`}>
        <Icon size={20} className={item.color} />
      </div>
      <div>
        <h4 className="font-semibold text-brand-dark mb-1">{item.title}</h4>
        <p className="text-brand-stone text-sm leading-relaxed">{item.desc}</p>
      </div>
    </div>
  );
}

export default function Environment() {
  const { ref, inView } = useInView();

  return (
    <section id="morella" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: text + highlights */}
          <div>
            <div
              ref={ref}
              className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold mb-4">
                <Mountain size={14} />
                Morella, Castellón
              </span>
              <h2 className="section-title mb-4">
                Una ciudad
                <span className="block italic text-brand-orange">con mil años de historia</span>
              </h2>
              <p className="section-subtitle mb-10">
                Morella es una de las ciudades medievales mejor conservadas de España.
                Declarada Conjunto Histórico-Artístico, sus calles de piedra, castillo
                y murallas te transportan a otra época. Y tú estarás a un minuto de todo.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {highlights.map((item, i) => (
                <HighlightCard key={item.title} item={item} index={i} />
              ))}
            </div>
          </div>

          {/* Right: gallery mosaic */}
          <div className="grid grid-cols-2 gap-3 h-[600px]">
            <div className="flex flex-col gap-3">
              <div className="rounded-3xl overflow-hidden flex-1">
                <img src={gallery[0]} alt="Morella" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="rounded-3xl overflow-hidden h-40">
                <img src={gallery[2]} alt="Apartamento Oro" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-8">
              <div className="rounded-3xl overflow-hidden h-40">
                <img src={gallery[4]} alt="Apartamento Rojo" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="rounded-3xl overflow-hidden flex-1">
                <img src={gallery[1]} alt="Morella ciudad" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="rounded-3xl overflow-hidden h-32">
                <img src={gallery[3]} alt="Vistas" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
