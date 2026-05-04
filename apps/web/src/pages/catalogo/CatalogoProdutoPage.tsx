import { ImageIcon, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toCurrency } from "../../lib/currency";
import { CatalogoLayout } from "../../features/catalogo/components/CatalogoLayout";
import { getCatalogImageUrl, getCatalogoProduto, type CatalogoProduto } from "../../features/catalogo/services/catalogoService";
import { cosmeticosTheme } from "../../features/catalogo/themes/cosmeticos/cosmeticosTheme";

export function CatalogoProdutoPage() {
  const { slug } = useParams();
  const [produto, setProduto] = useState<CatalogoProduto | null>(null);

  useEffect(() => {
    if (slug) getCatalogoProduto(slug).then(setProduto);
  }, [slug]);

  if (!produto) return <CatalogoLayout><div className="mx-auto max-w-7xl px-4 py-16">Carregando produto...</div></CatalogoLayout>;

  const imageUrl = getCatalogImageUrl(produto.imagem_principal_url);
  const promo = produto.promocao_ativa && produto.preco_venda_promocional != null;
  const whatsappText = encodeURIComponent(`Olá! Tenho interesse no produto: ${produto.nome} - Código: ${produto.codigo}`);

  return (
    <CatalogoLayout>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-2">
        <div className="grid aspect-square place-items-center overflow-hidden rounded-[2rem] bg-[#eeebe4] shadow-sm">
          {imageUrl ? <img className="h-full w-full object-cover" src={imageUrl} alt={produto.nome} /> : <div className="text-center text-[#879087]"><ImageIcon className="mx-auto mb-2 h-10 w-10" />Sem imagem</div>}
        </div>
        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
          <Link className="text-sm font-semibold text-[#6f8f72]" to="/catalogo">Voltar ao catalogo</Link>
          <p className="mt-6 text-sm uppercase tracking-wide text-[#8b9389]">{produto.marca} • {produto.categoria}</p>
          <h1 className="mt-2 text-3xl font-bold md:text-5xl">{produto.nome}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            {promo && <span className="rounded-full bg-[#e8e1f2] px-3 py-1 text-xs font-bold text-[#665282]">Promocao</span>}
            {produto.novo && <span className="rounded-full bg-[#dfe8dc] px-3 py-1 text-xs font-bold text-[#536f57]">Novo</span>}
          </div>
          <div className="mt-6">
            {promo ? <><span className="mr-3 text-lg text-[#9aa198] line-through">{toCurrency(produto.preco_venda)}</span><strong className="text-3xl text-[#536f57]">{toCurrency(produto.preco_venda_promocional!)}</strong></> : <strong className="text-3xl">{toCurrency(produto.preco_venda)}</strong>}
          </div>
          <p className="mt-4 text-[#68756d]">{produto.descricao_curta || produto.descricao || "Produto selecionado para seu cuidado diario."}</p>
          {produto.descricao && <p className="mt-4 leading-7 text-[#4c5751]">{produto.descricao}</p>}
          <p className="mt-5 rounded-2xl bg-[#f7f5f0] px-4 py-3 text-sm">{produto.estoque_disponivel > 0 ? "Disponivel" : "Consultar disponibilidade"}</p>
          <a className="mt-6 inline-flex rounded-full bg-[#6f8f72] px-6 py-3 font-semibold text-white" href={`https://wa.me/${cosmeticosTheme.whatsappNumber}?text=${whatsappText}`} target="_blank">
            <MessageCircle className="mr-2 h-5 w-5" /> Pedir no WhatsApp
          </a>
        </div>
      </section>
    </CatalogoLayout>
  );
}
