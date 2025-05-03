import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('etiquetas')
export class Etiqueta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column()
  cor: string;
}
