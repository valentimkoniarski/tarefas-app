import { Body, Controller, Post } from '@nestjs/common';
import { ComentarioService } from './comentario.service';
import { CreateComentarioDto } from './dto/_index';

@Controller('comentarios')
export class ComentarioController {
  constructor(private readonly comentarioService: ComentarioService) {}
  @Post()
  create(@Body() dto: CreateComentarioDto) {
    return this.comentarioService.create(dto);
  }
}
