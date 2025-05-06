export class HttpResponse<T> {
  mensagem: string;
  dados: T;

  constructor(mensagem: string, dados: T) {
    this.mensagem = mensagem;
    this.dados = dados;
  }
}
