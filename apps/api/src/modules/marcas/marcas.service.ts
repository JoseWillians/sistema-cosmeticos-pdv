import { createMarca, listMarcas } from "./marcas.repository.js";
import type { MarcaInput } from "./marcas.schema.js";

export const marcasService = {
  list: listMarcas,
  create(data: MarcaInput) {
    return createMarca(data);
  }
};
