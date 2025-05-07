import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TarefaModule } from './tarefa/tarefa.module';

import { Tarefa } from './tarefa/tarefa.entity';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'v123',
  database: process.env.DB_NAME || 'postgres',
  entities: [Tarefa],
  synchronize: true,
  //logging: process.env.NODE_ENV !== 'production',
  //migrations: ['dist/migrations/*.js'],
});

@Module({
  imports: [TypeOrmModule.forRoot(AppDataSource.options), TarefaModule],
})
export class AppModule {}
