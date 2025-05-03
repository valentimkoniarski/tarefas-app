// filepath: c:\development\tarefas-app\src\common\errors\dependencias-nao-concluidas.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class DependenciasNaoConcluidasException extends HttpException {
  constructor() {
    super(
      'Não é possível atualizar status: dependências não concluídas',
      HttpStatus.BAD_REQUEST,
    );
  }
}
