import { useEffect, useState } from "react";
import { ChevronDown, Star, MapPin, Award } from "lucide-react";
import { imgOro, imgPlata, imgRojo, imgNaranja } from "../assets/images";

const slides = [
  {
    bg:  "from-brand-dark/50 via-brand-dark/40 to-transparent",
    img: imgOro[0],
    tag: "Apartamento Oro · Ático con terraza panorámica",
  },
  {
    bg:  "from-brand-dark/65 via-brand-dark/35 to-transparent",
    img: imgPlata[0],
    tag: "Apartamento Plata · Romántico con jacuzzi",
  },
  {
    bg:  "from-brand-dark/60 via-brand-dark/30 to-transparent",
    img: imgRojo[0],
    tag: "Apartamento Rojo · Espacioso, hasta 4 personas",
  },
  {
    bg:  "from-brand-dark/65 via-brand-dark/35 to-transparent",
    img: imgNaranja[0],
    tag: "Apartamento Naranja · Céntrico, hasta 4 personas",
  },
];

const badges = [
  { icon: Star,   text: "10/10 en valoraciones" },
  { icon: MapPin, text: "Centro de Morella" },
  { icon: Award,  text: "Reserva directa" },
];

export default function Hero() {
  const [current, setCurrent]   = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % slides.length);
        setAnimating(false);
      }, 600);
    }, 5500);
    return () => clearInterval(id);
  }, []);

  const scroll = () =>
    document.querySelector("#apartamentos")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="inicio" className="relative min-h-screen flex flex-col">
      {/* Background slideshow */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${s.img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className={`absolute inset-0 bg-gradient-to-r ${s.bg}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative flex-1 flex flex-col justify-center items-start max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-32">
        <div
          className={`max-w-2xl transition-all duration-700 ${
            animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          }`}
        >
          {/* Slide tag */}
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/20 border border-brand-orange/40 text-brand-orange text-sm font-semibold mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
            {slides[current].tag}
          </span>

          <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-4">
            <span className="text-brand-red">rojo</span>
            <span className="text-brand-orange"> y naranja</span>
          </h1>
          <p className="font-display text-2xl md:text-3xl italic text-white/80 mb-6">
            Apartamentos en el centro de Morella
          </p>

          <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
            Cuatro apartamentos de diseño en el corazón de la ciudad medieval amurallada.
            A un minuto de los restaurantes, el castillo y la historia viva de Morella.
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <button
              onClick={() =>
                document.querySelector("#reservar")?.scrollIntoView({ behavior: "smooth" })
              }
              className="btn-primary text-base px-8 py-4 shadow-2xl"
            >
              Consultar disponibilidad
            </button>
            <button
              onClick={scroll}
              className="btn-secondary bg-white/10 border-white/50 text-white hover:bg-white hover:text-brand-red text-base px-8 py-4"
            >
              Ver apartamentos
            </button>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-3">
            {badges.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm"
              >
                <Icon size={14} className="text-amber-300" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide dots */}
      <div className="relative flex justify-center gap-2 pb-8">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current ? "w-8 h-2 bg-brand-orange" : "w-2 h-2 bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scroll}
        className="relative mx-auto mb-8 flex flex-col items-center gap-1 text-white/60 hover:text-white transition-colors"
      >
        <span className="text-xs font-medium">Descubrir</span>
        <ChevronDown size={20} className="animate-bounce" />
      </button>
    </section>
  );
}
