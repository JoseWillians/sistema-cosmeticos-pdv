import { z } from "zod";

export const estoqueSchema = z.object({
  produto_id: z.coerce.number().positive(),
  tipo: z.enum(["ENTRADA", "SAIDA", "AJUSTE_ENTRADA", "AJUSTE_SAIDA"]),
  quantidade: z.coerce.number().int().positive()
});
