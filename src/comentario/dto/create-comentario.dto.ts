import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsUUID,
} from 'class-validator';

export class CreateComentarioDto {
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  texto: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'O prazo deve ser uma data válida (formato ISO).' },
  )
  data?: Date;

  @IsUUID('4', { message: 'O ID do autor deve ser um UUID válido.' })
  autor: string;

  @IsUUID('4', { message: 'O ID do autor deve ser um UUID válido.' })
  tarefa: string;
}
