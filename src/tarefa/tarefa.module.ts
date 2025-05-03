import { Module } from '@nestjs/common';
import { Tarefa } from './tarefa.entity';
import { TarefaController } from './tarefa.controller';
import { TarefaService } from './tarefa.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Tarefa])],
  controllers: [TarefaController],
  providers: [TarefaService],
})
export class TarefaModule {}
