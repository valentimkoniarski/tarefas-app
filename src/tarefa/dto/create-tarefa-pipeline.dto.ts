import { IsInt, IsString, Min, ValidateNested } from "class-validator";
import { CreateTarefaFolhaDto } from "./_index";
import { Type } from "class-transformer";

export class CreateTarefaPipelineDto {
  @IsString()
  titulo: string;

  @IsInt()
  @Min(1)
  limiteEtapas: number;

  @ValidateNested({ each: true })
  @Type(() => CreateTarefaFolhaDto)
  etapas: CreateTarefaFolhaDto[];
}