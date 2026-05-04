import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import { AppError } from "../errors/AppError.js";
import { getProjectRoot } from "../utils/paths.js";

const uploadDir = path.resolve(getProjectRoot(), "uploads", "produtos");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => callback(null, uploadDir),
  filename: (_request, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  }
});

// Upload local simples: o banco guarda apenas a URL, nunca o binario da imagem.
export const uploadProdutoImagem = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (_request, file, callback) => {
    if (["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) return callback(null, true);
    callback(new AppError("Imagem invalida. Envie JPG, PNG ou WEBP com ate 3MB.", 400));
  }
});
