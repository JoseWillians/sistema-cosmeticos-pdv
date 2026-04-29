import { z } from "zod";

export const categoriaSchema = z.object({
  nome: z.string().min(2, "Informe o nome da categoria."),
  ativo: z.boolean().optional().default(true)
});

export const categoriaUpdateSchema = categoriaSchema.partial().refine((data) => data.nome !== undefined || data.ativo !== undefined, {
  message: "Informe ao menos um campo para atualizar."
});

export const categoriaStatusSchema = z.object({
  ativo: z.boolean()
});

export type CategoriaInput = z.infer<typeof categoriaSchema>;
export type CategoriaUpdateInput = z.infer<typeof categoriaUpdateSchema>;
