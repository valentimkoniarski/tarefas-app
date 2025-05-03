import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { translateValidationErrors } from './validation-messages';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const translatedErrors = translateValidationErrors(errors);
        return new BadRequestException(translatedErrors);
      },
    }),
  );

  // Configurando o filtro global de exceções
  //app.useGlobalFilters(new AllExceptionsFilter());

  // const config = new DocumentBuilder()
  //   .setTitle('Tarefas API')
  //   .setDescription('Documentação da API de tarefas')
  //   .setVersion('1.0')
  //   .addBearerAuth() // Caso use autenticação JWT
  //   .build();

  //const document = SwaggerModule.createDocument(app, config);
  //SwaggerModule.setup('api', app, document); // http://localhost:3000/api

  // CORS
  app.enableCors({
    origin: '*', // Permitir todas as origens (ajuste conforme necessário)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
