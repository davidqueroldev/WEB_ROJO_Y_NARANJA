import { Heart } from "lucide-react";

const year = new Date().getFullYear();

const cols = [
  {
    title: "Apartamentos",
    links: ["Apartamento Oro", "Apartamento Plata", "Apartamento Rojo", "Apartamento Naranja"],
  },
  {
    title: "Información",
    links: ["Política de reservas", "Cancelaciones", "Normas de la casa", "Cómo llegar", "FAQ"],
  },
  {
    title: "Morella",
    links: ["Castillo de Morella", "Santa María la Mayor", "Els Ports", "Gastronomía", "Dinosaurios"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="font-display font-bold text-2xl text-brand-red">rojo</span>
              <span className="font-display font-bold text-2xl text-brand-orange">y naranja</span>
            </div>
            <p className="text-brand-orange text-xs mb-4">Apartamentos en el centro de Morella</p>
            <p className="text-sm leading-relaxed mb-5">
              Cuatro apartamentos únicos en el corazón del casco histórico
              de Morella (Castellón). Reserva directa, sin intermediarios.
            </p>
            <p className="text-xs text-white/40">Calle San Nicolás, 11 · Morella 12300</p>
            <p className="text-xs text-white/30 mt-1">
              Reg: 23750-CS · 23751-CS · 27852-CS · 27853-CS
            </p>
          </div>

          {/* Columns */}
          {cols.map(({ title, links }) => (
            <div key={title}>
              <h4 className="font-semibold text-white text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm hover:text-brand-orange transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © {year} Rojo y Naranja · rojoynaranja.com · Todos los derechos reservados.
          </p>
          <p className="text-xs text-white/40 flex items-center gap-1">
            Hecho con <Heart size={10} className="text-brand-red fill-brand-red mx-0.5" /> en Morella ·{" "}
            <a href="/admin" className="hover:text-brand-orange transition-colors ml-1">
              Panel de gestión
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
