import { ChildEntity, Column, TreeChildren } from 'typeorm';
import { Tarefa } from './tarefa.entity';
import { EstatisticaTarefaCompostaDto } from '../dto/responses/_index';
import { Min } from 'class-validator';
import { ProgressoTarefaBuilder } from '../builders/progresso-tarefa-clone.builder';
import { TarefaCompostaBuilder } from '../builders/tarefa-composta-clone.builder';

@ChildEntity()
export class TarefaComposta extends Tarefa {
  @TreeChildren()
  subtarefas?: Tarefa[];

  @Column({ type: 'int', nullable: true })
  @Min(1)
  limiteSubtarefas?: number;

  getProgresso(): number {
    return ProgressoTarefaBuilder.calcular(this);
  }

  getEstatistica(): EstatisticaTarefaCompostaDto {
    const subtarefas = this.subtarefas ?? [];
    const total = subtarefas.length;
    const concluidas = subtarefas.filter(
      (tarefa) => tarefa.getProgresso() === 100,
    ).length;
    const pendentes = total - concluidas;

    return EstatisticaTarefaCompostaDto.from({
      id: this.id,
      titulo: this.titulo,
      status: this.status,
      progresso: ProgressoTarefaBuilder.calcular(this),
      quantidadeSubtarefas: total,
      quantasConcluidas: concluidas,
      quantasPendentes: pendentes,
      limiteSubtarefas: this.limiteSubtarefas ?? undefined,
    });
  }

  cloneComModificacoes(mods: Partial<TarefaComposta>): Tarefa {
    const copia = new TarefaCompostaBuilder()
      .comTitulo(mods.titulo ?? this.titulo)
      .comSubTitulo(mods.subTitulo ?? this.subTitulo)
      .comStatus(mods.status ?? this.status)
      .comDataPrazo(mods.dataPrazo ?? this.dataPrazo)
      .comConcluida(mods.concluida ?? this.concluida)
      //.comSubtarefas(mods.subtarefas ?? this.subtarefas ?? [])
      .comLimiteSubtarefas(mods.limiteSubtarefas ?? this.limiteSubtarefas ?? 0)
      .build();

    return copia;
  }
}
