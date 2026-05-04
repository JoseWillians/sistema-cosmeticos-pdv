import { pool } from "../../database/connection.js";

export interface CatalogoProduto {
  id: number;
  marca_id: number;
  categoria_id: number;
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

const catalogoSelect = `
  SELECT p.id, p.marca_id, p.categoria_id, p.codigo, p.nome, p.slug, p.descricao_curta,
    p.descricao, p.observacoes, p.imagem_principal_url,
    p.preco_venda, p.preco_venda_promocional, p.promocao_ativa,
    p.destaque, p.mais_vendido, p.novo,
    m.nome AS marca, c.nome AS categoria,
    COALESCE(v.estoque_disponivel, 0) AS estoque_disponivel,
    COALESCE(v.status_estoque, 'SEM_CONTROLE') AS status_estoque
  FROM produtos p
  INNER JOIN marcas m ON m.id = p.marca_id
  INNER JOIN categorias c ON c.id = p.categoria_id
  LEFT JOIN vw_estoque_produtos v ON v.produto_id = p.id
  WHERE p.excluido_em IS NULL
    AND p.ativo = TRUE
    AND p.visivel_no_catalogo = TRUE
`;

export async function listCatalogoProdutos(filters: {
  busca?: string;
  marca_id?: number;
  categoria_id?: number;
  promocao?: boolean;
  destaque?: boolean;
  page?: number;
  limit?: number;
}) {
  const where: string[] = [];
  const params: Array<string | number | boolean> = [];

  if (filters.busca) {
    params.push(`%${filters.busca}%`);
    const index = params.length;
    where.push(`(p.nome ILIKE $${index} OR p.codigo ILIKE $${index} OR m.nome ILIKE $${index} OR c.nome ILIKE $${index})`);
  }
  if (filters.marca_id) {
    params.push(filters.marca_id);
    where.push(`p.marca_id = $${params.length}`);
  }
  if (filters.categoria_id) {
    params.push(filters.categoria_id);
    where.push(`p.categoria_id = $${params.length}`);
  }
  if (filters.promocao) where.push("p.promocao_ativa = TRUE");
  if (filters.destaque) where.push("p.destaque = TRUE");

  const limit = Math.min(Math.max(filters.limit ?? 24, 1), 60);
  const page = Math.max(filters.page ?? 1, 1);
  const offset = (page - 1) * limit;
  params.push(limit, offset);
  const sql = `${catalogoSelect} ${where.length ? `AND ${where.join(" AND ")}` : ""} ORDER BY COALESCE(p.ordem_exibicao, 999999), p.destaque DESC, p.novo DESC, p.nome LIMIT $${params.length - 1} OFFSET $${params.length}`;
  const { rows } = await pool.query<CatalogoProduto>(sql, params);
  return rows;
}

export async function findCatalogoProdutoBySlug(slug: string) {
  const { rows } = await pool.query<CatalogoProduto>(`${catalogoSelect} AND p.slug = $1`, [slug]);
  return rows[0] ?? null;
}

export async function listCatalogoCategorias() {
  const { rows } = await pool.query<{ id: number; nome: string; quantidade: number }>(`
    SELECT c.id, c.nome, COUNT(p.id)::int AS quantidade
    FROM categorias c
    INNER JOIN produtos p ON p.categoria_id = c.id
    WHERE c.excluido_em IS NULL AND p.excluido_em IS NULL AND p.ativo = TRUE AND p.visivel_no_catalogo = TRUE
    GROUP BY c.id, c.nome
    ORDER BY c.nome
  `);
  return rows;
}

export async function listCatalogoMarcas() {
  const { rows } = await pool.query<{ id: number; nome: string; quantidade: number }>(`
    SELECT m.id, m.nome, COUNT(p.id)::int AS quantidade
    FROM marcas m
    INNER JOIN produtos p ON p.marca_id = m.id
    WHERE m.excluido_em IS NULL AND p.excluido_em IS NULL AND p.ativo = TRUE AND p.visivel_no_catalogo = TRUE
    GROUP BY m.id, m.nome
    ORDER BY m.nome
  `);
  return rows;
}
