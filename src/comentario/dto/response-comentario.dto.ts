import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseComentarioDto {
  @ApiProperty({ example: '1', description: 'ID do comentário' })
  @Expose()
  id: string;

  @ApiProperty({
    example: 'Esse é um comentário',
    description: 'Texto do comentário',
  })
  @Expose()
  texto: string;
}
