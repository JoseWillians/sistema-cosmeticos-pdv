import { z } from "zod";

const decimal = z.coerce.number().min(0);
export const unidadesProduto = ["UN", "KIT", "CX", "PC"] as const;
export type UnidadeProduto = (typeof unidadesProduto)[number];

// As unidades ficam fixas no codigo por enquanto para evitar uma tabela extra antes
// de haver regras de negocio mais complexas para conversao ou embalagem.
export const produtoCreateSchema = z.object({
  marca_id: z.coerce.number().int().positive(),
  categoria_id: z.coerce.number().int().positive(),
  codigo: z.string().min(1, "Informe o codigo do produto."),
  codigo_barras: z.string().optional().nullable(),
  imagem_principal_url: z.string().max(500).optional().nullable(),
  nome: z.string().min(2, "Informe o nome do produto."),
  slug: z.string().max(180).optional().nullable(),
  descricao_curta: z.string().max(255).optional().nullable(),
  visivel_no_catalogo: z.boolean().optional().default(true),
  destaque: z.boolean().optional().default(false),
  mais_vendido: z.boolean().optional().default(false),
  novo: z.boolean().optional().default(false),
  ordem_exibicao: z.coerce.number().int().optional().nullable(),
  unidade: z.enum(unidadesProduto).default("UN"),
  preco_custo: decimal,
  preco_venda: decimal,
  // Promocao nao duplica produto; ela registra uma condicao comercial especial no mesmo cadastro.
  preco_custo_promocional: decimal.optional().nullable(),
  preco_venda_promocional: decimal.optional().nullable(),
  promocao_ativa: z.boolean().optional().default(false),
  promocao_inicio: z.string().optional().nullable(),
  promocao_fim: z.string().optional().nullable(),
  promocao_observacao: z.string().optional().nullable(),
  // Estoque e contado em unidades inteiras no MVP para evitar saldos fracionados no PDV.
  estoque_minimo: z.coerce.number().int().min(0).optional().default(0),
  controlar_estoque: z.boolean().optional().default(true),
  estoque_inicial: z.coerce.number().int().min(0).optional().default(0),
  descricao: z.string().optional().nullable(),
  observacoes: z.string().optional().nullable(),
  ativo: z.boolean().optional().default(true)
});

// Edicao de produto nao altera estoque inicial; qualquer ajuste de saldo deve virar movimento.
export const produtoUpdateSchema = produtoCreateSchema.omit({ estoque_inicial: true }).partial();

export type ProdutoCreateInput = z.infer<typeof produtoCreateSchema>;
export type ProdutoUpdateInput = z.infer<typeof produtoUpdateSchema>;
