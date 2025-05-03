import { ApiProperty } from '@nestjs/swagger';
import { ResponseUsuarioDto } from './response-usuario.dto';
import { Expose } from 'class-transformer';

export class ResponsePageUsuarioDto {
  @ApiProperty({
    example: {
      total: 100,
      page: 1,
      limit: 10,
    },
    description: 'Meta informações da paginação',
  })
  @Expose()
  meta: { total: number; page: number; limit: number };

  @ApiProperty({
    type: [ResponseUsuarioDto],
    description: 'Lista de usuários',
  })
  @Expose()
  data: ResponseUsuarioDto[];
}
