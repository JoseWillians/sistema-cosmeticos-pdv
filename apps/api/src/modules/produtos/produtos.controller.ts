import type { RequestHandler } from "express";
import { produtosService } from "./produtos.service.js";

export const listProdutosController: RequestHandler = async (request, response, next) => {
  try {
    const produtos = await produtosService.list({
      busca: request.query.busca as string | undefined,
      marca_id: request.query.marca_id ? Number(request.query.marca_id) : undefined,
      categoria_id: request.query.categoria_id ? Number(request.query.categoria_id) : undefined,
      status: request.query.status as "ativos" | "arquivados" | "todos" | undefined
    });
    response.json(produtos);
  } catch (error) {
    next(error);
  }
};

export const restoreProdutoController: RequestHandler = async (request, response, next) => {
  try {
    response.json(await produtosService.restore(Number(request.params.id)));
  } catch (error) {
    next(error);
  }
};

export const getProdutoController: RequestHandler = async (request, response, next) => {
  try {
    const produto = await produtosService.findById(Number(request.params.id));
    response.json(produto);
  } catch (error) {
    next(error);
  }
};

export const createProdutoController: RequestHandler = async (request, response, next) => {
  try {
    const produto = await produtosService.create(request.body);
    response.status(201).json(produto);
  } catch (error) {
    next(error);
  }
};

export const updateProdutoController: RequestHandler = async (request, response, next) => {
  try {
    const produto = await produtosService.update(Number(request.params.id), request.body);
    response.json(produto);
  } catch (error) {
    next(error);
  }
};

export const deleteProdutoController: RequestHandler = async (request, response, next) => {
  try {
    await produtosService.delete(Number(request.params.id));
    response.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const uploadProdutoImagemController: RequestHandler = async (request, response, next) => {
  try {
    if (!request.file) return response.status(400).json({ message: "Envie uma imagem do produto." });
    const imagemUrl = `/uploads/produtos/${request.file.filename}`;
    response.json(await produtosService.updateImagem(Number(request.params.id), imagemUrl));
  } catch (error) {
    next(error);
  }
};
