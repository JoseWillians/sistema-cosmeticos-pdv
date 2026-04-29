import { z } from "zod";

export const marcaSchema = z.object({
  nome: z.string().min(2, "Informe o nome da marca."),
  ativo: z.boolean().optional().default(true)
});

export const marcaUpdateSchema = marcaSchema.partial().refine((data) => data.nome !== undefined || data.ativo !== undefined, {
  message: "Informe ao menos um campo para atualizar."
});

export const marcaStatusSchema = z.object({
  ativo: z.boolean()
});

export type MarcaInput = z.infer<typeof marcaSchema>;
export type MarcaUpdateInput = z.infer<typeof marcaUpdateSchema>;
