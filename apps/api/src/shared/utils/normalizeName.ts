export function normalizeName(value: string) {
  // Comparacoes de duplicidade ignoram caixa e excesso de espacos para evitar cadastros quase iguais.
  return value.trim().replace(/\s+/g, " ");
}
