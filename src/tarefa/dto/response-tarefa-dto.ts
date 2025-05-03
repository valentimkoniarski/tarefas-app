import { Expose, Type } from 'class-transformer';
import { ResponseComentarioDto } from '../../comentario/dto/response-comentario.dto';

export class ResponseTarefaDto {
  @Expose()
  titulo: string;

  @Expose()
  descricao: string;

  @Expose()
  prazo: Date;

  @Expose()
  @Type(() => ResponseComentarioDto) // <- ESSENCIAL para transformar objetos aninhados
  comentarios: ResponseComentarioDto[];
}
