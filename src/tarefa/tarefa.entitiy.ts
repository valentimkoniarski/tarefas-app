import { PrioridadeTarefa } from 'src/core/enums/prioridade.tarefa.enum';
import { StatusTarefa } from 'src/core/enums/status.tarefa.enum';
import { TipoCalculoPontosFolha } from 'src/core/enums/tipo-calculo-pontos-folha.enum';
import { TipoTarefa } from 'src/core/enums/tipo-tarefa.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@Entity('tarefas')
@Tree('closure-table')
export class Tarefa {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column()
  titulo: string;

  @Column({ nullable: true })
  subTitulo?: string;

  @Column({ type: 'enum', enum: StatusTarefa, default: StatusTarefa.PENDENTE })
  status: StatusTarefa;

  @CreateDateColumn()
  dataCriacao: Date;

  @UpdateDateColumn()
  dataAtualizacao: Date;

  @Column({ type: 'timestamp', nullable: true })
  dataPrazo?: Date;

  @Column({ default: false })
  concluida: boolean;

  @Column({
    type: 'enum',
    enum: TipoTarefa,
    default: TipoTarefa.FOLHA,
    nullable: true,
  })
  tipo: TipoTarefa;

  // Campos de TarefaFolha
  @Column({ nullable: true })
  descricao?: string;

  @Column({
    type: 'enum',
    enum: PrioridadeTarefa,
    default: PrioridadeTarefa.MEDIA,
    nullable: true,
  })
  prioridade?: PrioridadeTarefa;

  @Column({ type: 'int', default: 0, nullable: true })
  pontos?: number;

  @Column({ type: 'timestamp', nullable: true })
  dataConclusao?: Date;

  @Column({ type: 'int', default: 0, nullable: true })
  tempoEstimadoDias?: number;

  @Column({
    type: 'enum',
    enum: TipoCalculoPontosFolha,
    default: TipoCalculoPontosFolha.FIXO,
    nullable: true,
  })
  tipoCalculoPontos?: TipoCalculoPontosFolha;

  // Campos de TarefaComposta
  @TreeChildren({ cascade: true })
  subtarefas?: Tarefa[];

  @Column({ type: 'int', nullable: true })
  limiteSubtarefas?: number;

  // Campos de TarefaPipeline
  @TreeChildren({ cascade: true })
  etapaSequencial?: Tarefa[];

  @Column({ type: 'int', nullable: true })
  limiteEtapas?: number;

  @TreeParent({ onDelete: 'CASCADE' })
  tarefaPai?: Tarefa;

  getProgresso(): number {
    switch (this.tipo) {
      case TipoTarefa.FOLHA:
        if (this.status === StatusTarefa.PENDENTE)    return 0;
        if (this.status === StatusTarefa.EM_ANDAMENTO) return 50;
        if (this.status === StatusTarefa.CONCLUIDA)    return 100;
        return 0;

      case TipoTarefa.COMPOSTA:
        const subs = this.subtarefas ?? [];
        if (!subs.length) return 0;
        const concl = subs.filter(s => s.status === StatusTarefa.CONCLUIDA).length;
        return Math.round((concl / subs.length) * 100);

      case TipoTarefa.PIPELINE:
        const etapas = this.etapaSequencial ?? [];
        if (!etapas.length) return 0;
        const prontas = etapas.filter(e => e.status === StatusTarefa.CONCLUIDA).length;
        return Math.round((prontas / etapas.length) * 100);
    }
  }

  /** Retorna um objeto “genérico” de estatísticas; adapte à sua DTO se quiser */
  getEstatistica() {
    return {
      id: this.id,
      titulo: this.titulo,
      status: this.status,
      progresso: this.getProgresso(),

      // extras por tipo
      ...(this.tipo === TipoTarefa.FOLHA && {
        pontos: this.pontos,
        tempoEstimadoDias: this.tempoEstimadoDias,
      }),
      ...(this.tipo === TipoTarefa.COMPOSTA && {
        quantidadeSubtarefas: this.subtarefas?.length ?? 0,
        quantasConcluidas: this.subtarefas?.filter(s => s.status === StatusTarefa.CONCLUIDA).length ?? 0,
        limiteSubtarefas: this.limiteSubtarefas,
      }),
      ...(this.tipo === TipoTarefa.PIPELINE && {
        totalEtapas: this.etapaSequencial?.length ?? 0,
        etapasConcluidas: this.etapaSequencial?.filter(e => e.status === StatusTarefa.CONCLUIDA).length ?? 0,
        limiteEtapas: this.limiteEtapas,
      }),
    };
  }
}
