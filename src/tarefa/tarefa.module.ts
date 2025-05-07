import { Module } from '@nestjs/common';
import { TarefaController } from './tarefa.controller';
import { TarefaService } from './tarefa.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tarefa } from './tarefa.entitiy';

@Module({
  imports: [TypeOrmModule.forFeature([Tarefa])],
  controllers: [TarefaController],
  providers: [TarefaService],
})
export class TarefaModule {}
