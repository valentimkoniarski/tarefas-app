import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Put,
} from '@nestjs/common';
import { TarefaService } from './tarefa.service';
import { CreateTarefaDto, UpdateTarefaDto } from './dto/_index';

@Controller('tarefas')
export class TarefaController {
  constructor(private readonly tarefaService: TarefaService) {}
  @Post()
  create(@Body() dto: CreateTarefaDto) {
    return this.tarefaService.create(dto);
  }

  @Get()
  //@Representacao(ResponseTarefaDto)
  findAll() {
    return this.tarefaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tarefaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTarefaDto) {
    return this.tarefaService.updateTarefa(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tarefaService.remove(id);
  }

  @Put(':id/marcar-como-completa')
  marcarComoCompleta(@Param('id') id: string) {
    return this.tarefaService.marcarComoCompleta(id);
  }
}
