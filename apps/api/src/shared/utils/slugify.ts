export function slugify(value: string) {
  // Slug publico precisa ser legivel e estavel, removendo acentos e caracteres especiais.
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
