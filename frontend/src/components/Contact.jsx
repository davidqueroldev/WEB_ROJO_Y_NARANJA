import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, Loader2, Instagram, Facebook } from "lucide-react";
import { useInView } from "../hooks/useInView";
import toast from "react-hot-toast";
import api from "../utils/api";

const info = [
  {
    icon: MapPin,
    label: "Dirección",
    value: "Calle San Nicolás, 11\nMorella (Castellón) 12300",
    color: "text-brand-red",
    bg: "bg-red-50",
  },
  {
    icon: Phone,
    label: "Teléfono",
    value: "+34 XXX XXX XXX",
    href: "tel:+34XXXXXXXXX",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hola@rojoynaranja.com",
    href: "mailto:hola@rojoynaranja.com",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Clock,
    label: "Atención",
    value: "Respondemos en menos de 1 hora\nCastellano y valenciano",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const { ref, inView }       = useInView();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = Object.fromEntries(new FormData(form));

    setLoading(true);
    try {
      await api.post("/contact", data);
      setSent(true);
      form.reset();
      toast.success("Mensaje enviado. Te responderemos en menos de 1 hora.");
    } catch {
      toast.error("Error al enviar. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contacto" className="py-24 bg-brand-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-red/10 text-brand-red text-sm font-semibold mb-4">
            <Mail size={14} />
            Contacto
          </span>
          <h2 className="section-title mb-4">
            Hablemos de
            <span className="italic text-brand-orange"> tu estancia</span>
          </h2>
          <p className="section-subtitle max-w-xl mx-auto">
            ¿Fechas disponibles, reservas de fin de año o cualquier consulta?
            Escríbenos y respondemos en menos de una hora.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Info */}
          <div className="space-y-4">
            {info.map(({ icon: Icon, label, value, href, color, bg }) => (
              <div
                key={label}
                className="flex gap-4 p-5 bg-white rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`shrink-0 w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon size={20} className={color} />
                </div>
                <div>
                  <p className="font-semibold text-brand-dark text-sm mb-1">{label}</p>
                  {href ? (
                    <a href={href} className={`${color} hover:underline whitespace-pre-line text-sm`}>
                      {value}
                    </a>
                  ) : (
                    <p className="text-brand-stone text-sm whitespace-pre-line">{value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Aviso reservas fin de año */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <p className="text-brand-dark text-sm font-semibold mb-1">📅 Reservas de fin de año</p>
              <p className="text-brand-stone text-sm">
                Las reservas para fin de año tienen tarifas especiales. Por favor, contáctanos directamente por teléfono para consultarlas.
              </p>
            </div>

            {/* Social */}
            <div className="flex gap-3 pt-2">
              <a
                href="#"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold hover:scale-105 transition-transform shadow-lg"
              >
                <Instagram size={16} />
                @rojoynaranja
              </a>
              <a
                href="#"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:scale-105 transition-transform shadow-lg"
              >
                <Facebook size={16} />
                Rojo y Naranja
              </a>
            </div>

            {/* Map placeholder */}
            <div className="mt-4 rounded-2xl overflow-hidden border border-amber-100 h-52 bg-amber-50 flex items-center justify-center">
              <div className="text-center">
                <MapPin size={32} className="text-brand-red mx-auto mb-2" />
                <p className="text-brand-stone text-sm font-medium">Calle San Nicolás, 11</p>
                <p className="text-brand-stone/70 text-xs">Morella, Castellón 12300</p>
                <a
                  href="https://maps.google.com/?q=Calle+San+Nicolás+11+Morella+Castellón"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-orange text-xs hover:underline mt-1 block"
                >
                  Ver en Google Maps →
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="glass-card p-8">
            <h3 className="font-display text-xl font-bold text-brand-dark mb-6">
              Envíanos un mensaje
            </h3>
            {sent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Send size={24} className="text-green-600" />
                </div>
                <p className="text-brand-dark font-semibold mb-2">¡Mensaje enviado!</p>
                <p className="text-brand-stone text-sm">Te respondemos en menos de 1 hora.</p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-4 text-brand-orange text-sm hover:underline"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-brand-dark mb-1.5">Nombre</label>
                    <input name="name" required placeholder="Tu nombre" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-brand-dark mb-1.5">Email</label>
                    <input name="email" type="email" required placeholder="tu@email.com" className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-1.5">Asunto</label>
                  <input name="subject" required placeholder="Consulta de disponibilidad, fechas..." className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-1.5">Mensaje</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="¿Qué apartamento te interesa? ¿Cuántas personas sois? ¿Fechas aproximadas?"
                    className="input-field resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {loading ? "Enviando..." : "Enviar mensaje"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
