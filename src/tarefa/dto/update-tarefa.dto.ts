import {
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsNumber,
  Min,
  IsUUID,
  IsBoolean,
  IsArray,
  IsNotEmpty,
} from 'class-validator';
import { Prioridade, Status } from '../tarefa.entity';

export class UpdateTarefaDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  titulo?: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsEnum(Prioridade)
  prioridade?: Prioridade;

  @IsOptional()
  @IsDateString()
  prazo?: string;

  @IsOptional()
  @IsUUID()
  responsavelId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tempoEstimado?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  custo?: number;

  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  etiquetaIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  dependenciaIds?: string[];

  @IsOptional()
  @IsBoolean()
  propagar?: boolean;
}
