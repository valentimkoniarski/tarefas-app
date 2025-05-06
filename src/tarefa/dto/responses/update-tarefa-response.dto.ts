import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UpdateTarefaResponseDto {
  @Expose()
  id: number;

  @Expose()
  titulo: string;

  @Expose()
  status: string;

  @Expose()
  prioridade: string;

  @Expose()
  pontos: number;

  @Expose()
  dataAtualizacao: Date;

  @Expose()
  dataPrazo?: Date;
}
