import { AppError } from "../../shared/errors/AppError.js";
import { slugify } from "../../shared/utils/slugify.js";
import { createProduto, deleteProduto, findProdutoByCodigoIncludingArchived, findProdutoById, findProdutoBySlugIncludingArchived, listProdutosByStatus, restoreProduto, restoreProdutoFromCreate, updateProduto, updateProdutoImagem } from "./produtos.repository.js";
import type { ProdutoCreateInput, ProdutoUpdateInput } from "./produtos.schema.js";

async function makeUniqueSlug(baseText: string, codigo: string, ignoreId?: number) {
  const base = slugify(baseText) || slugify(codigo);
  const candidates = [base, `${base}-${slugify(codigo)}`].filter(Boolean);
  for (const candidate of candidates) {
    const found = await findProdutoBySlugIncludingArchived(candidate, ignoreId);
    if (!found) return candidate;
  }
  return `${base}-${Date.now()}`;
}

export const produtosService = {
  list: listProdutosByStatus,
  async findById(id: number) {
    const produto = await findProdutoById(id);
    if (!produto) throw new AppError("Produto nao encontrado.", 404);
    return produto;
  },
  async create(data: ProdutoCreateInput) {
    const payload = {
      ...data,
      slug: data.slug ? slugify(data.slug) : await makeUniqueSlug(data.nome, data.codigo)
    };
    const existing = await findProdutoByCodigoIncludingArchived(data.codigo);
    if (existing?.excluido_em) {
      payload.slug = data.slug ? slugify(data.slug) : await makeUniqueSlug(data.nome, data.codigo, existing.id);
      const produto = await restoreProdutoFromCreate(existing.id, payload);
      return { ...produto, created: false, restored: true };
    }
    if (existing) throw new AppError("Já existe um produto ativo com este código.", 409);
    return { ...(await createProduto(payload)), created: true, restored: false };
  },
  async update(id: number, data: ProdutoUpdateInput) {
    // A regra de edicao fica aqui: se o produto nao existir, a API responde 404 em vez de falhar silenciosamente.
    const current = await findProdutoById(id);
    if (!current) throw new AppError("Produto nao encontrado.", 404);
    const payload = {
      ...data,
      slug: data.slug ? slugify(data.slug) : data.nome ? await makeUniqueSlug(data.nome, data.codigo ?? current.codigo, id) : undefined
    };
    const produto = await updateProduto(id, payload);
    if (!produto) throw new AppError("Produto nao encontrado.", 404);
    return produto;
  },
  async delete(id: number) {
    const deleted = await deleteProduto(id);
    if (!deleted) throw new AppError("Produto nao encontrado.", 404);
  },
  async restore(id: number) {
    const produto = await restoreProduto(id);
    if (!produto) throw new AppError("Produto nao encontrado.", 404);
    return { ...produto, restored: true };
  },
  async updateImagem(id: number, imagemUrl: string | null) {
    const produto = await updateProdutoImagem(id, imagemUrl);
    if (!produto) throw new AppError("Produto nao encontrado.", 404);
    return produto;
  }
};
