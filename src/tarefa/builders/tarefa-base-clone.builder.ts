import { StatusTarefa } from 'src/core/enums/status.tarefa.enum';
import { Tarefa } from '../entities/tarefa.entity';

export abstract class TarefaBuilder<T extends Tarefa> {
  protected tarefa: T;

  constructor(tarefa: T) {
    this.tarefa = tarefa;
  }

  comTitulo(titulo: string): this {
    this.tarefa.titulo = titulo;
    return this;
  }

  comSubTitulo(subTitulo: string | undefined): this {
    this.tarefa.subTitulo = subTitulo;
    return this;
  }

  comStatus(status: StatusTarefa): this {
    this.tarefa.status = status;
    return this;
  }

  comDataPrazo(dataPrazo: Date | undefined): this {
    this.tarefa.dataPrazo = dataPrazo;
    return this;
  }

  comConcluida(concluida: boolean): this {
    this.tarefa.concluida = concluida;
    return this;
  }

  abstract build(): T;
}
