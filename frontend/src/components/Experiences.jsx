import { Mountain, Wine, Bike, Footprints, Stars, UtensilsCrossed } from "lucide-react";
import { useInView } from "../hooks/useInView";

const experiences = [
  {
    icon: Footprints,
    title: "Senderismo en Els Ports",
    desc: "Rutas señalizadas por el Parque Natural Els Ports. Paisajes únicos de montaña mediterránea para todos los niveles.",
    price: "Libre",
    color: "from-green-500 to-teal-600",
    img: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80",
  },
  {
    icon: Wine,
    title: "Gastronomía de Morella",
    desc: "Trufa negra, cordero a la brasa, embutidos artesanos y quesos de la comarca. Una cocina de kilómetro cero.",
    price: "Según restaurante",
    color: "from-amber-600 to-yellow-700",
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
  },
  {
    icon: Mountain,
    title: "Escalada y multiaventura",
    desc: "Vías de escalada para todos los niveles en el entorno de Els Ports. También actividades de multiaventura guiadas.",
    price: "Desde 35€",
    color: "from-brand-red to-rose-700",
    img: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=600&q=80",
  },
  {
    icon: Bike,
    title: "Rutas a caballo y BTT",
    desc: "Recorre los bosques y senderos de la comarca a caballo o en bicicleta de montaña. Hay empresas locales especializadas.",
    price: "Desde 25€",
    color: "from-brand-orange to-yellow-600",
    img: "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=600&q=80",
  },
  {
    icon: Stars,
    title: "Astronomía nocturna",
    desc: "Cielos oscuros de nivel Gold. El observatorio de Morella organiza sesiones de telescopio con guía experto.",
    price: "Consultar",
    color: "from-indigo-500 to-blue-700",
    img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80",
  },
  {
    icon: UtensilsCrossed,
    title: "Rutas micológicas",
    desc: "Otoño es la temporada de setas en Els Ports. Excursiones guiadas para recolectar y aprender a identificarlas.",
    price: "Temporada otoño",
    color: "from-stone-500 to-amber-700",
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
  },
];

function ExperienceCard({ exp, index }) {
  const { ref, inView } = useInView();
  const Icon = exp.icon;

  return (
    <div
      ref={ref}
      className={`group relative rounded-3xl overflow-hidden shadow-lg card-hover transition-all duration-600 ${
        inView ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="absolute inset-0">
        <img
          src={exp.img}
          alt={exp.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${exp.color} opacity-75`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <div className="relative p-6 h-64 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Icon size={18} className="text-white" />
          </div>
          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold">
            {exp.price}
          </span>
        </div>

        <div>
          <h3 className="font-display text-xl font-bold text-white mb-2">{exp.title}</h3>
          <p className="text-white/80 text-sm leading-relaxed">{exp.desc}</p>
        </div>
      </div>
    </div>
  );
}

export default function Experiences() {
  const { ref, inView } = useInView();

  return (
    <section id="experiencias" className="py-24 bg-brand-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-4">
            <Mountain size={14} />
            Más que alojamiento
          </span>
          <h2 className="section-title mb-4">
            El entorno que
            <span className="italic text-brand-orange"> te espera fuera</span>
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Morella y sus alrededores ofrecen una agenda inagotable: naturaleza,
            cultura medieval, gastronomía y aventura al alcance desde tu apartamento.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp, i) => (
            <ExperienceCard key={exp.title} exp={exp} index={i} />
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-brand-stone mb-4">¿Necesitas ayuda para organizar tu visita?</p>
          <a
            href="#contacto"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#contacto")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="btn-primary"
          >
            Contáctanos
          </a>
        </div>
      </div>
    </section>
  );
}
