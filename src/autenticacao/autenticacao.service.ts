// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../usuario/usuario.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AutenticacaoService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
  ) {}

  async validarUsuario(email: string, senha: string) {
    const usuario = await this.usuarioService.findByEmail(email);
    if (usuario && (await bcrypt.compare(senha, usuario.senha))) {
      console.log('Senha correta');

      return usuario;
    }
    return null;
  }

  gerarTokens(usuario: { id: string; email: string }) {
    const payload = { sub: usuario.id, email: usuario.email };

    const tokenAcesso = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const tokenAtualizacao = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      tokenAcesso,
      tokenAtualizacao,
    };
  }

  async login(email: string, senha: string) {
    const usuario = await this.validarUsuario(email, senha);

    if (!usuario) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return this.gerarTokens({ id: usuario.id, email: usuario.email });
  }

  renovarToken(tokenAtualizacao: string) {
    try {
      const payload = this.jwtService.verify<{ sub: string; email: string }>(
        tokenAtualizacao,
      );
      return this.gerarTokens({ id: payload.sub, email: payload.email });
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
