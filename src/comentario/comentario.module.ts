import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comentario } from './comentario.entity';
import { ComentarioController } from './comentario.controller';
import { ComentarioService } from './comentario.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comentario])],
  controllers: [ComentarioController],
  providers: [ComentarioService],
})
export class ComentarioModule {}
