import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  // Card base usado nas telas de cadastro e resumo para preservar o glassmorphism do tema.
  return (
    <div
      className={cn(
        "rounded-lg border border-white/10 bg-white/[0.07] p-5 shadow-glow backdrop-blur-xl",
        className
      )}
      {...props}
    />
  );
}
