import { ChildEntity, Column, TreeChildren } from 'typeorm';
import { Tarefa } from './tarefa.entity';
import { Min } from 'class-validator';
import { ClonarTarefaDto, EstatisticaTarefaPipelineDto } from '../dto/_index';
import { TarefaPipelineBuilder } from '../builders/tarefa-pipeline-clone.builder';
import { StatusTarefa } from 'src/core/enums/status.tarefa.enum';

@ChildEntity()
export class TarefaPipeline extends Tarefa {
  @TreeChildren({ cascade: true })
  etapaSequencial?: Tarefa[];

  @Column({ type: 'int', nullable: true })
  @Min(1)
  limiteEtapas?: number;

  getProgresso(): number {
    const etapas = this.etapaSequencial ?? [];
    if (!etapas.length) return 0;
    const completas = etapas.filter(t => t.getProgresso() === 100).length;
    return (completas / etapas.length) * 100;
  }

  getEstatistica(): EstatisticaTarefaPipelineDto {
    const etapas = this.etapaSequencial ?? [];
    const total = etapas.length;
    const concluidas = etapas.filter(t => t.getProgresso() === 100).length;

    return {
      id: this.id,
      titulo: this.titulo,
      status: this.status,
      progresso: this.getProgresso(),
      totalEtapas: total,
      etapasConcluidas: concluidas,
      limiteEtapas: this.limiteEtapas ?? undefined,
    };
  }

  cloneComModificacoes(mods: ClonarTarefaDto): TarefaPipeline {
    return new TarefaPipelineBuilder()
      .comTitulo(mods.titulo ?? this.titulo)
      .comSubTitulo(mods.subTitulo ?? this.subTitulo)
      .comStatus(mods.status ?? this.status)
      .comDataPrazo(mods.dataPrazo ?? this.dataPrazo)
      .comLimiteEtapas(this.limiteEtapas)
      .comEtapaSequencial(
        (this.etapaSequencial ?? []).map(e => Object.assign(new (e.constructor as any)(), { ...e, id: undefined }))
      )
      .build();
  }

  podeIniciar(): boolean {
    const etapas = this.etapaSequencial ?? [];
    if (etapas.length === 0) {
      throw new Error('Pipeline não possui etapas para iniciar');
    }
    const podeIniciar = etapas.every((t, i) =>
      i === 0
        ? t.status === StatusTarefa.PENDENTE
        : etapas[i - 1].getProgresso() === 100
    );
    if (!podeIniciar) {
      throw new Error('Pipeline não está pronto para iniciar a próxima etapa');
    }
    return true;
  }
  
  iniciar(): void {
    if (!this.podeIniciar()) {
      throw new Error('Pipeline não está pronto para iniciar a próxima etapa');
    }
    const prox = this.etapaSequencial!.find(t => t.status === StatusTarefa.PENDENTE)!;
    prox.iniciar();
  }
  
  concluir(): void {
    throw new Error('Use concluir() diretamente na etapa folha');
  }
  
}
