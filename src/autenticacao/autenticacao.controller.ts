import { Controller, Post, Body } from '@nestjs/common';
import { AutenticacaoService } from './autenticacao.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('autenticacao')
export class AutenticacaoController {
  constructor(private readonly autenticacaoService: AutenticacaoService) {}

  @Post('login')
  async entrar(@Body() dados: LoginDto) {
    return this.autenticacaoService.login(dados.email, dados.senha);
  }

  @Post('renovar-token')
  renovar(@Body() dados: RefreshTokenDto) {
    return this.autenticacaoService.renovarToken(dados.tokenAtualizacao);
  }
}
