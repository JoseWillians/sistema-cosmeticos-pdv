import { z } from "zod";

export const categoriaSchema = z.object({
  nome: z.string().min(2, "Informe o nome da categoria."),
  ativo: z.boolean().optional().default(true)
});

export type CategoriaInput = z.infer<typeof categoriaSchema>;
