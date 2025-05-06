import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
  Tree,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm';
import { StatusTarefa } from 'src/core/enums/status.tarefa.enum';
import {
  EstatisticaTarefaCompostaDto,
  EstatisticaTarefaFolhaDto,
} from '../dto/responses/_index';

@Entity('tarefas')
@TableInheritance({ column: { type: 'varchar', name: 'tipo' } })
@Tree('closure-table')
export abstract class Tarefa {
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

  @Column()
  tipo: string;

  @TreeParent({ onDelete: 'CASCADE' })
  declare tarefaPai?: Tarefa;

  abstract getEstatistica():
    | EstatisticaTarefaFolhaDto
    | EstatisticaTarefaCompostaDto;
  abstract cloneComModificacoes(mods: Partial<Tarefa>): Tarefa;
  abstract getProgresso(): number;
}
