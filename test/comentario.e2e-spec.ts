// test/comentario.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ComentarioModule } from './../src/comentario/comentario.module';
import { UsuarioModule } from '../src/usuario/usuario.module';
import { TarefaModule } from '../src/tarefa/tarefa.module';
import { TypeOrmTestingModule } from './typeorm-mem.module';
import * as request from 'supertest';
import { UsuarioService } from '../src/usuario/usuario.service';
import { App } from 'supertest/types';

describe('ComentarioController (e2e)', () => {
  let app: INestApplication;
  let usuarioService: UsuarioService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmTestingModule,
        ComentarioModule,
        UsuarioModule,
        TarefaModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    usuarioService = moduleFixture.get<UsuarioService>(UsuarioService);

    // Aqui você pode inserir um usuário e uma tarefa para usar nos testes
  });

  it('/comentarios (POST)', async () => {
    await request(app.getHttpServer() as unknown as App)
      .post('/usuarios')
      .send({
        nome: 'Usuario Teste',
        email: 'teste@gmail.com',
        senha: 'senha123',
        perfil: 'ADMIN',
      })
      .expect(201);

    const usuario = await usuarioService.findByEmail('teste@gmail.com');

    const tarefa = await request(app.getHttpServer() as unknown as App)
      .post('/tarefas')
      .send({
        titulo: 'Implementar autenticação',
        descricao: 'Desenvolver login e registro com JWT',
        status: 'EM_ANDAMENTO',
        prioridade: 'ALTA',
        prazo: '2025-05-15T23:59:59.000Z',
        autor: usuario.id,
        responsavel: usuario.id,
      });

    await request(app.getHttpServer() as unknown as App)
      .post('/comentarios')
      .send({
        texto: 'Meus parabéns meu confederado',
        data: '2025-05-15T23:59:59.000Z',
        autor: usuario.id,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        tarefa: tarefa.body.id,
      })
      .expect(201);

    //expect(response.body).toMatchObject({});
  });

  afterAll(async () => {
    await app.close();
  });
});
