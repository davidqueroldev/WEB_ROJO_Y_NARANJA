import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, Mountain } from "lucide-react";
import { reservationsAPI } from "../utils/api";

export default function EmailVerify() {
  const { token }       = useParams();
  const [status, setStatus] = useState("loading");
  const [data, setData]     = useState(null);

  useEffect(() => {
    reservationsAPI.verify(token)
      .then((res) => { setData(res.data); setStatus("success"); })
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center px-4">
      <div className="glass-card p-10 max-w-lg w-full text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-red to-brand-orange flex items-center justify-center">
            <Mountain size={20} className="text-white" />
          </div>
          <span className="font-display font-bold text-xl text-brand-dark">Rojo y Naranja</span>
        </div>

        {status === "loading" && (
          <div>
            <Loader2 size={48} className="text-brand-orange animate-spin mx-auto mb-4" />
            <p className="text-brand-dark font-semibold text-lg">Verificando tu reserva...</p>
          </div>
        )}

        {status === "success" && (
          <div>
            <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
            <h1 className="font-display text-3xl font-bold text-brand-dark mb-3">
              ¡Reserva confirmada!
            </h1>
            {data && (
              <div className="bg-amber-50 rounded-2xl p-5 text-left space-y-2 mb-6 text-sm">
                <p><span className="font-semibold text-brand-dark">Apartamento:</span> <span className="text-brand-stone">{data.apartment_name}</span></p>
                <p><span className="font-semibold text-brand-dark">Llegada:</span> <span className="text-brand-stone">{data.check_in}</span></p>
                <p><span className="font-semibold text-brand-dark">Salida:</span> <span className="text-brand-stone">{data.check_out}</span></p>
                <p><span className="font-semibold text-brand-dark">Total:</span> <span className="text-brand-orange font-bold">{data.total_price}€</span></p>
              </div>
            )}
            <p className="text-brand-stone text-sm mb-6">
              Hemos enviado los detalles de tu reserva a tu email.
              ¡Nos vemos pronto!
            </p>
            <Link to="/" className="btn-primary">Volver al inicio</Link>
          </div>
        )}

        {status === "error" && (
          <div>
            <XCircle size={56} className="text-red-500 mx-auto mb-4" />
            <h1 className="font-display text-2xl font-bold text-brand-dark mb-3">
              Enlace inválido o expirado
            </h1>
            <p className="text-brand-stone text-sm mb-6">
              El enlace de verificación ha expirado o ya fue utilizado.
              Si crees que es un error, contáctanos.
            </p>
            <div className="flex gap-3 justify-center">
              <Link to="/" className="btn-secondary">Inicio</Link>
              <Link to="/#reservar" className="btn-primary">Nueva reserva</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
