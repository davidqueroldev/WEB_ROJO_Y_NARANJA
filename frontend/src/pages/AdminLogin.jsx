import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, Loader2, Mountain } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { authAPI } from "../utils/api";

export default function AdminLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authAPI.login(data);
      localStorage.setItem("host_token", res.data.token);
      toast.success("Bienvenido al panel de gestión");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-dark via-brand-dark/95 to-brand-red/30 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-red to-brand-orange shadow-2xl mb-4">
            <Mountain size={24} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Panel de gestión</h1>
          <p className="text-white/50 text-sm mt-1">Rojo y Naranja · Acceso privado</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="glass-card p-8 space-y-5 bg-white/10 border-white/20"
        >
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                {...register("email", {
                  required: "Email obligatorio",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email inválido" },
                })}
                type="email"
                placeholder="admin@rojoynaranja.com"
                className="w-full rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/30 pl-10 pr-4 py-3 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/30 transition-all"
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Contraseña</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                {...register("password", { required: "Contraseña obligatoria" })}
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/30 pl-10 pr-12 py-3 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/30 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-red to-brand-orange hover:shadow-xl hover:shadow-brand-red/30 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
            {loading ? "Accediendo..." : "Acceder"}
          </button>
        </form>

        <p className="text-center text-white/30 text-xs mt-6">
          Acceso restringido. Solo personal autorizado.
        </p>
      </div>
    </div>
  );
}
