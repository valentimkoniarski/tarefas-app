import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  ParseIntPipe,
  Param,
  Delete,
  Get,
  Patch,
  Query,
} from '@nestjs/common';
import { TarefaService } from './tarefa.service';
import { plainToInstance } from 'class-transformer';
import { HttpResponse } from 'src/core/dto/http-response.dto';
import {
  ClonarTarefaDto,
  CreateTarefaCompostaDto,
  CreateTarefaFolhaDto,
  UpdateTarefaRequestDto,
  EstatisticaGeraisDto,
} from './dto/_index';
import { TarefaResponseDto } from './dto/tarefa-response.dto';
import { PaginationDto } from 'src/core/dto/_index';

@Controller('tarefas')
export class TarefaController {
  constructor(private readonly tarefaService: TarefaService) {}

  @Post('simples')
  @HttpCode(HttpStatus.CREATED)
  async criarTarefaSimples(
    @Body() dto: CreateTarefaFolhaDto,
  ): Promise<HttpResponse<CreateTarefaFolhaDto>> {
    const tarefa = await this.tarefaService.criarTarefaSimples(dto);
    const responseDto = plainToInstance(CreateTarefaFolhaDto, tarefa, {
      excludeExtraneousValues: true,
    });
    return new HttpResponse('Tarefa criada com sucesso.', responseDto);
  }

  @Post('composta')
  @HttpCode(HttpStatus.CREATED)
  async criarTarefaComposta(
    @Body() dto: CreateTarefaCompostaDto,
  ): Promise<HttpResponse<TarefaResponseDto>> {
    const tarefa = await this.tarefaService.criarTarefaComposta(dto);
    const responseDto = plainToInstance(TarefaResponseDto, tarefa, {
      excludeExtraneousValues: true,
    });
    return new HttpResponse('Tarefa criada com sucesso.', responseDto);
  }

  @Post('clonar/:origemId')
  @HttpCode(HttpStatus.CREATED)
  async clonarTarefa(
    @Param('origemId', ParseIntPipe) origemId: number,
    @Body() dto: ClonarTarefaDto,
  ): Promise<HttpResponse<ClonarTarefaDto>> {
    const tarefa = await this.tarefaService.clonarTarefa(origemId, dto);
    const responseDto = plainToInstance(ClonarTarefaDto, tarefa, {
      excludeExtraneousValues: true,
    });
    return new HttpResponse('Tarefa clonada com sucesso.', responseDto);
  }

  @Post(':id/subtarefas')
  @HttpCode(HttpStatus.OK)
  async adicionarSubtarefas(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateTarefaFolhaDto,
  ): Promise<HttpResponse<TarefaResponseDto>> {
    const tarefa = await this.tarefaService.adicionarSubtarefa(id, dto);
    const responseDto = plainToInstance(TarefaResponseDto, tarefa, {
      excludeExtraneousValues: true,
    });
    return new HttpResponse('Subtarefas adicionadas com sucesso.', responseDto);
  }

  @Delete(':id')
  async removerTarefa(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.tarefaService.removerTarefa(id);
  }

  @Patch(':id')
  async atualizarTarefa(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTarefaRequestDto,
  ): Promise<HttpResponse<UpdateTarefaRequestDto>> {
    const tarefa = await this.tarefaService.atualizarTarefa(id, dto);
    const responseDto = plainToInstance(UpdateTarefaRequestDto, tarefa, {
      excludeExtraneousValues: true,
    });

    return new HttpResponse('Tarefa atualizada com sucesso.', responseDto);
  }

  @Get(':id')
  async buscarVinculosPorId(
    @Param('id', ParseIntPipe) tarefaPaiId: number,
  ): Promise<HttpResponse<TarefaResponseDto>> {
    const tarefa =
      await this.tarefaService.findTarefaComSubtarefas(tarefaPaiId);
    const responseDto = plainToInstance(TarefaResponseDto, tarefa, {
      excludeExtraneousValues: true,
    });

    const estatisticas = plainToInstance(
      EstatisticaGeraisDto,
      tarefa.getEstatistica(),
      {
        excludeExtraneousValues: true,
      },
    );

    return new HttpResponse('Vínculos encontrados com sucesso.', {
      ...responseDto,
      estatisticas,
    });
  }

  @Get()
  async getAll(@Query() paginationDto: PaginationDto) {
    return this.tarefaService.fetchTarefas(paginationDto);
  }

  @Patch(':id/iniciar')
  @HttpCode(HttpStatus.OK)
  async iniciar(@Param('id', ParseIntPipe) id: number) {
    const tarefa = await this.tarefaService.iniciarTarefa(id);
    return new HttpResponse('Tarefa iniciada.', tarefa);
  }

  @Patch(':id/concluir')
  @HttpCode(HttpStatus.OK)
  async concluir(@Param('id', ParseIntPipe) id: number) {
    const tarefa = await this.tarefaService.concluirTarefa(id);
    return new HttpResponse('Tarefa concluída.', tarefa);
  }
}
