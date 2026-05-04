import { MessageCircle } from "lucide-react";
import { cosmeticosTheme } from "../themes/cosmeticos/cosmeticosTheme";

export function WhatsAppFloatingButton() {
  return (
    <a className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#6f8f72] text-white shadow-xl" href={`https://wa.me/${cosmeticosTheme.whatsappNumber}`} target="_blank" aria-label="WhatsApp">
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
