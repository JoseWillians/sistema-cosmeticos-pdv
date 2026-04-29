import { BarChart3, Boxes, ChevronLeft, ChevronRight, Home, Package, ScanBarcode, Tags } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

const items = [
  { label: "Inicio", to: "/", icon: Home },
  { label: "Produtos", to: "/produtos", icon: Package },
  { label: "Marcas", to: "/marcas", icon: Tags },
  { label: "Categorias", to: "/categorias", icon: BarChart3 },
  { label: "Estoque", to: "/estoque", icon: Boxes },
  { label: "PDV futuro", to: "#", icon: ScanBarcode, disabled: true }
];

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <aside className={cn("fixed inset-y-0 left-0 hidden border-r border-white/10 bg-slate-950/65 p-4 backdrop-blur-xl transition-all lg:block", collapsed ? "w-20" : "w-64")}>
      <div className={cn("mb-8 flex items-center gap-3", collapsed && "flex-col justify-center")}>
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br from-magenta via-violetGlow to-cyanGlow font-black text-white">
          JW
        </div>
        {!collapsed && <div>
          <strong className="block text-base text-white">JW PDV</strong>
          <span className="text-xs text-slate-400">Gestao de Cosmeticos</span>
        </div>}
        <Button type="button" variant="ghost" className={cn("h-9 px-2", !collapsed && "ml-auto")} onClick={onToggle} iconLeft={collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />} aria-label="Recolher sidebar" />
      </div>
      <nav className="grid gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          if (item.disabled) {
            return (
              <span key={item.label} title={item.label} className={cn("flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-500", collapsed && "justify-center px-2")}>
                <Icon className="h-4 w-4" />
                {!collapsed && item.label}
              </span>
            );
          }
          return (
            <NavLink
              key={item.to}
              to={item.to}
              title={item.label}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white",
                  collapsed && "justify-center px-2",
                  isActive && "bg-white/12 text-white ring-1 ring-white/10"
                )
              }
            >
              <Icon className="h-4 w-4" />
              {!collapsed && item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
