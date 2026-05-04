import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3333),
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.coerce.number().default(5433),
  DB_NAME: z.string().default("sistema_cosmeticos"),
  DB_USER: z.string().default("cosmeticos"),
  DB_PASSWORD: z.string().default("cosmeticos123"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  ENABLE_DEV_TOOLS: z.preprocess((value) => value === true || value === "true", z.boolean()).default(true)
});

export const env = envSchema.parse(process.env);
