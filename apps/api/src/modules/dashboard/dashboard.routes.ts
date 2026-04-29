import { Router } from "express";
import { dashboardResumoController } from "./dashboard.controller.js";

export const dashboardRoutes = Router();

dashboardRoutes.get("/resumo", dashboardResumoController);
