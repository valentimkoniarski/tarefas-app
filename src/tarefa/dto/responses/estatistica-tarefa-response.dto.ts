import { StatusTarefa } from 'src/core/enums/status.tarefa.enum';

import { IsNotEmpty, IsOptional } from 'class-validator';

export class EstatisticaTarefaCompostaDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  titulo: string;

  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  progresso: number;

  @IsNotEmpty()
  quantidadeSubtarefas: number;

  @IsNotEmpty()
  quantasConcluidas: number;

  @IsNotEmpty()
  quantasPendentes: number;

  @IsOptional()
  limiteSubtarefas?: number;

  static from(data: {
    id: number;
    titulo: string;
    status: string;
    progresso: number;
    quantidadeSubtarefas: number;
    quantasConcluidas: number;
    quantasPendentes: number;
    limiteSubtarefas?: number;
  }): EstatisticaTarefaCompostaDto {
    const dto = new EstatisticaTarefaCompostaDto();
    dto.id = data.id;
    dto.titulo = data.titulo;
    dto.status = data.status;
    dto.progresso = data.progresso;
    dto.quantidadeSubtarefas = data.quantidadeSubtarefas;
    dto.quantasConcluidas = data.quantasConcluidas;
    dto.quantasPendentes = data.quantasPendentes;
    dto.limiteSubtarefas = data.limiteSubtarefas;
    return dto;
  }
}

export class EstatisticaTarefaFolhaDto {
  id: number;
  titulo: string;
  status: StatusTarefa;
  progresso: number;
  pontos: number;
  tempoEstimadoDias: number;
}
