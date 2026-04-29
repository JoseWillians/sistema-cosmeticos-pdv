import { createCategoria, listCategorias } from "./categorias.repository.js";
import type { CategoriaInput } from "./categorias.schema.js";

export const categoriasService = {
  list: listCategorias,
  create(data: CategoriaInput) {
    return createCategoria(data);
  }
};
