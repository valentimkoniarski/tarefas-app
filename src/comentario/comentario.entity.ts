import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { Tarefa } from '../tarefa/tarefa.entity';

@Entity('comentarios')
export class Comentario {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  texto: string;

  @Column()
  data: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.comentarios, {
    nullable: true,
  })
  autor?: Usuario;

  @ManyToOne(() => Tarefa, (tarefa) => tarefa.comentarios)
  tarefa: Tarefa;
}
