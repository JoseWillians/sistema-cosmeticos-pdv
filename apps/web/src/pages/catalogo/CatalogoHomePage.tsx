import { useEffect, useState } from "react";
import { CatalogoBenefits } from "../../features/catalogo/components/CatalogoBenefits";
import { CatalogoCategorias } from "../../features/catalogo/components/CatalogoCategorias";
import { CatalogoHero } from "../../features/catalogo/components/CatalogoHero";
import { CatalogoLayout } from "../../features/catalogo/components/CatalogoLayout";
import { CatalogoProductSection } from "../../features/catalogo/components/CatalogoProductSection";
import { getCatalogoHome, type CatalogoHome } from "../../features/catalogo/services/catalogoService";
import { cosmeticosTheme } from "../../features/catalogo/themes/cosmeticos/cosmeticosTheme";

export function CatalogoHomePage() {
  const [data, setData] = useState<CatalogoHome | null>(null);

  useEffect(() => { getCatalogoHome().then(setData); }, []);

  return (
    <CatalogoLayout>
      <CatalogoHero />
      <CatalogoCategorias categorias={data?.categorias ?? []} />
      <CatalogoProductSection id="catalogo" title={cosmeticosTheme.labels.featured} produtos={data?.destaques ?? []} />
      <CatalogoProductSection id="promocoes" title={cosmeticosTheme.labels.promotions} produtos={data?.promocoes ?? []} />
      <CatalogoProductSection title={cosmeticosTheme.labels.bestSellers} produtos={data?.maisVendidos ?? []} />
      <CatalogoBenefits />
    </CatalogoLayout>
  );
}
