import { ChildEntity, Column, TreeChildren } from 'typeorm';
import { Tarefa } from './tarefa.entity';
import { Min } from 'class-validator';
import { ProgressoTarefaBuilder } from '../builders/progresso-tarefa-clone.builder';
import { TarefaCompostaBuilder } from '../builders/tarefa-composta-clone.builder';
import { TarefaFolha } from './tarefa.folha.entity';
import { ClonarTarefaDto, EstatisticaTarefaCompostaDto } from '../dto/_index';

@ChildEntity()
export class TarefaComposta extends Tarefa {
  @TreeChildren({ cascade: true })
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

  cloneComModificacoes(mods: ClonarTarefaDto): TarefaComposta {
    const builder = new TarefaCompostaBuilder()
      .comTitulo(mods.titulo ?? this.titulo)
      .comSubTitulo(mods.subTitulo ?? this.subTitulo)
      .comStatus(mods.status ?? this.status)
      .comDataPrazo(mods.dataPrazo ?? this.dataPrazo)
      .comConcluida(this.concluida)
      .comLimiteSubtarefas(this.limiteSubtarefas ?? 0)
      .comSubtarefas(
        (this.subtarefas ?? []).map((subtarefa: Tarefa) => {
          const novaSubtarefa = new TarefaFolha();
          Object.assign(novaSubtarefa, { ...subtarefa, id: undefined });
          return novaSubtarefa;
        }),
      );

    return builder.build();
  }
}
