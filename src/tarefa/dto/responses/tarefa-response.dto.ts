import { Exclude, Expose, Type } from 'class-transformer';
import { PrioridadeTarefa } from 'src/core/enums/prioridade.tarefa.enum';
import { StatusTarefa } from 'src/core/enums/status.tarefa.enum';

@Exclude()
export class TarefaResponseDto {
  @Expose()
  id: number;

  @Expose()
  titulo: string;

  @Expose()
  subTitulo?: string;

  @Expose()
  descricao?: string;

  @Expose()
  prioridade: PrioridadeTarefa;

  @Expose()
  status: StatusTarefa;

  @Expose()
  pontos: number;

  @Expose()
  dataCriacao: Date;

  @Expose()
  dataPrazo?: Date;

  @Expose()
  tempoEstimadoDias?: number;

  @Expose()
  @Type(() => TarefaResponseDto)
  subtarefas?: TarefaResponseDto[];
}
