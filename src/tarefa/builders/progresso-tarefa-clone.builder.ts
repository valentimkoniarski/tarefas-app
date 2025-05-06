import { StatusTarefa } from 'src/core/enums/status.tarefa.enum';
import { Tarefa } from '../entities/tarefa.entity';
import { TarefaComposta } from '../entities/tarefa.composta.entity';

export class ProgressoTarefaBuilder {
  static fromStatus(status: StatusTarefa): number {
    switch (status) {
      case StatusTarefa.CONCLUIDA:
        return 100;
      case StatusTarefa.EM_ANDAMENTO:
        return 50;
      case StatusTarefa.PENDENTE:
      default:
        return 0;
    }
  }

  static fromSubtarefas(subtarefas: Tarefa[]): number {
    const total = subtarefas.length;
    if (total === 0) return 0;

    const progressoTotal = subtarefas.reduce(
      (soma, tarefa) => soma + tarefa.getProgresso(),
      0,
    );

    return Math.round(progressoTotal / total);
  }

  static calcular(tarefa: Tarefa): number {
    if (tarefa instanceof TarefaComposta) {
      const subtarefas = tarefa.subtarefas ?? [];
      if (subtarefas.length === 0) {
        return this.fromStatus(tarefa.status);
      }
      return this.fromSubtarefas(subtarefas);
    }

    throw new Error(
      'A tarefa não é uma instância de TarefaComposta ou não possui subtarefas.',
    );
  }
}
