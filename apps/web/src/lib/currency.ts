export function toCurrency(value: number | string | null | undefined) {
  const numeric = Number(value ?? 0);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(numeric);
}
