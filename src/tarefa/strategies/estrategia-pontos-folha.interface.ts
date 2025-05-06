import { TarefaFolha } from '../entities/tarefa.folha.entity';

export interface EstrategiaPontosFolha {
  calcular(tarefa: TarefaFolha): number;
}
