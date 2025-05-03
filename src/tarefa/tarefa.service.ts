import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { CreateTarefaDto, UpdateTarefaDto } from './dto/_index';
import {
  Tarefa,
  TarefaComponente,
  TarefaComposta,
  TarefaFolha,
} from './tarefa.entity';

@Injectable()
export class TarefaService {
  constructor(
    @InjectRepository(Tarefa)
    private tarefaRepository: Repository<Tarefa>,
  ) {}
  private async toTarefaComponente(
    tarefa: Tarefa,
    manager: EntityManager,
  ): Promise<TarefaComponente> {
    if (!tarefa.subTarefas || tarefa.subTarefas.length === 0) {
      return new TarefaFolha(tarefa);
    }

    const subTarefas = await Promise.all(
      tarefa.subTarefas.map((subTarefa) =>
        this.toTarefaComponente(subTarefa, manager),
      ),
    );
    return new TarefaComposta(tarefa, subTarefas);
  }

  async marcarComoCompleta(tarefaId: string): Promise<void> {
    await this.tarefaRepository.manager.transaction(
      async (manager: EntityManager) => {
        const tarefa = await manager
          .createQueryBuilder(Tarefa, 'tarefa')
          .leftJoinAndSelect('tarefa.subTarefas', 'subTarefas')
          .where('tarefa.id = :id', { id: tarefaId })
          .getOneOrFail();

        const tarefaComponente = await this.toTarefaComponente(tarefa, manager);
        await tarefaComponente.marcarComoCompleta(manager);

        if (tarefaComponente instanceof TarefaComposta) {
          const subTarefas = tarefaComponente.getSubTarefas();

          console.log('subTarefas', subTarefas);
        }
      },
    );
  }

  async getProgresso(tarefaId: string): Promise<number> {
    const tarefa = await this.tarefaRepository
      .createQueryBuilder('tarefa')
      .leftJoinAndSelect('tarefa.subTarefas', 'subTarefas')
      .where('tarefa.id = :id', { id: tarefaId })
      .getOneOrFail();

    const tarefaComponente = await this.toTarefaComponente(
      tarefa,
      this.tarefaRepository.manager,
    );
    return tarefaComponente.getProgresso();
  }

  // Obtém estatísticas da tarefa
  async getEstatisticas(
    tarefaId: string,
  ): Promise<{ total: number; completed: number }> {
    const tarefa = await this.tarefaRepository
      .createQueryBuilder('tarefa')
      .leftJoinAndSelect('tarefa.subTarefas', 'subTarefas')
      .where('tarefa.id = :id', { id: tarefaId })
      .getOneOrFail();

    const tarefaComponente = await this.toTarefaComponente(
      tarefa,
      this.tarefaRepository.manager,
    );
    return tarefaComponente.getEstatisticas();
  }

  findAll() {
    return this.tarefaRepository.find({
      relations: ['tarefaPai'],
    });
  }

  async updateTarefa(
    tarefaId: string,
    dados: UpdateTarefaDto,
    propagar: boolean = false,
  ): Promise<Tarefa> {
    return this.tarefaRepository.manager.transaction(
      async (manager: EntityManager) => {
        const tarefa = await manager
          .createQueryBuilder(Tarefa, 'tarefa')
          .leftJoinAndSelect('tarefa.subTarefas', 'subTarefas')
          .leftJoinAndSelect('tarefa.dependencias', 'dependencias')
          .where('tarefa.id = :id', { id: tarefaId })
          .getOneOrFail();

        const tarefaComponente = await this.toTarefaComponente(tarefa, manager);
        const dadosAtualizados = {
          ...dados,
          prazo: dados.prazo ? new Date(dados.prazo) : undefined,
        };
        await tarefaComponente.atualizar(manager, dadosAtualizados, propagar);
        return tarefa;
      },
    );
  }

  async create(dto: CreateTarefaDto): Promise<void> {
    const tarefa = this.tarefaRepository.create({
      ...dto,
      autor: dto.autorId ? { id: dto.autorId } : undefined,
      responsavel: dto.responsavelId ? { id: dto.responsavelId } : undefined,
      tarefaPai: dto.tarefaPaiId ? { id: dto.tarefaPaiId } : undefined,
      etiquetas: dto.etiquetas?.map((id: string) => ({ id })) || undefined,
      dependencias:
        dto.dependencias?.map((id: string) => ({ id })) || undefined,
    });

    await this.tarefaRepository.save(tarefa);
  }

  async findOne(id: string) {
    const tarefa = await this.tarefaRepository.findOne({ where: { id } });
    if (!tarefa) throw new NotFoundException('Tarefa não encontrada');
    return tarefa;
  }

  async update(id: string, dto: UpdateTarefaDto) {
    const tarefa = await this.findOne(id);
    Object.assign(tarefa, dto);
    return this.tarefaRepository.save(tarefa);
  }

  async remove(id: string) {
    const tarefa = await this.findOne(id);
    return this.tarefaRepository.remove(tarefa);
  }
}
