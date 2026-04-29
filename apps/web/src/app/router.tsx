import { createBrowserRouter } from "react-router-dom";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { EstoquePage } from "../pages/estoque/EstoquePage";
import { LoginPage } from "../pages/login/LoginPage";
import { MarcasPage } from "../pages/marcas/MarcasPage";
import { CategoriasPage } from "../pages/categorias/CategoriasPage";
import { ProdutoFormPage } from "../pages/produtos/ProdutoFormPage";
import { ProdutosPage } from "../pages/produtos/ProdutosPage";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "produtos", element: <ProdutosPage /> },
      { path: "produtos/novo", element: <ProdutoFormPage /> },
      { path: "produtos/:id/editar", element: <ProdutoFormPage /> },
      { path: "marcas", element: <MarcasPage /> },
      { path: "categorias", element: <CategoriasPage /> },
      { path: "estoque", element: <EstoquePage /> }
    ]
  }
]);
