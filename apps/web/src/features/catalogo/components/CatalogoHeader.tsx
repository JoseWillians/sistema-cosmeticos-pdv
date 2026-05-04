import { MessageCircle, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { cosmeticosTheme } from "../themes/cosmeticos/cosmeticosTheme";

export function CatalogoHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-[#f7f5f0]/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <Link to="/catalogo">
          <strong className="block text-xl">{cosmeticosTheme.name}</strong>
          <span className="text-sm text-[#6f7b70]">{cosmeticosTheme.subtitle}</span>
        </Link>
        <div className="flex items-center gap-3">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm md:w-80">
            <Search className="h-4 w-4 text-[#8b9389]" />
            <input className="w-full bg-transparent text-sm outline-none" placeholder="Buscar produto" />
          </label>
          <a className="hidden rounded-full bg-[#6f8f72] px-4 py-2 text-sm font-semibold text-white md:inline-flex" href={`https://wa.me/${cosmeticosTheme.whatsappNumber}`} target="_blank">
            <MessageCircle className="mr-2 h-4 w-4" /> Fale no WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
