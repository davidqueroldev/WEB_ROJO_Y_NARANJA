import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm, Controller } from "react-hook-form";
import { addDays, differenceInDays, format, isBefore, startOfToday } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Users, Mail, User, Phone, MessageSquare, Check, Loader2, Ban } from "lucide-react";
import toast from "react-hot-toast";
import { reservationsAPI } from "../utils/api";
import { apartments } from "./Apartments";
import { useInView } from "../hooks/useInView";

const STEPS = ["Apartamento", "Fechas", "Huéspedes", "Confirmación"];

export default function BookingForm() {
  const [step, setStep]       = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { ref, inView }       = useInView();

  const {
    register, control, handleSubmit, watch, setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      apartment_id: "",
      check_in:  null,
      check_out: null,
      adults: 2,
      children: 0,
      guest_name: "",
      guest_email: "",
      guest_phone: "",
      notes: "",
    },
  });

  const watchedApt  = watch("apartment_id");
  const watchedIn   = watch("check_in");
  const watchedOut  = watch("check_out");
  const selectedApt = apartments.find((a) => a.id === Number(watchedApt));
  const nights      = watchedIn && watchedOut ? differenceInDays(watchedOut, watchedIn) : 0;

  const onSubmit = async (data) => {
    if (step < 3) { setStep(step + 1); return; }

    setLoading(true);
    try {
      await reservationsAPI.create({
        ...data,
        check_in:     format(data.check_in,  "yyyy-MM-dd"),
        check_out:    format(data.check_out, "yyyy-MM-dd"),
        apartment_id: Number(data.apartment_id),
      });
      setSuccess(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al crear la reserva. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section id="reservar" className="py-24 bg-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Check size={36} className="text-white" />
          </div>
          <h2 className="font-display text-3xl font-bold text-brand-dark mb-4">
            ¡Solicitud enviada!
          </h2>
          <p className="text-brand-stone text-lg mb-6">
            Hemos recibido tu consulta. Te enviamos un email de confirmación a{" "}
            <strong>{watch("guest_email")}</strong>.
          </p>
          <p className="text-brand-stone/70 text-sm mb-8">
            Si no lo recibes en los próximos minutos, revisa la carpeta de spam.
          </p>
          <button
            onClick={() => { setSuccess(false); setStep(0); }}
            className="btn-secondary"
          >
            Nueva consulta
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="reservar" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div
          ref={ref}
          className={`text-center mb-12 transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-red/10 text-brand-red text-sm font-semibold mb-4">
            <Calendar size={14} />
            Consulta disponibilidad
          </span>
          <h2 className="section-title mb-4">
            Reserva
            <span className="italic text-brand-orange"> directa</span>
          </h2>
          <p className="section-subtitle">
            Sin intermediarios. Consulta disponibilidad y te respondemos en menos de 1 hora.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-full font-semibold text-sm transition-all duration-300 ${
                  i < step
                    ? "bg-gradient-to-br from-brand-red to-brand-orange text-white shadow-lg"
                    : i === step
                    ? "bg-brand-dark text-white shadow-md"
                    : "bg-amber-100 text-brand-stone"
                }`}
              >
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span
                className={`hidden sm:block ml-2 text-sm font-medium transition-colors ${
                  i === step ? "text-brand-dark" : "text-brand-stone/60"
                }`}
              >
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className={`w-8 sm:w-16 h-0.5 mx-3 transition-all duration-300 ${
                    i < step ? "bg-brand-orange" : "bg-amber-100"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-8">
          {/* STEP 0 — Apartment */}
          {step === 0 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-display text-xl font-bold text-brand-dark mb-6">
                Elige tu apartamento
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {apartments.map((apt) => (
                  <label
                    key={apt.id}
                    className={`flex gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 hover:border-brand-orange ${
                      Number(watchedApt) === apt.id
                        ? `${apt.borderCls} ${apt.bgCls}`
                        : "border-amber-100 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      value={apt.id}
                      {...register("apartment_id", { required: "Selecciona un apartamento" })}
                      className="hidden"
                    />
                    <img
                      src={apt.images[0]}
                      alt={apt.name}
                      className="w-20 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-bold text-brand-dark text-sm">{apt.name}</span>
                        {Number(watchedApt) === apt.id && (
                          <span className="w-5 h-5 rounded-full bg-brand-orange flex items-center justify-center shrink-0">
                            <Check size={10} className="text-white" />
                          </span>
                        )}
                        {apt.noChildren && (
                          <span className="flex items-center gap-0.5 text-xs text-red-500 font-medium">
                            <Ban size={10} /> Sin niños
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-brand-stone block">
                        Hasta {apt.capacity} personas · {apt.bedrooms} dorm
                      </span>
                      <span className="text-xs text-brand-stone/60 block">{apt.subtitle}</span>
                    </div>
                  </label>
                ))}
              </div>
              {errors.apartment_id && (
                <p className="text-red-500 text-sm">{errors.apartment_id.message}</p>
              )}
            </div>
          )}

          {/* STEP 1 — Dates */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h3 className="font-display text-xl font-bold text-brand-dark mb-6">
                Elige tus fechas
              </h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-2">Llegada</label>
                  <Controller
                    name="check_in"
                    control={control}
                    rules={{ required: "Selecciona la fecha de llegada" }}
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={(d) => {
                          field.onChange(d);
                          if (watchedOut && !isBefore(d, watchedOut)) setValue("check_out", null);
                        }}
                        minDate={startOfToday()}
                        dateFormat="dd/MM/yyyy"
                        locale={es}
                        placeholderText="dd/mm/aaaa"
                        className="input-field"
                        calendarClassName="font-body"
                        wrapperClassName="w-full"
                      />
                    )}
                  />
                  {errors.check_in && (
                    <p className="text-red-500 text-sm mt-1">{errors.check_in.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-2">Salida</label>
                  <Controller
                    name="check_out"
                    control={control}
                    rules={{ required: "Selecciona la fecha de salida" }}
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        minDate={watchedIn ? addDays(watchedIn, 1) : addDays(startOfToday(), 1)}
                        dateFormat="dd/MM/yyyy"
                        locale={es}
                        placeholderText="dd/mm/aaaa"
                        className="input-field"
                        wrapperClassName="w-full"
                      />
                    )}
                  />
                  {errors.check_out && (
                    <p className="text-red-500 text-sm mt-1">{errors.check_out.message}</p>
                  )}
                </div>
              </div>

              {nights > 0 && selectedApt && (
                <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-100">
                  <div className="flex justify-between items-center">
                    <span className="text-brand-stone">
                      {selectedApt.name} · {nights} noche{nights !== 1 ? "s" : ""}
                    </span>
                    <span className="font-semibold text-brand-orange text-sm">
                      Precio a confirmar
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2 — Guests */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <h3 className="font-display text-xl font-bold text-brand-dark mb-6">
                Datos de contacto
              </h3>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-2">Nombre completo *</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-stone/60" />
                    <input
                      {...register("guest_name", { required: "El nombre es obligatorio" })}
                      placeholder="Juan García López"
                      className="input-field pl-10"
                    />
                  </div>
                  {errors.guest_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.guest_name.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-2">Email *</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-stone/60" />
                    <input
                      {...register("guest_email", {
                        required: "El email es obligatorio",
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email inválido" },
                      })}
                      type="email"
                      placeholder="juan@ejemplo.com"
                      className="input-field pl-10"
                    />
                  </div>
                  {errors.guest_email && (
                    <p className="text-red-500 text-sm mt-1">{errors.guest_email.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-2">Teléfono</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-stone/60" />
                    <input
                      {...register("guest_phone")}
                      type="tel"
                      placeholder="+34 600 000 000"
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-2">Adultos *</label>
                  <div className="relative">
                    <Users size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-stone/60" />
                    <select
                      {...register("adults", { required: true, min: 1 })}
                      className="input-field pl-10 appearance-none"
                    >
                      {[1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>{n} adulto{n !== 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">
                  Notas o peticiones especiales
                </label>
                <div className="relative">
                  <MessageSquare size={16} className="absolute left-3.5 top-3.5 text-brand-stone/60" />
                  <textarea
                    {...register("notes")}
                    rows={3}
                    placeholder="Hora de llegada aproximada, celebración especial, alergias..."
                    className="input-field pl-10 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 — Confirm */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h3 className="font-display text-xl font-bold text-brand-dark mb-6">
                Confirma tu consulta
              </h3>
              {selectedApt && (
                <div className="rounded-2xl overflow-hidden border border-amber-100 mb-6">
                  <div className="flex items-center gap-4 p-4 bg-amber-50">
                    <img
                      src={selectedApt.images[0]}
                      alt={selectedApt.name}
                      className="w-16 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <p className="font-bold text-brand-dark">{selectedApt.name}</p>
                      <p className="text-brand-stone text-sm">{selectedApt.subtitle}</p>
                    </div>
                  </div>
                  <div className="p-4 space-y-2.5 text-sm">
                    {[
                      ["Llegada",  watchedIn  ? format(watchedIn,  "dd/MM/yyyy") : "—"],
                      ["Salida",   watchedOut ? format(watchedOut, "dd/MM/yyyy") : "—"],
                      ["Noches",   nights],
                      ["Adultos",  watch("adults")],
                      ["Huésped",  watch("guest_name")],
                      ["Email",    watch("guest_email")],
                      ["Teléfono", watch("guest_phone") || "—"],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between">
                        <span className="text-brand-stone">{label}</span>
                        <span className="font-medium text-brand-dark">{value}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 border-t border-amber-100">
                      <span className="font-semibold text-brand-dark">Precio</span>
                      <span className="font-semibold text-brand-orange">Te lo confirmamos por email</span>
                    </div>
                  </div>
                </div>
              )}
              <p className="text-brand-stone text-sm bg-blue-50 border border-blue-100 rounded-xl p-4">
                Recibirás un email en <strong>{watch("guest_email")}</strong> con la
                confirmación de disponibilidad y el precio. Respondemos en menos de 1 hora.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-amber-100">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="btn-secondary flex-1"
              >
                Atrás
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : step < 3 ? (
                "Continuar"
              ) : (
                "Enviar consulta"
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
