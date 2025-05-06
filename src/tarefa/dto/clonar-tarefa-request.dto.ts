import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { StatusTarefa } from 'src/core/enums/status.tarefa.enum';

@Exclude()
export class ClonarTarefaDto {
  @IsString()
  @IsOptional()
  @Expose()
  titulo: string;

  @IsOptional()
  @IsString()
  @Expose()
  subTitulo?: string;

  @IsOptional()
  @IsDateString()
  @Expose()
  dataPrazo?: Date;

  @IsEnum(StatusTarefa)
  @IsOptional()
  @Expose()
  status: StatusTarefa;
}
