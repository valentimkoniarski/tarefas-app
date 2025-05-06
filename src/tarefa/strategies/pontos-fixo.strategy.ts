import { TarefaFolha } from '../entities/tarefa.folha.entity';
import { EstrategiaPontosFolha } from './estrategia-pontos-folha.interface';

export class PontosFixoStrategy implements EstrategiaPontosFolha {
  calcular(tarefa: TarefaFolha): number {
    return tarefa.pontos;
  }
}
