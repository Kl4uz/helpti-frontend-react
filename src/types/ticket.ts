export type ChamadoStatus = "ABERTO" | "EM_ATENDIMENTO" | "FECHADO";
export type ChamadoPrioridade = "BAIXA" | "MEDIA" | "ALTA";

export interface Chamado {
  id: number;
  titulo: string;
  descricao: string;
  status: ChamadoStatus;
  prioridade: ChamadoPrioridade;
  dataAbertura: string;
  tecnico?: {
    nome: string;
  };
}
