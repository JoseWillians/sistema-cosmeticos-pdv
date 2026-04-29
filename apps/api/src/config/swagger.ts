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
        Produto: { type: "object", properties: { id: { type: "integer" }, codigo: { type: "string" }, nome: { type: "string" }, unidade: { type: "string", enum: ["UN", "KIT", "CX", "PC"] }, preco_custo: { type: "number" }, preco_venda: { type: "number" }, preco_custo_promocional: { type: "number", nullable: true }, preco_venda_promocional: { type: "number", nullable: true }, promocao_ativa: { type: "boolean" }, estoque_minimo: { type: "integer" } } },
        ProdutoCreate: { type: "object", properties: { marca_id: { type: "integer" }, categoria_id: { type: "integer" }, codigo: { type: "string" }, nome: { type: "string" }, unidade: { type: "string", enum: ["UN", "KIT", "CX", "PC"] }, preco_custo: { type: "number" }, preco_venda: { type: "number" }, preco_custo_promocional: { type: "number", nullable: true }, preco_venda_promocional: { type: "number", nullable: true }, promocao_ativa: { type: "boolean" }, promocao_inicio: { type: "string", nullable: true }, promocao_fim: { type: "string", nullable: true }, promocao_observacao: { type: "string", nullable: true }, estoque_inicial: { type: "integer" }, estoque_minimo: { type: "integer" } }, required: ["marca_id", "categoria_id", "codigo", "nome", "unidade", "preco_custo", "preco_venda", "estoque_inicial"] },
        ProdutoUpdate: { type: "object", properties: { nome: { type: "string" }, unidade: { type: "string", enum: ["UN", "KIT", "CX", "PC"] }, preco_custo: { type: "number" }, preco_venda: { type: "number" }, estoque_minimo: { type: "integer" } } },
        EstoqueProduto: { type: "object", properties: { produto_id: { type: "integer" }, codigo: { type: "string" }, produto: { type: "string" }, estoque_disponivel: { type: "number" }, status_estoque: { type: "string", enum: ["SEM_CONTROLE", "ESGOTADO", "BAIXO", "OK"] } } },
        EstoqueMovimentoCreate: { type: "object", properties: { produto_id: { type: "integer" }, tipo: { type: "string", enum: ["ENTRADA", "SAIDA", "AJUSTE_ENTRADA", "AJUSTE_SAIDA"] }, quantidade: { type: "integer", minimum: 1 }, custo_unitario: { type: "number", nullable: true }, compra_promocional: { type: "boolean" }, observacao: { type: "string" } }, required: ["produto_id", "tipo", "quantidade"] },
        LinkedProductsError: { type: "object", properties: { message: { type: "string" }, type: { type: "string", example: "BRAND_IN_USE" }, products: { type: "array", items: { type: "object", properties: { id: { type: "integer" }, codigo: { type: "string" }, nome: { type: "string" } } } }, moreCount: { type: "integer" } } }
      }
    },
    paths: {
      "/health": { get: { summary: "Status simples da API", responses: { "200": { description: "API online" } } } },
      "/auth/login": { post: { summary: "Login local", requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/LoginRequest" } } } }, responses: { "200": { description: "Token local" }, "401": { description: "Credenciais invalidas" } } } },
      "/marcas": { get: { summary: "Lista marcas", responses: { "200": { description: "Lista de marcas" } } }, post: { summary: "Cria marca", responses: { "201": { description: "Marca criada" } } } },
      "/marcas/{id}": { put: { summary: "Edita marca", responses: { "200": { description: "Marca editada" } } }, delete: { summary: "Arquiva marca", responses: { "204": { description: "Marca arquivada" }, "409": { description: "Marca vinculada a produtos ativos", content: { "application/json": { schema: { $ref: "#/components/schemas/LinkedProductsError" } } } } } } },
      "/marcas/{id}/status": { patch: { summary: "Desativa ou reativa marca", responses: { "200": { description: "Status atualizado" } } } },
      "/marcas/{id}/restore": { patch: { summary: "Restaura marca arquivada", responses: { "200": { description: "Marca restaurada" } } } },
      "/categorias": { get: { summary: "Lista categorias", responses: { "200": { description: "Lista de categorias" } } }, post: { summary: "Cria categoria", responses: { "201": { description: "Categoria criada" } } } },
      "/categorias/{id}": { put: { summary: "Edita categoria", responses: { "200": { description: "Categoria editada" } } }, delete: { summary: "Arquiva categoria", responses: { "204": { description: "Categoria arquivada" }, "409": { description: "Categoria vinculada a produtos ativos", content: { "application/json": { schema: { $ref: "#/components/schemas/LinkedProductsError" } } } } } } },
      "/categorias/{id}/status": { patch: { summary: "Desativa ou reativa categoria", responses: { "200": { description: "Status atualizado" } } } },
      "/categorias/{id}/restore": { patch: { summary: "Restaura categoria arquivada", responses: { "200": { description: "Categoria restaurada" } } } },
      "/produtos": { get: { summary: "Lista produtos", responses: { "200": { description: "Lista de produtos" } } }, post: { summary: "Cria produto", requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/ProdutoCreate" } } } }, responses: { "201": { description: "Produto criado" } } } },
      "/produtos/{id}": { get: { summary: "Busca produto", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { "200": { description: "Produto" } } }, put: { summary: "Edita produto", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/ProdutoUpdate" } } } }, responses: { "200": { description: "Produto editado" } } }, delete: { summary: "Arquiva produto com soft delete", responses: { "204": { description: "Produto arquivado" } } } },
      "/produtos/{id}/restore": { patch: { summary: "Restaura produto arquivado", responses: { "200": { description: "Produto restaurado" } } } },
      "/estoque": { get: { summary: "Lista estoque", responses: { "200": { description: "Estoque calculado" } } } },
      "/estoque/movimentos": { post: { summary: "Registra movimento de estoque", requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/EstoqueMovimentoCreate" } } } }, responses: { "201": { description: "Movimento criado" }, "400": { description: "Dados invalidos" }, "409": { description: "Produto arquivado nao aceita nova movimentacao" } } } },
      "/dashboard/resumo": { get: { summary: "Resumo agregado do dashboard", responses: { "200": { description: "KPIs e graficos de produtos e estoque" } } } }
    }
  },
  apis: []
});
