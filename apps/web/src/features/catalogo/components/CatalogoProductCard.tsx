import { ImageIcon, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { toCurrency } from "../../../lib/currency";
import { getCatalogImageUrl, type CatalogoProduto } from "../services/catalogoService";
import { cosmeticosTheme } from "../themes/cosmeticos/cosmeticosTheme";

export function CatalogoProductCard({ produto }: { produto: CatalogoProduto }) {
  const imageUrl = getCatalogImageUrl(produto.imagem_principal_url);
  const promo = produto.promocao_ativa && produto.preco_venda_promocional != null;
  const whatsappText = encodeURIComponent(`Olá! Tenho interesse no produto: ${produto.nome} - Código: ${produto.codigo}`);

  return (
    <article className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
      <div className="grid aspect-square place-items-center bg-[#eeebe4]">
        {imageUrl ? <img className="h-full w-full object-cover" src={imageUrl} alt={produto.nome} /> : <div className="text-center text-[#879087]"><ImageIcon className="mx-auto mb-2 h-8 w-8" />Sem imagem</div>}
      </div>
      <div className="p-4">
        <div className="mb-2 flex flex-wrap gap-2">
          {promo && <span className="rounded-full bg-[#e8e1f2] px-3 py-1 text-xs font-bold text-[#665282]">Promocao</span>}
          {produto.novo && <span className="rounded-full bg-[#dfe8dc] px-3 py-1 text-xs font-bold text-[#536f57]">Novo</span>}
          {produto.destaque && <span className="rounded-full bg-[#f1eadc] px-3 py-1 text-xs font-bold text-[#7d6842]">Destaque</span>}
        </div>
        <p className="text-xs uppercase tracking-wide text-[#8b9389]">{produto.marca} • {produto.categoria}</p>
        <h3 className="mt-1 min-h-12 font-bold">{produto.nome}</h3>
        <div className="mt-3">
          {promo ? <><span className="mr-2 text-sm text-[#9aa198] line-through">{toCurrency(produto.preco_venda)}</span><strong className="text-lg text-[#536f57]">{toCurrency(produto.preco_venda_promocional!)}</strong></> : <strong className="text-lg">{toCurrency(produto.preco_venda)}</strong>}
        </div>
        <div className="mt-4 flex gap-2">
          <Link className="flex-1 rounded-full border border-[#d7ddd4] px-4 py-2 text-center text-sm font-semibold" to={`/catalogo/produto/${produto.slug}`}>Ver detalhes</Link>
          <a className="rounded-full bg-[#6f8f72] px-3 py-2 text-white" href={`https://wa.me/${cosmeticosTheme.whatsappNumber}?text=${whatsappText}`} target="_blank" aria-label="Pedir"><MessageCircle className="h-4 w-4" /></a>
        </div>
      </div>
    </article>
  );
}
