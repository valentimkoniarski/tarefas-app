import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Unique,
} from 'typeorm';
import { Tarefa } from '../tarefa/tarefa.entity';
import { Comentario } from '../comentario/comentario.entity';

export type Perfil = 'ADMIN' | 'USUARIO';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column()
  @Unique(['email'])
  email: string;

  @Column()
  senha: string;

  @Column()
  perfil: Perfil;

  @OneToMany(() => Tarefa, (tarefa) => tarefa.responsavel)
  tarefasResponsavel?: Tarefa[];

  @OneToMany(() => Tarefa, (tarefa) => tarefa.autor)
  tarefasAutor?: Tarefa[];

  @OneToMany(() => Comentario, (comentario) => comentario.autor)
  comentarios?: Comentario[];
}
