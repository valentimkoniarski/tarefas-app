import { IsUUID, IsNotEmpty, IsString } from 'class-validator';

export class IdDto {
  @IsUUID('4', { message: 'O ID deve ser um UUID válido' })
  @IsNotEmpty({ message: 'O ID não pode estar vazio' })
  @IsString({ message: 'O ID deve ser uma string' })
  id: string;
}
