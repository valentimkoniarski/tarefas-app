import {
  IsEnum,
  IsOptional,
  IsString,
  Min,
  IsInt,
  IsPositive,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { PrioridadeTarefa } from 'src/core/enums/prioridade.tarefa.enum';
import { StatusTarefa } from 'src/core/enums/status.tarefa.enum';

export class CreateTarefaFolhaDto {
  @IsString()
  titulo: string;

  @IsOptional()
  @IsString()
  subTitulo?: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsEnum(StatusTarefa)
  status: StatusTarefa;

  @IsEnum(PrioridadeTarefa)
  prioridade: PrioridadeTarefa;

  @IsInt()
  @Min(0)
  pontos: number;

  @IsOptional()
  @IsDateString()
  dataPrazo?: Date;

  @IsInt()
  @Min(0)
  @IsPositive()
  tempoEstimadoDias: number;
}

export class CreateTarefaCompostaDto {
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @IsOptional()
  @IsString()
  subTitulo?: string;

  @IsOptional()
  @IsDateString()
  dataPrazo?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  limiteSubtarefas?: number;
}
