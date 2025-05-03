import { Usuario } from './usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateUsuarioDto,
  ResponseUsuarioDto,
  UpdateUsuarioDto,
} from '../usuario/dto/_index';
import { ResponsePageUsuarioDto } from './dto/response-page-usuario.dto';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async create(dto: CreateUsuarioDto): Promise<Usuario> {
    const senhaCriptografada = await bcrypt.hash(dto.senha, 10);
    dto.senha = senhaCriptografada;
    const usuario = this.usuarioRepository.create(dto);
    return this.usuarioRepository.save(usuario);
  }

  async update(id: string, dto: UpdateUsuarioDto): Promise<void> {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }
    Object.assign(usuario, dto);
    await this.usuarioRepository.save(usuario);
  }

  async findAll({
    page = 0,
    limit = 20,
    termo,
  }: {
    page?: number;
    limit?: number;
    termo?: string;
  }): Promise<ResponsePageUsuarioDto> {
    const [usuarios, total] = await this.usuarioRepository.findAndCount({
      take: limit,
      skip: Math.max((page - 1) * limit, 0),
      order: {
        nome: 'ASC',
      },
      where: termo
        ? {
            nome: ILike(`%${termo}%`),
          }
        : {},
    });

    const usuariosTransformados = plainToInstance(
      ResponseUsuarioDto,
      usuarios,
      {
        excludeExtraneousValues: true,
      },
    );

    return {
      data: usuariosTransformados,
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  async findOne(id: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return usuario;
  }

  async findByEmail(email: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOneBy({ email });
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return usuario;
  }

  async delete(id: string): Promise<void> {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }
    await this.usuarioRepository.remove(usuario);
  }
}
