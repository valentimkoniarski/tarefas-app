// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsuarioModule } from '../usuario/usuario.module';
import { AutenticacaoController } from './autenticacao.controller';
import { AutenticacaoService } from './autenticacao.service';
import { JwtEstrategia } from './jwt.strategy';

@Module({
  imports: [
    UsuarioModule,
    PassportModule,
    JwtModule.register({
      secret: 'jwt_secret_key', // use variável de ambiente na prática
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AutenticacaoController],
  providers: [AutenticacaoService, JwtEstrategia],
})
export class AutenticacaoModule {}
