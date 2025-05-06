import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { Tarefa } from './entities/tarefa.entity';
import {
  CreateTarefaCompostaDto,
  CreateTarefaFolhaDto,
} from './dto/create-tarefa-request.dto';
import { UpdateTarefaRequestDto } from './dto/update-tarefa-request.dto';
import { StatusTarefa } from 'src/core/enums/status.tarefa.enum';
import { TarefaFolhaBuilder } from './builders/tarefa-folha-clone.builder';
import { TarefaCompostaBuilder } from './builders/tarefa-composta-clone.builder';
import { TarefaComposta } from './entities/tarefa.composta.entity';
import { TarefaFolha } from './entities/tarefa.folha.entity';
import { PaginationDto } from 'src/core/dto/pagination.dto';
import { PaginationResponseDto } from 'src/core/dto/pagination-response.dto';
import { ClonarTarefaDto } from './dto/clonar-tarefa-request.dto';

@Injectable()
export class TarefaService {
  constructor(
    @InjectRepository(Tarefa)
    private readonly tarefaRepository: TreeRepository<Tarefa>,
  ) {}

  async criarTarefaSimples(dto: CreateTarefaFolhaDto): Promise<Tarefa> {
    const tarefaFolha = new TarefaFolhaBuilder()
      .comTitulo(dto.titulo)
      .comSubTitulo(dto.subTitulo)
      .comDescricao(dto.descricao)
      .comStatus(dto.status)
      .comPrioridade(dto.prioridade)
      .comPontos(dto.pontos)
      .comDataPrazo(dto.dataPrazo)
      .comTempoEstimadoDias(dto.tempoEstimadoDias)
      .build();

    return this.tarefaRepository.save(tarefaFolha);
  }

  async criarTarefaComposta(
    dto: CreateTarefaCompostaDto,
  ): Promise<TarefaComposta> {
    const tarefa = new TarefaCompostaBuilder()
      .comTitulo(dto.titulo)
      .comSubTitulo(dto.subTitulo)
      .comDataPrazo(dto.dataPrazo ? new Date(dto.dataPrazo) : undefined)
      .build();

    return this.tarefaRepository.save(tarefa);
  }

  async adicionarSubtarefa(
    tarefaPaiId: number,
    dto: CreateTarefaFolhaDto,
  ): Promise<Tarefa> {
    const tarefaPai = await this.tarefaRepository.findOne({
      where: { id: tarefaPaiId },
      relations: ['subtarefas'],
    });

    if (!(tarefaPai instanceof TarefaComposta)) {
      throw new BadRequestException('A tarefa pai deve ser composta');
    }

    const folha = new TarefaFolhaBuilder()
      .comTitulo(dto.titulo)
      .comSubTitulo(dto.subTitulo)
      .comDescricao(dto.descricao)
      .comStatus(dto.status)
      .comPrioridade(dto.prioridade)
      .comPontos(dto.pontos)
      .comDataPrazo(dto.dataPrazo)
      .comTempoEstimadoDias(dto.tempoEstimadoDias)
      .build();

    if (!(folha instanceof TarefaFolha)) {
      throw new InternalServerErrorException('Erro ao construir tarefa folha');
    }

    folha.tarefaPai = tarefaPai as Tarefa;
    return await this.tarefaRepository.save(folha);
  }

  async clonarTarefa(origemId: number, dto: ClonarTarefaDto): Promise<Tarefa> {
    const raiz = await this.tarefaRepository.findDescendantsTree(
      await this.tarefaRepository.findOneOrFail({ where: { id: origemId } }),
    );

    if (!raiz) {
      throw new NotFoundException(`Tarefa ${origemId} não encontrada`);
    }

    const modificacoes: ClonarTarefaDto = {
      titulo: dto.titulo,
      subTitulo: dto.subTitulo,
      dataPrazo: dto.dataPrazo,
      status: StatusTarefa.PENDENTE,
    };

    const clone = raiz.cloneComModificacoes(modificacoes);
    return this.tarefaRepository.save(clone);
  }

  async findTarefaComSubtarefas(id: number): Promise<Tarefa> {
    const tarefa = await this.tarefaRepository.findOne({ where: { id } });

    if (!tarefa) {
      throw new NotFoundException(`Tarefa ${id} não encontrada`);
    }

    const tarefafind = (await this.tarefaRepository.findDescendantsTree(
      tarefa,
    )) as TarefaComposta;

    return tarefafind;
  }

  async removerTarefa(id: number): Promise<Tarefa> {
    const tarefa = await this.tarefaRepository.findOneOrFail({
      where: { id },
    });

    return await this.tarefaRepository.remove(tarefa);
  }

  async atualizarTarefa(
    id: number,
    updateTarefaDto: UpdateTarefaRequestDto,
  ): Promise<Tarefa> {
    const tarefa = await this.tarefaRepository.findOneOrFail({
      where: { id },
      relations: ['tarefaPai', 'subtarefas'],
    });

    Object.assign(tarefa, updateTarefaDto);

    if (
      updateTarefaDto.status === StatusTarefa.CONCLUIDA &&
      !updateTarefaDto.dataConclusao
    ) {
      throw new BadRequestException(
        'Data de conclusão é obrigatória quando o status é Concluída',
      );
    }

    if (
      (updateTarefaDto.status === StatusTarefa.EM_ANDAMENTO ||
        updateTarefaDto.status === StatusTarefa.PENDENTE) &&
      updateTarefaDto.dataConclusao
    ) {
      throw new BadRequestException(
        'Não é permitido definir a data de conclusão para status "Em Andamento" ou "Pendente"',
      );
    }

    await this.tarefaRepository.save(tarefa);

    return tarefa;
  }

  // Todo: Refatorar
  async fetchTarefas(paginationDto: PaginationDto) {
    const allTrees = await this.tarefaRepository.findTrees();

    const composedRoots = allTrees.filter(
      (t): t is TarefaComposta => t instanceof TarefaComposta,
    );

    const { page, pageSize } = paginationDto;
    const total = composedRoots.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pageData = composedRoots.slice(start, end);

    return new PaginationResponseDto<Tarefa>(pageData, total, page, pageSize);
  }
}
