import { TarefaComposta } from '../entities/tarefa.composta.entity';
import { TarefaBuilder } from './tarefa-base-clone.builder';

export class TarefaCompostaBuilder extends TarefaBuilder<TarefaComposta> {
  constructor(tarefa: TarefaComposta = new TarefaComposta()) {
    super(tarefa);
  }

  comLimiteSubtarefas(limite: number): this {
    this.tarefa.limiteSubtarefas = limite;
    return this;
  }

  build(): TarefaComposta {
    return this.tarefa;
  }
}
