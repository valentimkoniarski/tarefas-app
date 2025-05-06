import {
  EventSubscriber,
  EntitySubscriberInterface,
  DataSource,
} from 'typeorm';
import { Tarefa } from './entities/tarefa.entity';

@EventSubscriber()
export class TarefaSubscriber implements EntitySubscriberInterface<Tarefa> {
  constructor(private dataSource: DataSource) {
    this.dataSource.subscribers.push(this);
  }

  listenTo() {
    return Tarefa;
  }

  // async afterInsert(event: InsertEvent<Tarefa>): Promise<void> {
  //   const subtarefa = event.entity;

  //   if (
  //     subtarefa?.tarefaPai &&
  //     subtarefa.tarefaPai?.subtarefas &&
  //     subtarefa.tarefaPai instanceof TarefaFolha
  //   ) {
  //     await event.manager
  //       .getRepository(Tarefa)
  //       .update(subtarefa.tarefaPai.id, { tipo: TarefaComposta.name });
  //   }
  // }
}
