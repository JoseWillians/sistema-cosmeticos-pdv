import { z } from "zod";

export const marcaSchema = z.object({
  nome: z.string().min(2, "Informe o nome da marca."),
  ativo: z.boolean().optional().default(true)
});

export type MarcaInput = z.infer<typeof marcaSchema>;
