// jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PayloadJwt } from './payload.interface';

@Injectable()
export class JwtEstrategia extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // esta linha está OK
      secretOrKey: process.env.JWT_SEGREDO || 'jwt_secret_key',
    });
  }

  validate(payload: PayloadJwt) {
    return { id: payload.sub, email: payload.email };
  }
}
