import { PrioridadeTarefa } from 'src/core/enums/prioridade.tarefa.enum';
import { TarefaFolha } from '../entities/tarefa.folha.entity';
import { TarefaBuilder } from './tarefa-base-clone.builder';
import { TipoCalculoPontosFolha } from '../factories/pontos-folha.strategy.factory';

export class TarefaFolhaBuilder extends TarefaBuilder<TarefaFolha> {
  constructor(tarefa: TarefaFolha = new TarefaFolha()) {
    super(tarefa);
  }

  comDescricao(descricao: string | undefined): this {
    this.tarefa.descricao = descricao;
    return this;
  }

  comPrioridade(prioridade: PrioridadeTarefa): this {
    this.tarefa.prioridade = prioridade;
    return this;
  }

  comPontos(pontos: number): this {
    this.tarefa.pontos = pontos;
    return this;
  }

  comTempoEstimadoDias(tempoEstimadoDias: number): this {
    this.tarefa.tempoEstimadoDias = tempoEstimadoDias;
    return this;
  }

  comTarefaPai(tarefaPai: TarefaFolha): this {
    this.tarefa.tarefaPai = tarefaPai;
    return this;
  }

  comTipoCalculoPontos(tipoCalculoPontos: TipoCalculoPontosFolha): this {
    this.tarefa.tipoCalculoPontos = tipoCalculoPontos;
    return this;
  }

  build(): TarefaFolha {
    return this.tarefa;
  }
}
