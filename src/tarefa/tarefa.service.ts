// tarefa.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { PaginationDto } from 'src/core/dto/_index';
import {
  ClonarTarefaDto,
  UpdateTarefaRequestDto,
  CreateTarefaFolhaDto,
  CreateTarefaCompostaDto,
} from './dto/_index';
import { TipoTarefa } from 'src/core/enums/tipo-tarefa.enum';
import { StatusTarefa } from 'src/core/enums/status.tarefa.enum';
import { Tarefa } from './tarefa.entitiy';
@Injectable()
export class TarefaService {
  constructor(
    @InjectRepository(Tarefa)
    private readonly repo: TreeRepository<Tarefa>,
  ) {}

  async criarTarefaSimples(dto: CreateTarefaFolhaDto): Promise<Tarefa> {
    const t = new Tarefa();
    Object.assign(t, {
      titulo: dto.titulo,
      subTitulo: dto.subTitulo,
      status: dto.status,
      tipo: TipoTarefa.FOLHA,
      descricao: dto.descricao,
      prioridade: dto.prioridade,
      pontos: dto.pontos,
      dataPrazo: dto.dataPrazo,
      tempoEstimadoDias: dto.tempoEstimadoDias,
      tipoCalculoPontos: dto.tipoCalculoPontos,
    });
    return this.repo.save(t);
  }

  async criarTarefaComposta(dto: CreateTarefaCompostaDto): Promise<Tarefa> {
    const t = new Tarefa();
    Object.assign(t, {
      titulo: dto.titulo,
      subTitulo: dto.subTitulo,
      tipo: TipoTarefa.COMPOSTA,
      dataPrazo: dto.dataPrazo ? new Date(dto.dataPrazo) : undefined,
      limiteSubtarefas: dto.limiteSubtarefas,
      subtarefas: [],
    });
    return this.repo.save(t);
  }

  async adicionarSubtarefa(
    paiId: number,
    dto: CreateTarefaFolhaDto,
  ): Promise<Tarefa> {
    const pai = await this.repo.findOne({
      where: { id: paiId },
      relations: ['subtarefas'],
    });
    if (!pai || pai.tipo !== TipoTarefa.COMPOSTA) {
      throw new BadRequestException('Só pode adicionar em composta');
    }
    const sub = new Tarefa();
    Object.assign(sub, {
      titulo: dto.titulo,
      subTitulo: dto.subTitulo,
      status: dto.status,
      tipo: TipoTarefa.FOLHA,
      descricao: dto.descricao,
      prioridade: dto.prioridade,
      pontos: dto.pontos,
      dataPrazo: dto.dataPrazo,
      tempoEstimadoDias: dto.tempoEstimadoDias,
      tipoCalculoPontos: dto.tipoCalculoPontos,
      tarefaPai: pai,
    });
    return this.repo.save(sub);
  }

  async iniciarTarefa(id: number): Promise<Tarefa> {
    const t = await this.repo.findOneOrFail({
      where: { id },
      relations: ['subtarefas', 'etapaSequencial'],
    });
    if (t.tipo === TipoTarefa.FOLHA) {
      if (t.status !== StatusTarefa.PENDENTE)
        throw new Error('não pode iniciar');
      t.status = StatusTarefa.EM_ANDAMENTO;
    } else {
      // composta ou pipeline: apenas marca EM_ANDAMENTO
      t.status = StatusTarefa.EM_ANDAMENTO;
    }
    return this.repo.save(t);
  }

  async concluirTarefa(id: number): Promise<Tarefa> {
    const t = await this.repo.findOneOrFail({
      where: { id },
      relations: ['subtarefas', 'etapaSequencial'],
    });
    if (t.tipo === TipoTarefa.FOLHA) {
      if (t.status !== StatusTarefa.EM_ANDAMENTO)
        throw new Error('só conclui em andamento');
      t.status = StatusTarefa.CONCLUIDA;
      t.dataConclusao = new Date();
      t.concluida = true;
    } else if (t.tipo === TipoTarefa.COMPOSTA) {
      const subs = t.subtarefas || [];
      if (subs.some((s) => s.status !== StatusTarefa.CONCLUIDA)) {
        throw new Error('todas subtarefas devem estar concluídas');
      }
      t.status = StatusTarefa.CONCLUIDA;
      t.concluida = true;
    } else {
      // pipeline: delegue a cada etapa...
      throw new Error('concluir pipeline não implementado');
    }
    return this.repo.save(t);
  }

  async clonarTarefa(origemId: number, dto: ClonarTarefaDto): Promise<Tarefa> {
    const raiz = await this.repo.findDescendantsTree(
      await this.repo.findOneOrFail({ where: { id: origemId } }),
    );
    if (!raiz) throw new NotFoundException(`Tarefa ${origemId} não existe`);

    const copia = this.cloneRec(raiz, dto);
    return this.repo.save(copia);
  }

  private cloneRec(orig: Tarefa, mods: ClonarTarefaDto): Tarefa {
    const t = new Tarefa();
    Object.assign(t, {
      titulo: mods.titulo ?? orig.titulo,
      subTitulo: mods.subTitulo ?? orig.subTitulo,
      status: mods.status ?? orig.status,
      tipo: orig.tipo,
      dataPrazo: mods.dataPrazo ?? orig.dataPrazo,
      descricao: orig.descricao,
      prioridade: orig.prioridade,
      pontos: orig.pontos,
      tempoEstimadoDias: orig.tempoEstimadoDias,
      tipoCalculoPontos: orig.tipoCalculoPontos,
      limiteSubtarefas: orig.limiteSubtarefas,
      limiteEtapas: orig.limiteEtapas,
      tarefaPai: undefined,
    });
    // filhos
    if (orig.subtarefas) {
      t.subtarefas = orig.subtarefas.map((ch) => {
        const c = this.cloneRec(ch, {
          titulo: '',
          status: StatusTarefa.PENDENTE
        });
        c.tarefaPai = t;
        return c;
      });
    }
    if (orig.etapaSequencial) {
      t.etapaSequencial = orig.etapaSequencial.map((ch) => {
        const c = this.cloneRec(ch, {
          titulo: '',
          status: StatusTarefa.PENDENTE
        });
        c.tarefaPai = t;
        return c;
      });
    }
    return t;
  }

  async findTarefaComSubtarefas(id: number): Promise<Tarefa> {
    const t = await this.repo.findOne({ where: { id } });
    if (!t) throw new NotFoundException(`Tarefa ${id} não existe`);
    return this.repo.findDescendantsTree(t);
  }

  async removerTarefa(id: number): Promise<void> {
    const t = await this.repo.findOneOrFail({ where: { id } });
    await this.repo.remove(t);
  }

  async atualizarTarefa(
    id: number,
    dto: UpdateTarefaRequestDto,
  ): Promise<Tarefa> {
    const t = await this.repo.findOneOrFail({
      where: { id },
      relations: ['subtarefas', 'etapaSequencial'],
    });
    Object.assign(t, dto);
    // se mudou status, trate dataConclusao
    if (dto.status === StatusTarefa.CONCLUIDA && t.tipo === TipoTarefa.FOLHA) {
      t.dataConclusao = new Date();
      t.concluida = true;
    }
    return this.repo.save(t);
  }

  async fetchTarefas(p: PaginationDto) {
    const all = await this.repo.findTrees();
    const roots = all.filter((t) => t.tipo === TipoTarefa.COMPOSTA);
    const total = roots.length;
    const start = (p.page - 1) * p.pageSize;
    return {
      data: roots.slice(start, start + p.pageSize),
      total,
      page: p.page,
      pageSize: p.pageSize,
    };
  }
}
