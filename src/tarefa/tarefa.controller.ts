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
  CreateTarefaCompostaDto,
  CreateTarefaFolhaDto,
  UpdateTarefaRequestDto,
} from './dto/requests/_index';
import { TarefaResponseDto } from './dto/responses/tarefa-response.dto';
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

    return new HttpResponse('Vínculos encontrados com sucesso.', responseDto);
  }

  @Get()
  async getAll(@Query() paginationDto: PaginationDto) {
    return this.tarefaService.fetchTarefas(paginationDto);
  }
}
