import { IsString, IsNotEmpty } from 'class-validator';
import { Perfil } from '../usuario.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @ApiProperty({
    example: 'João da Silva',
    description: 'Nome completo do usuário',
  })
  nome: string;

  @IsString()
  @IsNotEmpty({ message: 'O E-Mail é obrigatório.' })
  @ApiProperty({ example: 'joao@email.com', description: 'E-mail do usuário' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @ApiProperty({
    example: 'senha123',
    description: 'Senha do usuário',
  })
  senha: string;

  @IsString()
  @IsNotEmpty({ message: 'O perfil do usuário é obrigatório.' })
  @ApiProperty({
    example: 'ADMIN',
    description: 'Perfil do usuário (ADMIN ou USUARIO)',
  })
  perfil?: Perfil;
}
