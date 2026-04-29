import { useEffect, useState } from "react";

export function useSidebarState() {
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar_collapsed");
    if (saved) return saved === "true";
    return window.innerWidth < 1280;
  });

  useEffect(() => {
    // Preferencia visual local: o usuario nao precisa recolher a sidebar a cada recarregamento.
    localStorage.setItem("sidebar_collapsed", String(collapsed));
  }, [collapsed]);

  return { collapsed, setCollapsed };
}
