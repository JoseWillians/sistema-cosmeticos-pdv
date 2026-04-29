import swaggerJsdoc from "swagger-jsdoc";

// Swagger fica restrito ao modo de ferramentas locais para documentar a API sem afetar producao.
export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "JW PDV API",
      version: "0.1.0",
      description: "Documentacao inicial da API local de gestao de cosmeticos."
    },
    servers: [{ url: "http://localhost:3333" }],
    components: {
      schemas: {
        LoginRequest: { type: "object", properties: { login: { type: "string" }, senha: { type: "string" } }, required: ["login", "senha"] },
        Marca: { type: "object", properties: { id: { type: "integer" }, nome: { type: "string" }, ativo: { type: "boolean" } } },
        Categoria: { type: "object", properties: { id: { type: "integer" }, nome: { type: "string" }, ativo: { type: "boolean" } } },
        Produto: { type: "object", properties: { id: { type: "integer" }, codigo: { type: "string" }, nome: { type: "string" }, unidade: { type: "string", enum: ["UN", "KIT", "CX", "PC"] }, preco_custo: { type: "number" }, preco_venda: { type: "number" }, estoque_minimo: { type: "integer" } } },
        ProdutoCreate: { type: "object", properties: { marca_id: { type: "integer" }, categoria_id: { type: "integer" }, codigo: { type: "string" }, nome: { type: "string" }, unidade: { type: "string", enum: ["UN", "KIT", "CX", "PC"] }, preco_custo: { type: "number" }, preco_venda: { type: "number" }, estoque_inicial: { type: "integer" }, estoque_minimo: { type: "integer" } }, required: ["marca_id", "categoria_id", "codigo", "nome", "unidade", "preco_custo", "preco_venda", "estoque_inicial"] },
        ProdutoUpdate: { type: "object", properties: { nome: { type: "string" }, unidade: { type: "string", enum: ["UN", "KIT", "CX", "PC"] }, preco_custo: { type: "number" }, preco_venda: { type: "number" }, estoque_minimo: { type: "integer" } } },
        EstoqueProduto: { type: "object", properties: { produto_id: { type: "integer" }, codigo: { type: "string" }, produto: { type: "string" }, estoque_disponivel: { type: "number" }, status_estoque: { type: "string", enum: ["SEM_CONTROLE", "ESGOTADO", "BAIXO", "OK"] } } },
        EstoqueMovimentoCreate: { type: "object", properties: { produto_id: { type: "integer" }, tipo: { type: "string", enum: ["ENTRADA", "SAIDA", "AJUSTE_ENTRADA", "AJUSTE_SAIDA"] }, quantidade: { type: "integer", minimum: 1 }, observacao: { type: "string" } }, required: ["produto_id", "tipo", "quantidade"] }
      }
    },
    paths: {
      "/health": { get: { summary: "Status simples da API", responses: { "200": { description: "API online" } } } },
      "/auth/login": { post: { summary: "Login local", requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/LoginRequest" } } } }, responses: { "200": { description: "Token local" }, "401": { description: "Credenciais invalidas" } } } },
      "/marcas": { get: { summary: "Lista marcas", responses: { "200": { description: "Lista de marcas" } } }, post: { summary: "Cria marca", responses: { "201": { description: "Marca criada" } } } },
      "/marcas/{id}": { put: { summary: "Edita marca", responses: { "200": { description: "Marca editada" } } }, delete: { summary: "Arquiva marca", responses: { "204": { description: "Marca arquivada" }, "409": { description: "Marca vinculada a produtos" } } } },
      "/marcas/{id}/status": { patch: { summary: "Desativa ou reativa marca", responses: { "200": { description: "Status atualizado" } } } },
      "/categorias": { get: { summary: "Lista categorias", responses: { "200": { description: "Lista de categorias" } } }, post: { summary: "Cria categoria", responses: { "201": { description: "Categoria criada" } } } },
      "/categorias/{id}": { put: { summary: "Edita categoria", responses: { "200": { description: "Categoria editada" } } }, delete: { summary: "Arquiva categoria", responses: { "204": { description: "Categoria arquivada" }, "409": { description: "Categoria vinculada a produtos" } } } },
      "/categorias/{id}/status": { patch: { summary: "Desativa ou reativa categoria", responses: { "200": { description: "Status atualizado" } } } },
      "/produtos": { get: { summary: "Lista produtos", responses: { "200": { description: "Lista de produtos" } } }, post: { summary: "Cria produto", requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/ProdutoCreate" } } } }, responses: { "201": { description: "Produto criado" } } } },
      "/produtos/{id}": { get: { summary: "Busca produto", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { "200": { description: "Produto" } } }, put: { summary: "Edita produto", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/ProdutoUpdate" } } } }, responses: { "200": { description: "Produto editado" } } }, delete: { summary: "Inativa produto", responses: { "204": { description: "Produto inativado" } } } },
      "/estoque": { get: { summary: "Lista estoque", responses: { "200": { description: "Estoque calculado" } } } },
      "/estoque/movimentos": { post: { summary: "Registra movimento de estoque", requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/EstoqueMovimentoCreate" } } } }, responses: { "201": { description: "Movimento criado" }, "400": { description: "Dados invalidos" } } } }
    }
  },
  apis: []
});
