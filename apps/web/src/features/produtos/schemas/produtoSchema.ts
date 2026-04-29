import { z } from "zod";
import { unidadesProduto } from "../../../types/produto";

export const produtoSchema = z.object({
  codigo: z.string().min(1),
  nome: z.string().min(2),
  marca_id: z.coerce.number().positive(),
  categoria_id: z.coerce.number().positive(),
  unidade: z.enum(unidadesProduto),
  preco_custo: z.coerce.number().min(0),
  preco_venda: z.coerce.number().min(0),
  estoque_inicial: z.coerce.number().int().min(0)
});
