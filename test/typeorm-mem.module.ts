// src/test-utils/typeorm-mem.module.ts
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comentario } from '../src/comentario/comentario.entity';
import { Usuario } from '../src/usuario/usuario.entity';
import { Tarefa } from '../src/tarefa/entities/tarefa.entity';
import { Historico } from '../src/historico/entities/historico/historico';
import { Etiqueta } from '../src/etiqueta/entities/etiqueta/etiqueta';

export const TypeOrmTestingModule = TypeOrmModule.forRoot({
  type: 'sqlite',
  database: 'test.sqlite',
  dropSchema: true,
  entities: [Comentario, Usuario, Tarefa, Historico, Etiqueta],
  synchronize: true,
  logging: false,
});
