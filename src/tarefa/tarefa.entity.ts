import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  EntityManager,
} from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { Comentario } from '../comentario/comentario.entity';
import { Historico } from '../historico/entities/historico/historico';
import { Etiqueta } from '../etiqueta/entities/etiqueta/etiqueta';
import { DependenciasNaoConcluidasException } from 'src/core/exceptions/DependenciasNaoConcluidasException';

export interface TarefaComponente {
  getProgresso(): number;
  getTempoEstimado(): number;
  marcarComoCompleta(manager: EntityManager): Promise<void>;
  getEstatisticas(): { total: number; completed: number };
  atualizar(
    manager: EntityManager,
    dados: Partial<Tarefa>,
    propagar?: boolean,
  ): Promise<void>;
}

export enum Status {
  PENDENTE = 'PENDENTE',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDA = 'CONCLUIDA',
}

export enum Prioridade {
  ALTA = 'ALTA',
  MEDIA = 'MEDIA',
  BAIXA = 'BAIXA',
}

const PROGRESSO_COMPLETO = 100;
const PROGRESSO_INCOMPLETO = 0;

@Entity('tarefas')
export class Tarefa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column({ nullable: true })
  descricao?: string;

  @Column({
    type: 'text',
    enum: Status,
    default: Status.PENDENTE,
    nullable: false,
  })
  status: Status;

  @Column({
    type: 'text',
    enum: Prioridade,
    default: Prioridade.BAIXA,
    nullable: false,
  })
  prioridade: Prioridade;

  @Column({ nullable: true })
  prazo?: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.tarefasAutor)
  autor: Usuario;

  @ManyToOne(() => Usuario, (usuario) => usuario.tarefasResponsavel, {
    nullable: true,
  })
  responsavel?: Usuario;

  @OneToMany(() => Comentario, (comentario) => comentario.tarefa, {
    eager: true,
  })
  comentarios?: Comentario[];

  @OneToMany(() => Historico, (historico) => historico.tarefa)
  historico?: Historico[];

  @ManyToMany(() => Etiqueta, { cascade: false })
  @JoinTable()
  etiquetas: Etiqueta[];

  @OneToMany(() => Tarefa, (tarefa) => tarefa.tarefaPai, {
    nullable: true,
    cascade: ['insert', 'update'],
  })
  subTarefas?: Tarefa[];

  @ManyToOne(() => Tarefa, (tarefa) => tarefa.subTarefas, {
    nullable: true,
    cascade: false,
  })
  tarefaPai?: Tarefa;

  @Column({ type: 'float', default: 0 })
  tempoEstimado: number;

  @Column({ name: 'completa', default: false })
  isCompleta: boolean;

  @ManyToMany(() => Tarefa)
  @JoinTable({
    name: 'tarefa_dependencias',
    joinColumn: { name: 'tarefa_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'dependencia_id', referencedColumnName: 'id' },
  })
  dependencias: Tarefa[];
}

abstract class TarefaBase implements TarefaComponente {
  protected tarefa: Tarefa;

  constructor(tarefa: Tarefa) {
    this.tarefa = tarefa;
  }

  abstract getProgresso(): number;
  abstract getTempoEstimado(): number;
  abstract marcarComoCompleta(manager: EntityManager): Promise<void>;
  abstract getEstatisticas(): { total: number; completed: number };
  abstract atualizar(
    manager: EntityManager,
    dados: Partial<Tarefa>,
    propagar?: boolean,
  ): Promise<void>;
}

export class TarefaFolha extends TarefaBase {
  constructor(tarefa: Tarefa) {
    super(tarefa);
    if (tarefa.subTarefas && tarefa.subTarefas.length > 0) {
      throw new Error('TarefaFolha não pode ter subtarefas');
    }
  }

  getProgresso(): number {
    return this.tarefa.isCompleta ? PROGRESSO_COMPLETO : PROGRESSO_INCOMPLETO;
  }

  getTempoEstimado(): number {
    return this.tarefa.tempoEstimado;
  }

  async marcarComoCompleta(manager: EntityManager): Promise<void> {
    this.tarefa.isCompleta = true;
    this.tarefa.status = Status.CONCLUIDA;
    await manager.save(Tarefa, this.tarefa);
  }

  getEstatisticas(): { total: number; completed: number } {
    return {
      total: 1,
      completed: this.tarefa.isCompleta ? 1 : 0,
    };
  }

  async atualizar(
    manager: EntityManager,
    dados: Partial<Tarefa>,
  ): Promise<void> {
    if (dados.status === Status.CONCLUIDA && this.tarefa.dependencias) {
      const todasCompletas = this.tarefa.dependencias.every(
        (dep) => dep.isCompleta && dep.status === Status.CONCLUIDA,
      );

      if (!todasCompletas) throw new DependenciasNaoConcluidasException();
    }

    Object.assign(this.tarefa, {
      titulo: dados.titulo ?? this.tarefa.titulo,
      descricao: dados.descricao ?? this.tarefa.descricao,
      status: dados.status ?? this.tarefa.status,
      prioridade: dados.prioridade ?? this.tarefa.prioridade,
      prazo: dados.prazo ?? this.tarefa.prazo,
      responsavel: dados.responsavel ?? this.tarefa.responsavel,
      tempoEstimado: dados.tempoEstimado ?? this.tarefa.tempoEstimado,
      etiquetas: dados.etiquetas ?? this.tarefa.etiquetas,
    });

    await manager.save(Tarefa, this.tarefa);
  }
}

export class TarefaComposta extends TarefaBase {
  private subTarefas: TarefaComponente[];

  constructor(tarefa: Tarefa, subTarefas: TarefaComponente[]) {
    super(tarefa);
    this.subTarefas = subTarefas;
  }

  public getSubTarefas(): TarefaComponente[] {
    if (!this.subTarefas) {
      const tarefas = this.tarefa.subTarefas;

      if (!tarefas || tarefas.length === 0) {
        return [];
      }

      this.subTarefas = tarefas.map((subTarefa) => {
        const subTarefasFilhas = subTarefa.subTarefas;
        return subTarefasFilhas?.length === 0
          ? new TarefaFolha(subTarefa)
          : new TarefaComposta(this.tarefa, [new TarefaFolha(subTarefa)]);
      });
    }
    return this.subTarefas;
  }

  private calcularMedia(valores: number[]): number {
    return valores.length > 0
      ? valores.reduce((sum, val) => sum + val, 0) / valores.length
      : 0;
  }

  getProgresso(): number {
    const totalSubTarefas = this.subTarefas.length;
    const completedSubTarefas = this.subTarefas.filter(
      (subTarefa) => subTarefa.getProgresso() === 100,
    ).length;
    return (completedSubTarefas / totalSubTarefas) * 100;
  }

  getTempoEstimado(): number {
    const tempos = this.subTarefas.map((subTarefa) =>
      subTarefa.getTempoEstimado(),
    );

    return tempos.reduce((sum, tempo) => sum + tempo, 0);
  }

  async marcarComoCompleta(manager: EntityManager): Promise<void> {
    await Promise.all(
      this.subTarefas.map(async (subTarefa) => {
        await subTarefa.marcarComoCompleta(manager);
      }),
    );

    const todasCompletas =
      this.getEstatisticas().total === this.getEstatisticas().completed;
    if (todasCompletas) {
      this.tarefa.isCompleta = true;
      this.tarefa.status = Status.CONCLUIDA;
      await manager.save(Tarefa, this.tarefa);
    }
  }

  getEstatisticas(): { total: number; completed: number } {
    const estatisticas = this.subTarefas.map((subTarefa) =>
      subTarefa.getEstatisticas(),
    );

    return estatisticas.reduce(
      (acc, subEstatisticas) => ({
        total: acc.total + subEstatisticas.total,
        completed: acc.completed + subEstatisticas.completed,
      }),
      { total: 0, completed: 0 },
    );
  }

  async atualizar(
    manager: EntityManager,
    dados: Partial<Tarefa>,
    propagar: boolean = false,
  ): Promise<void> {
    if (dados.status === Status.CONCLUIDA && this.tarefa.dependencias) {
      const todasCompletas = this.tarefa.dependencias.every(
        (dep) => dep.isCompleta && dep.status === Status.CONCLUIDA,
      );

      if (!todasCompletas) throw new DependenciasNaoConcluidasException();
    }

    Object.assign(this.tarefa, {
      titulo: dados.titulo ?? this.tarefa.titulo,
      descricao: dados.descricao ?? this.tarefa.descricao,
      status: dados.status ?? this.tarefa.status,
      prioridade: dados.prioridade ?? this.tarefa.prioridade,
      prazo: dados.prazo ?? this.tarefa.prazo,
      responsavel: dados.responsavel ?? this.tarefa.responsavel,
      tempoEstimado: dados.tempoEstimado ?? this.tarefa.tempoEstimado,
      etiquetas: dados.etiquetas ?? this.tarefa.etiquetas,
    });

    if (propagar) {
      await Promise.all(
        this.subTarefas.map(async (subTarefa) => {
          await subTarefa.atualizar(
            manager,
            {
              responsavel: dados.responsavel,
              prioridade: dados.prioridade,
              etiquetas: dados.etiquetas,
            },
            propagar,
          );
        }),
      );
    }

    await manager.save(Tarefa, this.tarefa);
  }
}
