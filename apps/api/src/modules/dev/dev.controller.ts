import type { RequestHandler } from "express";
import { devService } from "./dev.service.js";
import { renderDevLayout, renderJson, renderTablePreview } from "./devView.js";

const routeDocs = [
  { method: "GET", path: "/health", description: "Status simples da API.", status: "200", link: true },
  { method: "POST", path: "/auth/login", description: "Login local admin/admin.", status: "200 ou 401", body: { login: "admin", senha: "admin" } },
  { method: "GET", path: "/marcas", description: "Lista marcas.", status: "200", link: true },
  { method: "POST", path: "/marcas", description: "Cria, reativa ou restaura marca pelo nome.", status: "201 ou 409", body: { nome: "Natura" } },
  { method: "PUT", path: "/marcas/:id", description: "Edita marca.", status: "200", body: { nome: "Nova marca" } },
  { method: "PATCH", path: "/marcas/:id/status", description: "Desativa ou reativa marca.", status: "200", body: { ativo: false } },
  { method: "PATCH", path: "/marcas/:id/restore", description: "Restaura marca arquivada.", status: "200 ou 404" },
  { method: "DELETE", path: "/marcas/:id", description: "Arquiva marca sem apagar fisicamente.", status: "204 ou 409" },
  { method: "GET", path: "/categorias", description: "Lista categorias.", status: "200", link: true },
  { method: "POST", path: "/categorias", description: "Cria, reativa ou restaura categoria pelo nome.", status: "201 ou 409", body: { nome: "Cabelo" } },
  { method: "PUT", path: "/categorias/:id", description: "Edita categoria.", status: "200", body: { nome: "Nova categoria" } },
  { method: "PATCH", path: "/categorias/:id/status", description: "Desativa ou reativa categoria.", status: "200", body: { ativo: false } },
  { method: "PATCH", path: "/categorias/:id/restore", description: "Restaura categoria arquivada.", status: "200 ou 404" },
  { method: "DELETE", path: "/categorias/:id", description: "Arquiva categoria sem apagar fisicamente.", status: "204 ou 409" },
  { method: "GET", path: "/produtos", description: "Lista produtos com filtros opcionais.", status: "200", link: true },
  { method: "GET", path: "/produtos/:id", description: "Busca produto por id.", status: "200 ou 404" },
  { method: "POST", path: "/produtos", description: "Cria produto ou restaura produto arquivado com mesmo codigo.", status: "201 ou 409", body: { codigo: "ABC-001", nome: "Produto", marca_id: 1, categoria_id: 1, unidade: "UN", preco_custo: 10, preco_venda: 20, preco_venda_promocional: 18, promocao_ativa: true, estoque_inicial: 5 } },
  { method: "PUT", path: "/produtos/:id", description: "Edita dados comerciais do produto.", status: "200 ou 404", body: { nome: "Produto editado", preco_venda: 80.99, unidade: "KIT", estoque_minimo: 6 } },
  { method: "DELETE", path: "/produtos/:id", description: "Arquiva produto com soft delete; nao apaga estoque_movimentos.", status: "204 ou 404" },
  { method: "PATCH", path: "/produtos/:id/restore", description: "Restaura produto arquivado.", status: "200 ou 404" },
  { method: "GET", path: "/estoque", description: "Lista estoque calculado pela view.", status: "200", link: true },
  { method: "POST", path: "/estoque/movimentos", description: "Registra reposicao, saida ou ajuste de estoque para produto ativo.", status: "201, 400, 404 ou 409", body: { produto_id: 1, tipo: "ENTRADA", quantidade: 10, custo_unitario: 7.5, compra_promocional: true, observacao: "Compra de reposicao" } },
  { method: "GET", path: "/dashboard/resumo", description: "Retorna KPIs, graficos e estoque critico do dashboard.", status: "200", link: true }
];

export const devHomeController: RequestHandler = async (_request, response, next) => {
  try {
    const databaseStatus = await devService.databaseStatus();
    response.type("html").send(renderDevLayout("Painel Dev", `
      <section class="hero">
        <span class="pill">API online</span>
        <h1>Painel de desenvolvimento JW PDV</h1>
        <p>Ferramentas locais de leitura para diagnosticar API, banco e rotas sem expor credenciais.</p>
      </section>
      <div class="grid">
        <a class="card" href="/dev/database"><h2>Banco</h2><p>Status: ${databaseStatus}. Ver tabelas e prévias.</p></a>
        <a class="card" href="/dev/routes"><h2>Rotas</h2><p>Mapa simples dos endpoints principais.</p></a>
        <a class="card" href="/api-docs"><h2>Swagger</h2><p>Documentação OpenAPI inicial.</p></a>
      </div>
    `));
  } catch (error) {
    next(error);
  }
};

export const devDatabaseController: RequestHandler = async (_request, response, next) => {
  try {
    // Painel somente leitura: consulta metadados e LIMIT 50 para evitar telas pesadas.
    const previews = await devService.getTablePreviews();
    response.type("html").send(renderDevLayout("Banco", `
      <section class="hero"><h1>Banco de dados</h1><p>Prévia visual das tabelas e views do MySQL.</p></section>
      ${previews.map(renderTablePreview).join("")}
    `));
  } catch (error) {
    next(error);
  }
};

export const devRoutesController: RequestHandler = (_request, response) => {
  const rows = routeDocs.map((route) => `<tr>
    <td class="method">${route.method}</td>
    <td>${route.link ? `<a href="${route.path}">${route.path}</a>` : route.path}</td>
    <td>${route.description}</td>
    <td>${route.status}</td>
    <td><pre>${route.body ? renderJson(route.body) : ""}</pre></td>
  </tr>`).join("");

  response.type("html").send(renderDevLayout("Rotas", `
    <section class="hero"><h1>Rotas principais</h1><p>Documentação visual leve para desenvolvimento local.</p></section>
    <section class="card"><table><thead><tr><th>Método</th><th>Caminho</th><th>Descrição</th><th>Status</th><th>Body</th></tr></thead><tbody>${rows}</tbody></table></section>
  `));
};
