import { Expose } from 'class-transformer';
import { Perfil } from '../usuario.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseUsuarioDto {
  @ApiProperty({
    example: '12345678-1234-1234-1234-123456789012',
    description: 'ID do usuário',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: 'example@email.com',
    description: 'Email do usuário',
  })
  @Expose()
  email: string;

  @ApiProperty({
    example: 'João da Silva',
    description: 'Nome completo do usuário',
  })
  @Expose()
  nome: string;

  @ApiProperty({
    example: '12345678',
    description: 'Senha do usuário',
  })
  @Expose()
  senha: string;

  @ApiProperty({
    example: 'ADMIN',
    description: 'Perfil do usuário',
  })
  @Expose()
  perfil: Perfil;
}
