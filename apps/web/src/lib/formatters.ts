export function formatNumber(value: number | string | null | undefined) {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 3 }).format(Number(value ?? 0));
}
