import { z } from "zod";

export const categoriaSchema = z.object({ nome: z.string().min(2) });
