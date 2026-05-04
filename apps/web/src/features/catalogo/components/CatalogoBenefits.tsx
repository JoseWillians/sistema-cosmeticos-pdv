import { CheckCircle2 } from "lucide-react";
import { cosmeticosBenefits } from "../themes/cosmeticos/cosmeticosSections";

export function CatalogoBenefits() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-4 rounded-3xl bg-[#2f3a35] p-6 text-white md:grid-cols-3">
        {cosmeticosBenefits.map((item) => <div key={item} className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-[#dfe8dc]" />{item}</div>)}
      </div>
    </section>
  );
}
