import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const aptLinks = [
  { href: "#apartamento-oro",    label: "Apartamento Oro" },
  { href: "#apartamento-plata",  label: "Apartamento Plata" },
  { href: "#apartamento-rojo",   label: "Apartamento Rojo" },
  { href: "#apartamento-naranja",label: "Apartamento Naranja" },
];

const links = [
  { href: "#inicio",       label: "Inicio" },
  { href: "#apartamentos", label: "Apartamentos", dropdown: true },
  { href: "#morella",      label: "Morella" },
  { href: "#experiencias", label: "Experiencias" },
  { href: "#reservar",     label: "Reservar" },
  { href: "#contacto",     label: "Contacto" },
];

export default function Navbar() {
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [aptOpen, setAptOpen]   = useState(false);
  const [mobileAptOpen, setMobileAptOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAptOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNav = (e, href) => {
    e.preventDefault();
    setOpen(false);
    setAptOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg shadow-brand-dark/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a
            href="#inicio"
            onClick={(e) => handleNav(e, "#inicio")}
            className="flex items-center gap-2.5 group"
          >
            <div className="flex items-center gap-1 leading-none">
              <span className={`font-display font-bold text-xl transition-colors ${scrolled ? "text-brand-red" : "text-white"}`}>
                rojo
              </span>
              <span className={`font-display font-bold text-xl transition-colors ${scrolled ? "text-brand-orange" : "text-amber-300"}`}>
                y naranja
              </span>
            </div>
            <div className={`h-8 w-px mx-1 transition-colors ${scrolled ? "bg-amber-200" : "bg-white/30"}`} />
            <span className={`text-xs font-medium hidden sm:block transition-colors ${scrolled ? "text-brand-stone" : "text-white/70"}`}>
              Apartamentos en Morella
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1">
            {links.map(({ href, label, dropdown }) => (
              <li key={href} className="relative" ref={dropdown ? dropdownRef : null}>
                {dropdown ? (
                  <>
                    <button
                      onClick={() => setAptOpen((v) => !v)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-brand-orange/10 hover:text-brand-orange ${
                        scrolled ? "text-brand-dark" : "text-white/90"
                      }`}
                    >
                      {label}
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${aptOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Dropdown panel */}
                    <div
                      className={`absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-amber-100 overflow-hidden transition-all duration-200 origin-top ${
                        aptOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-95 pointer-events-none"
                      }`}
                    >
                      {/* "Ver todos" link */}
                      <a
                        href={href}
                        onClick={(e) => handleNav(e, href)}
                        className="block px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-brand-stone border-b border-amber-50 hover:bg-amber-50 hover:text-brand-orange transition-colors"
                      >
                        Ver todos los apartamentos
                      </a>
                      {aptLinks.map((apt) => (
                        <a
                          key={apt.href}
                          href={apt.href}
                          onClick={(e) => handleNav(e, apt.href)}
                          className="block px-4 py-2.5 text-sm text-brand-dark hover:bg-amber-50 hover:text-brand-orange transition-colors"
                        >
                          {apt.label}
                        </a>
                      ))}
                    </div>
                  </>
                ) : (
                  <a
                    href={href}
                    onClick={(e) => handleNav(e, href)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-brand-orange/10 hover:text-brand-orange ${
                      scrolled ? "text-brand-dark" : "text-white/90"
                    } ${href === "#reservar" ? "btn-primary !py-2 !px-5 ml-2" : ""}`}
                  >
                    {label}
                  </a>
                )}
              </li>
            ))}
          </ul>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled ? "text-brand-dark hover:bg-amber-50" : "text-white hover:bg-white/10"
            }`}
            aria-label="Menú"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
        } bg-white/95 backdrop-blur-md border-t border-amber-100`}
      >
        <ul className="px-4 py-3 flex flex-col gap-1">
          {links.map(({ href, label, dropdown }) => (
            <li key={href}>
              {dropdown ? (
                <>
                  <button
                    onClick={() => setMobileAptOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-brand-dark font-medium hover:bg-amber-50 hover:text-brand-orange transition-colors"
                  >
                    {label}
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${mobileAptOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-200 ${
                      mobileAptOpen ? "max-h-64" : "max-h-0"
                    }`}
                  >
                    <a
                      href={href}
                      onClick={(e) => handleNav(e, href)}
                      className="block pl-8 pr-4 py-2.5 text-xs font-bold uppercase tracking-wide text-brand-stone hover:text-brand-orange transition-colors"
                    >
                      Ver todos
                    </a>
                    {aptLinks.map((apt) => (
                      <a
                        key={apt.href}
                        href={apt.href}
                        onClick={(e) => handleNav(e, apt.href)}
                        className="block pl-8 pr-4 py-2.5 text-sm text-brand-dark hover:text-brand-orange transition-colors"
                      >
                        {apt.label}
                      </a>
                    ))}
                  </div>
                </>
              ) : (
                <a
                  href={href}
                  onClick={(e) => handleNav(e, href)}
                  className="block px-4 py-3 rounded-xl text-brand-dark font-medium hover:bg-amber-50 hover:text-brand-orange transition-colors"
                >
                  {label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
