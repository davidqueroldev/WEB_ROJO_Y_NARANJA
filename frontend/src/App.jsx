import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import EmailVerify from "./pages/EmailVerify";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("host_token");
  return token ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          className: "font-body text-sm",
          style: { borderRadius: "12px", boxShadow: "0 10px 40px rgba(0,0,0,.12)" },
          success: { iconTheme: { primary: "#E67E22", secondary: "#fff" } },
        }}
      />
      <Routes>
        <Route path="/"                    element={<Home />} />
        <Route path="/verificar/:token"    element={<EmailVerify />} />
        <Route path="/admin/login"         element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/admin"               element={<Navigate to="/admin/login" replace />} />
        <Route path="*"                    element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
