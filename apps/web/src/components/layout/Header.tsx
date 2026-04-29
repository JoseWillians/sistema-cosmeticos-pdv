import { Menu, Search } from "lucide-react";
import { Button } from "../ui/Button";

export function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  return (
    <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-white/10 bg-navy/70 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex w-full max-w-lg items-center gap-3">
        <Button variant="ghost" className="h-10 px-3" onClick={onToggleSidebar} iconLeft={<Menu className="h-4 w-4" />} aria-label="Alternar sidebar" />
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            className="h-11 w-full rounded-lg border border-white/10 bg-slate-950/45 pl-10 pr-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-violetGlow/70"
            placeholder="Buscar no sistema"
          />
        </div>
      </div>
      <div className="ml-4 flex items-center gap-3">
        <div className="text-right">
          <div className="text-xs text-slate-400">JW PDV</div>
          <div className="text-sm font-semibold text-white">Administrador</div>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-violetGlow to-cyanGlow text-sm font-bold text-white">
          AD
        </div>
      </div>
    </header>
  );
}
