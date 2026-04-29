import { z } from "zod";

export const estoqueMovimentoSchema = z.object({
  produto_id: z.coerce.number().int().positive(),
  tipo: z.enum(["ENTRADA", "SAIDA", "AJUSTE_ENTRADA", "AJUSTE_SAIDA"]),
  // Movimentos fracionados ficam bloqueados para preservar a contagem simples do estoque.
  quantidade: z.coerce.number().int().positive(),
  observacao: z.string().optional().nullable()
});

export type EstoqueMovimentoInput = z.infer<typeof estoqueMovimentoSchema>;
