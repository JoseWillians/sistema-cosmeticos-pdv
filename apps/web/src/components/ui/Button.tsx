import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "danger" | "ghost";
  loading?: boolean;
  icon?: ReactNode;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

const variants = {
  primary: "bg-gradient-to-r from-magenta via-violetGlow to-indigo-500 text-white shadow-lg shadow-pink-950/30 hover:-translate-y-0.5 hover:shadow-pink-500/25",
  secondary: "bg-white/10 text-slate-100 ring-1 ring-white/15 hover:-translate-y-0.5 hover:bg-white/15 hover:ring-cyanGlow/40",
  success: "bg-gradient-to-r from-emerald-400 to-cyanGlow text-slate-950 shadow-lg shadow-emerald-950/25 hover:-translate-y-0.5 hover:shadow-emerald-400/20",
  danger: "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-950/25 hover:-translate-y-0.5 hover:shadow-rose-400/20",
  ghost: "text-slate-300 hover:bg-white/10 hover:text-white"
};

export function Button({ className, variant = "primary", loading = false, icon, iconLeft, iconRight, children, disabled, ...props }: ButtonProps) {
  // Inspirado em botoes de galeria CSS como Uiverse, mas adaptado ao tema dark e ao componente unico do app.
  return (
    <button
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyanGlow/70 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (iconLeft ?? icon)}
      {children}
      {iconRight}
    </button>
  );
}
