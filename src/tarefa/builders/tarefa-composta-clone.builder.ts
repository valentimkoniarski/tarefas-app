import { TarefaComposta } from '../entities/tarefa.composta.entity';
import { Tarefa } from '../entities/tarefa.entity';
import { TarefaBuilder } from './tarefa-base-clone.builder';

export class TarefaCompostaBuilder extends TarefaBuilder<TarefaComposta> {
  constructor(tarefa: TarefaComposta = new TarefaComposta()) {
    super(tarefa);
  }

  comLimiteSubtarefas(limite: number): this {
    this.tarefa.limiteSubtarefas = limite;
    return this;
  }

  comSubtarefas(subtarefas: Tarefa[]): this {
    this.tarefa.subtarefas = subtarefas;
    return this;
  }

  build(): TarefaComposta {
    return this.tarefa;
  }
}
