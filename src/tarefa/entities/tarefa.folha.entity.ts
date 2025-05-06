import { ChildEntity, Column } from 'typeorm';
import { Tarefa } from './tarefa.entity';
import { PrioridadeTarefa } from 'src/core/enums/prioridade.tarefa.enum';
import { Min } from 'class-validator';
import { ProgressoTarefaBuilder } from '../builders/progresso-tarefa-clone.builder';
import { TarefaFolhaBuilder } from '../builders/tarefa-folha-clone.builder';
import { ClonarTarefaDto, EstatisticaTarefaFolhaDto } from '../dto/_index';
import { StatusTarefa } from 'src/core/enums/status.tarefa.enum';
import { PontosFolhaStrategyFactory, TipoCalculoPontosFolha } from '../factories/pontos-folha.strategy.factory';
import { EstrategiaPontosFolha } from '../strategies/estrategia-pontos-folha.interface';
@ChildEntity()
export class TarefaFolha extends Tarefa {
  @Column({ nullable: true })
  descricao?: string;

  @Column({
    type: 'enum',
    enum: PrioridadeTarefa,
    default: PrioridadeTarefa.MEDIA,
  })
  prioridade: PrioridadeTarefa;

  @Column({ type: 'int', default: 0 })
  @Min(0)
  pontos: number;

  @Column({ type: 'timestamp', nullable: true })
  dataConclusao?: Date;

  @Column({ type: 'int', default: 0 })
  @Min(0)
  tempoEstimadoDias: number;

  @Column({
    type: 'enum',
    enum: TipoCalculoPontosFolha,
    default: TipoCalculoPontosFolha.FIXO,
  })
  tipoCalculoPontos: TipoCalculoPontosFolha;

  private estrategiaPontos: EstrategiaPontosFolha;

  private initStrategy() {
    this.estrategiaPontos = PontosFolhaStrategyFactory.getStrategy(
      this.tipoCalculoPontos,
    );
  }

  calcularPontos(): number {
    this.initStrategy();
    return this.estrategiaPontos.calcular(this);
  }

  getEstatistica(): EstatisticaTarefaFolhaDto {
    return {
      id: this.id,
      titulo: this.titulo,
      status: this.status,
      progresso: this.getProgresso(),
      pontos: this.calcularPontos(),
      tempoEstimadoDias: this.tempoEstimadoDias ?? 0,
    };
  }

  getProgresso(): number {
    return ProgressoTarefaBuilder.fromStatus(this.status);
  }

  cloneComModificacoes(mods: ClonarTarefaDto): TarefaFolha {
    const copia = new TarefaFolhaBuilder()
      .comTitulo(mods.titulo ?? this.titulo)
      .comSubTitulo(mods.subTitulo ?? this.subTitulo)
      .comStatus(mods.status ?? this.status)
      .comDataPrazo(mods.dataPrazo ?? this.dataPrazo)
      .comConcluida(this.concluida)
      .comDescricao(this.descricao)
      .comPrioridade(this.prioridade)
      .comPontos(this.pontos)
      .comTempoEstimadoDias(this.tempoEstimadoDias)
      .comTarefaPai(this.tarefaPai as TarefaFolha)
      .build();

    return copia;
  }

  podeIniciar(): boolean {
    const paiConcluido =
      !this.tarefaPai || this.tarefaPai.getProgresso() === 100;
    return this.status === StatusTarefa.PENDENTE && paiConcluido;
  }

  iniciar(): void {
    if (!this.podeIniciar()) {
      throw new Error('Não é possível iniciar esta tarefa ainda');
    }
    this.status = StatusTarefa.EM_ANDAMENTO;
  }

  concluir(): void {
    if (this.status !== StatusTarefa.EM_ANDAMENTO) {
      throw new Error('Só é possível concluir uma tarefa em andamento');
    }
    this.status = StatusTarefa.CONCLUIDA;
    this.dataConclusao = new Date();
    this.concluida = true;
  }
}
