import { Repository } from 'typeorm';
import { Comentario } from './comentario.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/usuario/usuario.entity';
import { Tarefa } from 'src/tarefa/tarefa.entity';
import { CreateComentarioDto } from './dto/_index';

@Injectable()
export class ComentarioService {
  constructor(
    @InjectRepository(Comentario)
    private comentarioRepository: Repository<Comentario>,
  ) {}

  async create(dto: CreateComentarioDto): Promise<void> {
    const comentario = this.comentarioRepository.create({
      ...dto,
      autor: { id: dto.autor } as Usuario,
      tarefa: { id: dto.tarefa } as Tarefa,
    });
    await this.comentarioRepository.save(comentario);
  }

  async remove(id: number): Promise<void> {
    await this.comentarioRepository.delete(id);
  }
}
