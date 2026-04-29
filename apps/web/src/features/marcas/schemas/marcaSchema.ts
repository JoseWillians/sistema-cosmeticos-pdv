import { z } from "zod";

export const marcaSchema = z.object({ nome: z.string().min(2) });
