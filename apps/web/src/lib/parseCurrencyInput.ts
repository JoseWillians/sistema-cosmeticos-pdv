export function parseCurrencyInput(value: string | number | null | undefined): number {
  if (typeof value === "number") return value;

  const raw = String(value ?? "").trim();
  if (!raw) return 0;

  // O usuario brasileiro costuma digitar virgula decimal; normalizar aqui evita 400 no Zod da API.
  const normalized = raw.includes(",")
    ? raw.replace(/\./g, "").replace(",", ".")
    : raw;

  const parsed = Number(normalized.replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(parsed)) {
    throw new Error("Valor monetario invalido.");
  }

  return parsed;
}
