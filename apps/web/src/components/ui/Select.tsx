import type { SelectHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export function Select({ label, className, children, ...props }: SelectProps) {
  return (
    <label className="grid gap-2 text-sm text-slate-300">
      {label && <span>{label}</span>}
      <select
        className={cn(
          "h-11 rounded-lg border border-white/10 bg-slate-950/70 px-3 text-slate-100 outline-none transition focus:border-cyanGlow/70 focus:ring-2 focus:ring-cyanGlow/20",
          className
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
