import { Module } from '@nestjs/common';
import { Tarefa } from './entities/tarefa.entity';
import { TarefaController } from './tarefa.controller';
import { TarefaService } from './tarefa.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TarefaSubscriber } from './tarefa.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([Tarefa])],
  controllers: [TarefaController],
  providers: [TarefaService, TarefaSubscriber],
})
export class TarefaModule {}
