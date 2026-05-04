import { cosmeticosTheme } from "../themes/cosmeticos/cosmeticosTheme";

export function CatalogoHero() {
  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
      <div>
        <span className="rounded-full bg-[#dfe8dc] px-4 py-2 text-sm font-semibold text-[#536f57]">Cosmeticos selecionados</span>
        <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-tight md:text-6xl">{cosmeticosTheme.hero.title}</h1>
        <p className="mt-4 max-w-xl text-lg text-[#67736b]">{cosmeticosTheme.hero.subtitle}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a className="rounded-full bg-[#6f8f72] px-6 py-3 font-semibold text-white" href="#promocoes">{cosmeticosTheme.hero.primaryAction}</a>
          <a className="rounded-full border border-[#cfd8ce] bg-white px-6 py-3 font-semibold" href="#catalogo">{cosmeticosTheme.hero.secondaryAction}</a>
        </div>
      </div>
      <div className="rounded-[2rem] bg-gradient-to-br from-[#dfe8dc] via-white to-[#e8e1f2] p-6 shadow-xl shadow-slate-200/70">
        <div className="aspect-[4/3] rounded-[1.5rem] border border-white bg-white/70 p-6">
          <div className="h-full rounded-[1.25rem] bg-[radial-gradient(circle_at_20%_20%,#b7a6d8,transparent_28%),radial-gradient(circle_at_80%_30%,#dfe8dc,transparent_30%),linear-gradient(135deg,#fff,#f0ece5)]" />
        </div>
      </div>
    </section>
  );
}
