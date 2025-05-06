import { EstrategiaPontosFolha } from '../strategies/estrategia-pontos-folha.interface';
import { PontosFixoStrategy } from '../strategies/pontos-fixo.strategy';
import { PontosPorPrioridadeStrategy } from '../strategies/pontos-por-prioridade.strategy';
import { PontosPorTempoStrategy } from '../strategies/pontos-por-tempo.strategy';

export enum TipoCalculoPontosFolha {
  FIXO = 'FIXO',
  POR_TEMPO = 'POR_TEMPO',
  POR_PRIORIDADE = 'POR_PRIORIDADE',
}

export class PontosFolhaStrategyFactory {
  static getStrategy(tipo: TipoCalculoPontosFolha): EstrategiaPontosFolha {
    switch (tipo) {
      case TipoCalculoPontosFolha.POR_TEMPO:
        return new PontosPorTempoStrategy();
      case TipoCalculoPontosFolha.POR_PRIORIDADE:
        return new PontosPorPrioridadeStrategy();
      case TipoCalculoPontosFolha.FIXO:
      default:
        return new PontosFixoStrategy();
    }
  }
}
