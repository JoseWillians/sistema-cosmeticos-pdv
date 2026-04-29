import type { HTMLAttributes, TableHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export function Table({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return <table className={cn("w-full border-separate border-spacing-0 text-left text-sm", className)} {...props} />;
}

export function TableWrap({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("overflow-hidden rounded-lg border border-white/10", className)} {...props} />;
}
