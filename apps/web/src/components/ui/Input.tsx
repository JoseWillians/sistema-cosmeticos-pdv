import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className, ...props }: InputProps) {
  return (
    <label className="grid gap-2 text-sm text-slate-300">
      {label && <span>{label}</span>}
      <input
        className={cn(
          "h-11 rounded-lg border border-white/10 bg-slate-950/50 px-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyanGlow/70 focus:ring-2 focus:ring-cyanGlow/20",
          className
        )}
        {...props}
      />
    </label>
  );
}
