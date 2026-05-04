import type { ReactNode } from "react";
import { CatalogoFooter } from "./CatalogoFooter";
import { CatalogoHeader } from "./CatalogoHeader";
import { WhatsAppFloatingButton } from "./WhatsAppFloatingButton";

export function CatalogoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#2f3a35]">
      <CatalogoHeader />
      <main>{children}</main>
      <CatalogoFooter />
      <WhatsAppFloatingButton />
    </div>
  );
}
