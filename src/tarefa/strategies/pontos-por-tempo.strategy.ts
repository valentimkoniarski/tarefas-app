import { TarefaFolha } from '../entities/tarefa.folha.entity';
import { EstrategiaPontosFolha } from './estrategia-pontos-folha.interface';

export class PontosPorTempoStrategy implements EstrategiaPontosFolha {
  calcular(tarefa: TarefaFolha): number {
    return tarefa.tempoEstimadoDias * 5;
  }
}
