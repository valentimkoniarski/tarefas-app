import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Tarefa } from '../../../tarefa/tarefa.entity';

@Entity('historicos')
export class Historico {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  data: Date;

  @Column()
  descricao: string;

  @ManyToOne(() => Tarefa, (tarefa) => tarefa.historico)
  tarefa: Tarefa;
}
