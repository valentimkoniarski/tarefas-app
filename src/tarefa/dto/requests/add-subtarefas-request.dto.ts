import { IsArray, ArrayNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateTarefaFolhaDto } from './create-tarefa-request.dto';

export class AddSubtarefasRequestDto {
  @IsArray({ message: 'Subtarefas deve ser um array.' })
  @ArrayNotEmpty({ message: 'O array de subtarefas não pode estar vazio.' })
  @ValidateNested({ each: true })
  @Type(() => CreateTarefaFolhaDto)
  subtarefas: CreateTarefaFolhaDto[];
}
