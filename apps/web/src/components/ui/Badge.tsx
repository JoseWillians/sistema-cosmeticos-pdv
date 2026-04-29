import { cn } from "../../lib/utils";

const tone = {
  OK: "bg-emerald-400/15 text-emerald-200 ring-emerald-400/25",
  BAIXO: "bg-amber-400/15 text-amber-200 ring-amber-400/25",
  ESGOTADO: "bg-rose-400/15 text-rose-200 ring-rose-400/25",
  SEM_CONTROLE: "bg-sky-400/15 text-sky-200 ring-sky-400/25",
  DEFAULT: "bg-slate-400/15 text-slate-200 ring-slate-400/25"
};

export function Badge({ children, status }: { children: string; status?: keyof typeof tone }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1", tone[status ?? "DEFAULT"])}>
      {children}
    </span>
  );
}
