import axios from "axios";

// Cliente HTTP unico do frontend. Centralizar a baseURL evita espalhar localhost nas telas.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3333",
  timeout: 10000
});

api.interceptors.request.use((config) => {
  // Token local e fake do MVP; o formato ja deixa espaco para autenticao real depois.
  const token = localStorage.getItem("pdv_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
