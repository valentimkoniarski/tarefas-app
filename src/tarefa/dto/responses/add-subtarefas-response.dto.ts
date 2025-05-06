import { Exclude, Expose, Type } from 'class-transformer';
import { CreateTarefaFolhaDto } from '../requests/create-tarefa-request.dto';
import { Tarefa } from 'src/tarefa/entities/tarefa.entity';

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
