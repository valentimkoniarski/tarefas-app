import { ChildEntity, Column } from 'typeorm';
import { Tarefa } from './tarefa.entity';
import { PrioridadeTarefa } from 'src/core/enums/prioridade.tarefa.enum';
import { Min } from 'class-validator';
import { ProgressoTarefaBuilder } from '../builders/progresso-tarefa-clone.builder';
import { TarefaFolhaBuilder } from '../builders/tarefa-folha-clone.builder';
import { ClonarTarefaDto, EstatisticaTarefaFolhaDto } from '../dto/_index';
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

  getEstatistica(): EstatisticaTarefaFolhaDto {
    return {
      id: this.id,
      titulo: this.titulo,
      status: this.status,
      progresso: this.getProgresso(),
      pontos: this.pontos,
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
}
