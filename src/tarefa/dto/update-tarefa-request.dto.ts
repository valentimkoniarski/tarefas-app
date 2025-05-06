import {
  IsOptional,
  IsBoolean,
  IsString,
  IsEnum,
  IsInt,
  Min,
  IsISO8601,
} from 'class-validator';
import { PrioridadeTarefa } from 'src/core/enums/prioridade.tarefa.enum';
import { StatusTarefa } from 'src/core/enums/status.tarefa.enum';

export class UpdateTarefaRequestDto {
  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsString()
  subTitulo?: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsBoolean()
  concluida?: boolean;

  @IsOptional()
  @IsEnum(StatusTarefa)
  status?: StatusTarefa;

  @IsOptional()
  @IsEnum(PrioridadeTarefa)
  prioridade?: PrioridadeTarefa;

  @IsOptional()
  @IsInt()
  @Min(0)
  pontos?: number;

  @IsOptional()
  @IsISO8601()
  dataConclusao?: string;

  @IsOptional()
  @IsISO8601()
  dataPrazo?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  tempoEstimadoDias?: number;

  @IsOptional()
  @IsString()
  tipo?: string;
}
