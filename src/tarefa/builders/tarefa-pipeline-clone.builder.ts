import { TarefaPipeline } from '../entities/tarefa.pipeline.entity';

export class TarefaPipelineBuilder {
  private readonly tarefa = new TarefaPipeline();

  comTitulo(titulo: string) {
    this.tarefa.titulo = titulo;
    return this;
  }

  comSubTitulo(sub: string | undefined) {
    this.tarefa.subTitulo = sub;
    return this;
  }

  comStatus(status: any) {
    this.tarefa.status = status;
    return this;
  }

  comDataPrazo(data?: Date) {
    this.tarefa.dataPrazo = data;
    return this;
  }

  comLimiteEtapas(limite?: number) {
    this.tarefa.limiteEtapas = limite;
    return this;
  }

  comEtapaSequencial(etapas: TarefaPipeline['etapaSequencial']) {
    this.tarefa.etapaSequencial = etapas;
    return this;
  }

  build(): TarefaPipeline {
    return this.tarefa;
  }
}