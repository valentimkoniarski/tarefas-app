import { PrioridadeTarefa } from 'src/core/enums/prioridade.tarefa.enum';
import { TarefaFolha } from '../entities/tarefa.folha.entity';
import { EstrategiaPontosFolha } from './estrategia-pontos-folha.interface';

export class PontosPorPrioridadeStrategy implements EstrategiaPontosFolha {
  calcular(tarefa: TarefaFolha): number {
    const mul = {
      [PrioridadeTarefa.ALTA]: 3,
      [PrioridadeTarefa.MEDIA]: 2,
      [PrioridadeTarefa.BAIXA]: 1,
    }[tarefa.prioridade];
    return tarefa.pontos * mul;
  }
}
