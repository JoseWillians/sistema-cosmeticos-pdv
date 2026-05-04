import { api } from "../../../lib/api";

export interface CatalogoProduto {
  id: number;
  codigo: string;
  nome: string;
  slug: string;
  descricao_curta: string | null;
  descricao: string | null;
  observacoes: string | null;
  imagem_principal_url: string | null;
  marca: string;
  categoria: string;
  preco_venda: number;
  preco_venda_promocional: number | null;
  promocao_ativa: boolean;
  destaque: boolean;
  mais_vendido: boolean;
  novo: boolean;
  estoque_disponivel: number;
  status_estoque: string;
}

export interface CatalogoHome {
  destaques: CatalogoProduto[];
  maisVendidos: CatalogoProduto[];
  promocoes: CatalogoProduto[];
  categorias: Array<{ id: number; nome: string; quantidade: number }>;
  marcas: Array<{ id: number; nome: string; quantidade: number }>;
}

export async function getCatalogoHome() {
  const { data } = await api.get<CatalogoHome>("/catalogo/home");
  return data;
}

export async function getCatalogoProduto(slug: string) {
  const { data } = await api.get<CatalogoProduto>(`/catalogo/produtos/${slug}`);
  return data;
}

export function getCatalogImageUrl(path?: string | null) {
  return path ? `${api.defaults.baseURL}${path}` : "";
}
