import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Calendar, Home, Settings, LogOut, Menu, X,
  TrendingUp, Users, Euro, CheckCircle, Clock, XCircle,
  ChevronDown, Search, Filter, Trash2, Edit2, Eye, RefreshCw,
  Mountain,
} from "lucide-react";
import toast from "react-hot-toast";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { dashboardAPI, authAPI } from "../utils/api";

const STATUS_STYLES = {
  confirmed: { label: "Confirmada", icon: CheckCircle, cls: "bg-green-100 text-green-700" },
  pending:   { label: "Pendiente",  icon: Clock,         cls: "bg-yellow-100 text-yellow-700" },
  cancelled: { label: "Cancelada",  icon: XCircle,       cls: "bg-red-100 text-red-700" },
};

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          <Icon size={18} className="text-white" />
        </div>
        <TrendingUp size={14} className="text-green-500" />
      </div>
      <p className="text-2xl font-bold text-brand-dark mb-0.5">{value}</p>
      <p className="text-brand-stone text-sm font-medium">{label}</p>
      {sub && <p className="text-brand-stone/60 text-xs mt-1">{sub}</p>}
    </div>
  );
}

function ReservationRow({ res, onStatusChange, onDelete }) {
  const [open, setOpen] = useState(false);
  const status = STATUS_STYLES[res.status] || STATUS_STYLES.pending;
  const StatusIcon = status.icon;

  return (
    <>
      <tr className="hover:bg-amber-50/50 transition-colors">
        <td className="px-4 py-3 text-sm font-medium text-brand-dark">#{res.id}</td>
        <td className="px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-brand-dark">{res.guest_name}</p>
            <p className="text-xs text-brand-stone">{res.guest_email}</p>
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-brand-stone">{res.apartment_name}</td>
        <td className="px-4 py-3">
          <div className="text-xs text-brand-stone">
            <p>{format(parseISO(res.check_in),  "dd MMM yyyy", { locale: es })}</p>
            <p className="text-brand-stone/60">→ {format(parseISO(res.check_out), "dd MMM yyyy", { locale: es })}</p>
          </div>
        </td>
        <td className="px-4 py-3 text-sm font-semibold text-brand-orange">{res.total_price}€</td>
        <td className="px-4 py-3">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${status.cls}`}>
            <StatusIcon size={11} />
            {status.label}
          </span>
        </td>
        <td className="px-4 py-3">
          <div className="flex gap-1">
            <button
              onClick={() => setOpen(!open)}
              className="p-1.5 rounded-lg text-brand-stone hover:bg-amber-100 transition-colors"
              title="Ver detalles"
            >
              <Eye size={14} />
            </button>
            <button
              onClick={() => {
                const next = res.status === "confirmed" ? "cancelled" : "confirmed";
                onStatusChange(res.id, next);
              }}
              className="p-1.5 rounded-lg text-brand-stone hover:bg-amber-100 transition-colors"
              title="Cambiar estado"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={() => onDelete(res.id)}
              className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
              title="Eliminar"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </td>
      </tr>
      {open && (
        <tr className="bg-amber-50/30">
          <td colSpan={7} className="px-4 py-3">
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-semibold text-brand-dark mb-1">Contacto</p>
                <p className="text-brand-stone">{res.guest_phone || "—"}</p>
              </div>
              <div>
                <p className="font-semibold text-brand-dark mb-1">Huéspedes</p>
                <p className="text-brand-stone">{res.adults} adultos, {res.children || 0} niños</p>
              </div>
              {res.notes && (
                <div>
                  <p className="font-semibold text-brand-dark mb-1">Notas</p>
                  <p className="text-brand-stone">{res.notes}</p>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function Dashboard() {
  const navigate                      = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setSection]   = useState("reservations");
  const [reservations, setReservations] = useState([]);
  const [stats, setStats]             = useState(null);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [filterStatus, setFilter]     = useState("all");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [resRes, statsRes] = await Promise.all([
        dashboardAPI.getReservations(),
        dashboardAPI.getStats(),
      ]);
      setReservations(resRes.data);
      setStats(statsRes.data);
    } catch {
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleLogout = async () => {
    await authAPI.logout().catch(() => {});
    localStorage.removeItem("host_token");
    navigate("/admin/login");
  };

  const handleStatusChange = async (id, status) => {
    try {
      await dashboardAPI.updateReservation(id, { status });
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
      toast.success("Estado actualizado");
    } catch {
      toast.error("Error al actualizar");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta reserva permanentemente?")) return;
    try {
      await dashboardAPI.deleteReservation(id);
      setReservations((prev) => prev.filter((r) => r.id !== id));
      toast.success("Reserva eliminada");
    } catch {
      toast.error("Error al eliminar");
    }
  };

  const filtered = reservations.filter((r) => {
    const matchSearch =
      r.guest_name.toLowerCase().includes(search.toLowerCase()) ||
      r.guest_email.toLowerCase().includes(search.toLowerCase()) ||
      r.apartment_name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const navItems = [
    { id: "reservations", icon: Calendar, label: "Reservas" },
    { id: "apartments",   icon: Home,     label: "Apartamentos" },
    { id: "settings",     icon: Settings, label: "Configuración" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-dark text-white flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-red to-brand-orange flex items-center justify-center">
              <Mountain size={18} className="text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-sm leading-none">Rojo y Naranja</p>
              <p className="text-white/50 text-xs">Panel de gestión</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setSection(id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeSection === id
                  ? "bg-gradient-to-r from-brand-red to-brand-orange text-white shadow-lg"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all mb-1"
          >
            <LayoutDashboard size={17} />
            Ver sitio web
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={17} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div>
              <h1 className="font-display text-lg font-bold text-brand-dark">
                {navItems.find((n) => n.id === activeSection)?.label}
              </h1>
              <p className="text-brand-stone text-xs hidden sm:block">
                {format(new Date(), "EEEE, d 'de' MMMM yyyy", { locale: es })}
              </p>
            </div>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-brand-stone text-sm hover:bg-amber-50 transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Actualizar</span>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* SECTION: Reservations */}
          {activeSection === "reservations" && (
            <>
              {/* Stats */}
              {stats && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard icon={Calendar} label="Total reservas" value={stats.total} sub="históricas" color="bg-blue-500" />
                  <StatCard icon={CheckCircle} label="Confirmadas" value={stats.confirmed} sub="activas" color="bg-green-500" />
                  <StatCard icon={Users} label="Huéspedes" value={stats.guests} sub="este mes" color="bg-purple-500" />
                  <StatCard icon={Euro} label="Ingresos" value={`${stats.revenue}€`} sub="este mes" color="bg-brand-orange" />
                </div>
              )}

              {/* Filters */}
              <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-amber-100 flex flex-wrap gap-3 items-center">
                  <div className="relative flex-1 min-w-48">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-stone/60" />
                    <input
                      type="text"
                      placeholder="Buscar huésped, email, apartamento..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-amber-100 focus:outline-none focus:border-brand-orange transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter size={14} className="text-brand-stone" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilter(e.target.value)}
                      className="text-sm border border-amber-100 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-orange"
                    >
                      <option value="all">Todos los estados</option>
                      <option value="confirmed">Confirmadas</option>
                      <option value="pending">Pendientes</option>
                      <option value="cancelled">Canceladas</option>
                    </select>
                  </div>
                  <span className="text-brand-stone text-sm">
                    {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-amber-50/60">
                        {["#", "Huésped", "Apartamento", "Fechas", "Total", "Estado", "Acciones"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-brand-stone uppercase tracking-wide">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-50">
                      {loading ? (
                        <tr>
                          <td colSpan={7} className="text-center py-12 text-brand-stone">
                            <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-brand-orange" />
                            Cargando reservas...
                          </td>
                        </tr>
                      ) : filtered.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-12 text-brand-stone">
                            <Calendar size={32} className="mx-auto mb-2 text-amber-200" />
                            No hay reservas que mostrar
                          </td>
                        </tr>
                      ) : (
                        filtered.map((res) => (
                          <ReservationRow
                            key={res.id}
                            res={res}
                            onStatusChange={handleStatusChange}
                            onDelete={handleDelete}
                          />
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* SECTION: Apartments placeholder */}
          {activeSection === "apartments" && (
            <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-8 text-center">
              <Home size={40} className="text-amber-200 mx-auto mb-3" />
              <h3 className="font-display text-xl font-bold text-brand-dark mb-2">
                Gestión de apartamentos
              </h3>
              <p className="text-brand-stone">
                Módulo de gestión de precios, fotos y disponibilidad. Próximamente.
              </p>
            </div>
          )}

          {/* SECTION: Settings placeholder */}
          {activeSection === "settings" && (
            <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-8 text-center">
              <Settings size={40} className="text-amber-200 mx-auto mb-3" />
              <h3 className="font-display text-xl font-bold text-brand-dark mb-2">
                Configuración
              </h3>
              <p className="text-brand-stone">
                Gestión de credenciales, notificaciones y preferencias del sistema.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
