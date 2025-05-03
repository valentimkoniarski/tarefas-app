import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TarefaModule } from './tarefa/tarefa.module';
import { UsuarioModule } from './usuario/usuario.module';

import { Usuario } from './usuario/usuario.entity';
import { Tarefa } from './tarefa/tarefa.entity';
import { Comentario } from './comentario/comentario.entity';
import { Historico } from './historico/entities/historico/historico';
import { Etiqueta } from './etiqueta/entities/etiqueta/etiqueta';
import { AutenticacaoModule } from './autenticacao/autenticacao.module';
import { ComentarioModule } from './comentario/comentario.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: parseInt('5432'),
      username: 'postgres',
      password: 'v123',
      database: 'postgres',
      entities: [Usuario, Comentario, Tarefa, Historico, Etiqueta, Comentario],
      synchronize: true, // Apenas para dev
    }),
    TarefaModule,
    UsuarioModule,
    AutenticacaoModule,
    ComentarioModule,
  ],
})
export class AppModule {}
