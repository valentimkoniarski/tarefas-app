import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TarefaModule } from './tarefa/tarefa.module';

import { Tarefa } from './tarefa/entities/tarefa.entity';
import { TarefaComposta } from './tarefa/entities/tarefa.composta.entity';
import { TarefaFolha } from './tarefa/entities/tarefa.folha.entity';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'v123',
  database: process.env.DB_NAME || 'postgres',
  entities: [Tarefa, TarefaComposta, TarefaFolha],
  synchronize: true,
  //logging: process.env.NODE_ENV !== 'production',
  //migrations: ['dist/migrations/*.js'],
});

@Module({
  imports: [TypeOrmModule.forRoot(AppDataSource.options), TarefaModule],
})
export class AppModule {}
