import { Exclude, Expose, Type } from 'class-transformer';
import { CreateTarefaFolhaDto } from './create-tarefa-request.dto';
import { Tarefa } from '../tarefa.entitiy';

@Exclude()
export class AddSubtarefasResponseDto {
  @Expose()
  id: number;

  @Expose()
  titulo: string;

  @Expose()
  status: string;

  @Expose()
  @Type(() => CreateTarefaFolhaDto)
  subtarefas: Tarefa[];
}
