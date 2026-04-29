import { Navigate, Outlet } from "react-router-dom";
import { Header } from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { useSidebarState } from "../hooks/useSidebarState";

export function DashboardLayout() {
  const { collapsed, setCollapsed } = useSidebarState();
  const token = localStorage.getItem("pdv_token");
  // Protecao simples para o MVP local: sem token, qualquer rota interna volta ao login.
  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen text-slate-100">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className={collapsed ? "lg:pl-20" : "lg:pl-64"}>
        <Header onToggleSidebar={() => setCollapsed(!collapsed)} />
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
