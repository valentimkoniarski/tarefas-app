import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsUUID,
  IsArray,
  IsEnum,
} from 'class-validator';
import { Status, Prioridade } from '../tarefa.entity';

export class CreateTarefaDto {
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  titulo: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsEnum(Status, { message: 'Status inválido.' })
  status?: Status;

  @IsOptional()
  @IsEnum(Prioridade, { message: 'Prioridade inválida.' })
  prioridade?: Prioridade;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'O prazo deve ser uma data válida (formato ISO).' },
  )
  prazo?: Date;

  @IsUUID('4', { message: 'O ID do autor deve ser um UUID válido.' })
  autorId: string;

  @IsOptional()
  @IsUUID('4', { message: 'O ID do responsável deve ser um UUID válido.' })
  responsavelId?: string;

  @IsOptional()
  @IsArray({ message: 'Etiquetas deve ser um array de UUIDs.' })
  etiquetas?: string[];

  @IsOptional()
  @IsUUID('4', { message: 'O ID da tarefa pai deve ser um UUID válido.' })
  tarefaPaiId?: string;

  @IsOptional()
  @IsArray({ message: 'Dependências deve ser um array de UUIDs.' })
  @IsUUID('4', {
    each: true,
    message: 'Cada dependência deve ser um UUID válido.',
  })
  dependencias?: string[];
}
