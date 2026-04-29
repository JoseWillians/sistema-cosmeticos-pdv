export interface Marca {
  id: number;
  nome: string;
  ativo: boolean;
  criado_em: string;
  excluido_em?: string | null;
}
