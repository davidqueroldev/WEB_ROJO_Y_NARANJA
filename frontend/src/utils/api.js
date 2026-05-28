import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("host_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("host_token");
      window.location.href = "/admin/login";
    }
    return Promise.reject(err);
  }
);

export default api;

export const apartmentsAPI = {
  getAll:         ()       => api.get("/apartments"),
  getOne:         (id)     => api.get(`/apartments/${id}`),
  checkAvailability: (id, params) => api.get(`/apartments/${id}/availability`, { params }),
};

export const reservationsAPI = {
  create:         (data)   => api.post("/reservations", data),
  verify:         (token)  => api.get(`/reservations/verify/${token}`),
  getByEmail:     (email)  => api.get(`/reservations/by-email/${email}`),
  cancel:         (id, token) => api.delete(`/reservations/${id}`, { data: { token } }),
};

export const authAPI = {
  login:          (creds)  => api.post("/auth/login", creds),
  logout:         ()       => api.post("/auth/logout"),
};

export const dashboardAPI = {
  getReservations: (params) => api.get("/dashboard/reservations", { params }),
  getStats:        ()       => api.get("/dashboard/stats"),
  updateReservation: (id, data) => api.put(`/dashboard/reservations/${id}`, data),
  deleteReservation: (id)   => api.delete(`/dashboard/reservations/${id}`),
  getApartments:   ()       => api.get("/dashboard/apartments"),
  updateApartment: (id, data) => api.put(`/dashboard/apartments/${id}`, data),
};
