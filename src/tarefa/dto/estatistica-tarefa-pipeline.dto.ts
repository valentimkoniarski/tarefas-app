export interface EstatisticaTarefaPipelineDto {
  id: number;
  titulo: string;
  status: string;
  progresso: number;
  totalEtapas: number;
  etapasConcluidas: number;
  limiteEtapas?: number;
}