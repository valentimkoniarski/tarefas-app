import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class EstatisticaGeraisDto {
  @Expose()
  progresso: number;

  @Expose()
  quantasConcluidas: number;

  @Expose()
  totalTarefasPendentes: number;

  @Expose()
  quantasPendentes: number;

  @Expose()
  limiteSubtarefas: number;
}
