import { useState } from "react";
import {
  Users, BedDouble, Bath, Wifi, ChevronRight,
  Ban, Grid2x2, Check, CalendarCheck,
} from "lucide-react";
import { useInView } from "../hooks/useInView";
import { imgOro, imgPlata, imgRojo, imgNaranja } from "../assets/images";
import Lightbox from "./Lightbox";

// ─────────────────────────────────────────────────────────────────
// Datos de apartamentos (también importados por BookingForm)
// ─────────────────────────────────────────────────────────────────
export const apartments = [
  {
    id: 1,
    slug: "oro",
    name: "Apartamento Oro",
    subtitle: "Ático con terraza panorámica",
    capacity: 2,
    bedrooms: 1,
    bathrooms: 1,
    noChildren: true,
    color: "from-yellow-500 to-amber-600",
    accentHex: "#d97706",
    borderCls: "border-amber-300",
    bgCls: "bg-amber-50/60",
    sectionBg: "bg-gradient-to-br from-amber-50 to-white",
    badgeCls: "bg-amber-100 text-amber-800",
    images: imgOro,
    description:
      "El más exclusivo de nuestros apartamentos. Situado en el último piso, cuenta con una terraza privada de 16 m² desde la que se divisa toda Morella: el castillo, las murallas medievales y los tejados de la ciudad histórica.\n\nEl jacuzzi para dos personas, con mantenedor de calor y cromoterapia, te permite relajarte con vistas únicas. La chimenea eléctrica y la cocina de diseño completan una experiencia verdaderamente especial.",
    amenities: [
      { label: "Terraza privada 16 m² con vistas panorámicas", icon: "✦" },
      { label: "Jacuzzi para 2 personas con cromoterapia",      icon: "✦" },
      { label: "Mantenedor de calor en jacuzzi",               icon: "✦" },
      { label: "Chimenea eléctrica decorativa",                icon: "✦" },
      { label: "Cocina equipada premium",                      icon: "✦" },
      { label: "WiFi de alta velocidad",                       icon: "✦" },
      { label: "Smart TV",                                     icon: "✦" },
      { label: "Cafetera de cápsulas",                         icon: "✦" },
    ],
    tags: ["Ático", "Premium"],
  },
  {
    id: 2,
    slug: "plata",
    name: "Apartamento Plata",
    subtitle: "Romántico con jacuzzi",
    capacity: 2,
    bedrooms: 1,
    bathrooms: 1,
    noChildren: true,
    color: "from-slate-400 to-slate-600",
    accentHex: "#475569",
    borderCls: "border-slate-300",
    bgCls: "bg-slate-50/60",
    sectionBg: "bg-gradient-to-br from-slate-50 to-white",
    badgeCls: "bg-slate-100 text-slate-700",
    images: imgPlata,
    description:
      "Diseñado para parejas que buscan una escapada con todas las comodidades. La cama de matrimonio 160×200 cm, el jacuzzi con mantenedor de calor y cromoterapia, y la chimenea eléctrica crean un ambiente íntimo y acogedor.\n\nLa cocina premium, equipada con dos cafeteras para que cada uno elija su bebida preferida, y el salón de diseño hacen del Plata el lugar perfecto para desconectar.",
    amenities: [
      { label: "Cama de matrimonio 160×200 cm",    icon: "✦" },
      { label: "Jacuzzi con cromoterapia",          icon: "✦" },
      { label: "Mantenedor de calor en jacuzzi",   icon: "✦" },
      { label: "Chimenea eléctrica decorativa",    icon: "✦" },
      { label: "Doble cafetera (cápsulas + filtro)", icon: "✦" },
      { label: "Cocina equipada premium",          icon: "✦" },
      { label: "WiFi de alta velocidad",           icon: "✦" },
      { label: "Smart TV",                         icon: "✦" },
    ],
    tags: ["Romántico", "Premium"],
  },
  {
    id: 3,
    slug: "rojo",
    name: "Apartamento Rojo",
    subtitle: "Espacioso · Hasta 4 personas",
    capacity: 4,
    bedrooms: 2,
    bathrooms: 2,
    noChildren: false,
    color: "from-brand-red to-rose-700",
    accentHex: "#b91c1c",
    borderCls: "border-red-300",
    bgCls: "bg-red-50/60",
    sectionBg: "bg-gradient-to-br from-red-50 to-white",
    badgeCls: "bg-red-100 text-red-800",
    images: imgRojo,
    description:
      "El Rojo es nuestro apartamento más completo para grupos de hasta 4 personas. Dispone de un dormitorio suite y un dormitorio doble, cada uno pensado para ofrecer el máximo descanso.\n\nCuenta con dos baños completos: uno con ducha hidromasaje y otro con bañera termostática de diseño. La cocina está totalmente equipada con lavadora, secadora y lavavajillas para que no te falte nada durante una estancia prolongada.",
    amenities: [
      { label: "Dormitorio suite",                  icon: "✦" },
      { label: "Dormitorio doble",                  icon: "✦" },
      { label: "Baño con ducha hidromasaje",         icon: "✦" },
      { label: "Baño con bañera termostática",       icon: "✦" },
      { label: "Lavadora y secadora",               icon: "✦" },
      { label: "Lavavajillas",                      icon: "✦" },
      { label: "Cocina completamente equipada",     icon: "✦" },
      { label: "WiFi de alta velocidad",            icon: "✦" },
      { label: "Smart TV en salón y dormitorios",   icon: "✦" },
    ],
    tags: ["Familias", "Amigos"],
  },
  {
    id: 4,
    slug: "naranja",
    name: "Apartamento Naranja",
    subtitle: "Céntrico · Hasta 4 personas",
    capacity: 4,
    bedrooms: 2,
    bathrooms: 1,
    noChildren: false,
    color: "from-brand-orange to-yellow-600",
    accentHex: "#d97706",
    borderCls: "border-orange-300",
    bgCls: "bg-orange-50/60",
    sectionBg: "bg-gradient-to-br from-orange-50 to-white",
    badgeCls: "bg-orange-100 text-orange-800",
    images: imgNaranja,
    description:
      "Luminoso y acogedor, el Naranja es ideal para dos parejas o una familia. El dormitorio suite y el dormitorio doble ofrecen comodidad para todos, y el baño completo con ducha hidromasaje añade el toque de bienestar que mereces.\n\nEl amplio salón-comedor y la cocina totalmente equipada lo convierten en el hogar perfecto en el centro histórico de Morella, con todo a un minuto a pie.",
    amenities: [
      { label: "Dormitorio suite",                icon: "✦" },
      { label: "Dormitorio doble",                icon: "✦" },
      { label: "Baño con ducha hidromasaje",       icon: "✦" },
      { label: "Salón-comedor amplio",            icon: "✦" },
      { label: "Cocina completamente equipada",   icon: "✦" },
      { label: "WiFi de alta velocidad",          icon: "✦" },
      { label: "Smart TV",                        icon: "✦" },
    ],
    tags: ["Familias", "Céntrico"],
  },
];

// ─────────────────────────────────────────────────────────────────
// Galería estilo Airbnb (1 grande + 4 miniaturas con "+N fotos")
// ─────────────────────────────────────────────────────────────────
function ApartmentGallery({ images, name, onOpen }) {
  const main   = images[0];
  const thumbs = images.slice(1, 5);
  const extra  = images.length - 5;

  return (
    <div className="grid grid-cols-2 gap-2 h-[420px] md:h-[500px] rounded-2xl overflow-hidden">
      {/* Imagen principal */}
      <div
        className="row-span-2 relative cursor-pointer group overflow-hidden"
        onClick={() => onOpen(0)}
      >
        <img
          src={main}
          alt={`${name} — foto principal`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      {/* 4 miniaturas */}
      {thumbs.map((img, i) => {
        const isLast  = i === 3;
        const imgIdx  = i + 1;
        return (
          <div
            key={i}
            className="relative cursor-pointer group overflow-hidden"
            onClick={() => onOpen(imgIdx)}
          >
            <img
              src={img}
              alt={`${name} — foto ${imgIdx + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
            {/* Overlay "+N fotos" en la última miniatura */}
            {isLast && extra > 0 && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1">
                <Grid2x2 size={22} className="text-white" />
                <span className="text-white font-bold text-lg">+{extra} fotos</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Sección individual de apartamento
// ─────────────────────────────────────────────────────────────────
function ApartmentSection({ apt, reverse }) {
  const { ref, inView } = useInView();
  const [lightboxIdx, setLightboxIdx] = useState(null);

  const openLightbox  = (i) => setLightboxIdx(i);
  const closeLightbox = ()  => setLightboxIdx(null);

  return (
    <div id={`apartamento-${apt.slug}`} className={`${apt.sectionBg} py-20`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera */}
        <div
          ref={ref}
          className={`mb-10 transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="flex flex-wrap items-center gap-3 mb-3">
            {apt.tags.map((t) => (
              <span
                key={t}
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${apt.badgeCls}`}
              >
                {t}
              </span>
            ))}
            {apt.noChildren && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-bold">
                <Ban size={11} /> Sin niños
              </span>
            )}
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-brand-dark">
            {apt.name}
          </h2>
          <p className="text-brand-stone text-lg mt-1">{apt.subtitle}</p>
        </div>

        {/* Layout: galería + info */}
        <div className={`flex flex-col ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"} gap-10 lg:gap-14 items-start`}>
          {/* Galería */}
          <div className="w-full lg:w-3/5 shrink-0">
            <ApartmentGallery
              images={apt.images}
              name={apt.name}
              onOpen={openLightbox}
            />
            <button
              onClick={() => openLightbox(0)}
              className="mt-3 flex items-center gap-2 text-sm text-brand-stone hover:text-brand-dark transition-colors"
            >
              <Grid2x2 size={14} />
              Ver las {apt.images.length} fotos
            </button>
          </div>

          {/* Info */}
          <div className="w-full lg:w-2/5 space-y-7">
            {/* Stats rápidos */}
            <div className="flex gap-6 pb-5 border-b border-amber-100">
              <div className="flex items-center gap-2 text-brand-stone">
                <Users size={17} className="text-brand-orange" />
                <span className="text-sm font-medium">Hasta {apt.capacity} personas</span>
              </div>
              <div className="flex items-center gap-2 text-brand-stone">
                <BedDouble size={17} className="text-brand-orange" />
                <span className="text-sm font-medium">{apt.bedrooms} dormitorio{apt.bedrooms > 1 ? "s" : ""}</span>
              </div>
              <div className="flex items-center gap-2 text-brand-stone">
                <Bath size={17} className="text-brand-orange" />
                <span className="text-sm font-medium">{apt.bathrooms} baño{apt.bathrooms > 1 ? "s" : ""}</span>
              </div>
            </div>

            {/* Descripción */}
            <div>
              {apt.description.split("\n\n").map((p, i) => (
                <p key={i} className="text-brand-stone leading-relaxed mb-4 last:mb-0">
                  {p}
                </p>
              ))}
            </div>

            {/* Amenities */}
            <div>
              <h4 className="font-semibold text-brand-dark mb-3">Lo que incluye</h4>
              <ul className="space-y-2">
                {apt.amenities.map((a) => (
                  <li key={a.label} className="flex items-start gap-2.5 text-brand-stone text-sm">
                    <span className="mt-0.5 w-4 h-4 rounded-full bg-gradient-to-br from-brand-red to-brand-orange flex items-center justify-center shrink-0">
                      <Check size={9} className="text-white" strokeWidth={3} />
                    </span>
                    {a.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <button
              onClick={() =>
                document.querySelector("#reservar")?.scrollIntoView({ behavior: "smooth" })
              }
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white bg-gradient-to-r ${apt.color} shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200`}
            >
              <CalendarCheck size={17} />
              Consultar disponibilidad
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <Lightbox
          images={apt.images}
          index={lightboxIdx}
          onClose={closeLightbox}
          onGoTo={setLightboxIdx}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Componente raíz exportado
// ─────────────────────────────────────────────────────────────────
export default function Apartments() {
  const { ref, inView } = useInView();

  return (
    <div id="apartamentos">
      {/* Intro */}
      <div className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div
            ref={ref}
            className={`transition-all duration-700 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-red/10 text-brand-red text-sm font-semibold mb-4">
              Calle San Nicolás, 11 · Morella
            </span>
            <h2 className="section-title mb-4">
              Cuatro apartamentos
              <span className="italic text-brand-orange"> de diseño</span>
            </h2>
            <p className="section-subtitle">
              Cada apartamento es único, con su propio carácter y nombre.
              Todos en el corazón del casco histórico de Morella, a un minuto
              del castillo, los restaurantes y los principales monumentos.
            </p>
          </div>
        </div>
      </div>

      {/* Secciones individuales */}
      {apartments.map((apt, i) => (
        <ApartmentSection key={apt.id} apt={apt} reverse={i % 2 !== 0} />
      ))}
    </div>
  );
}
