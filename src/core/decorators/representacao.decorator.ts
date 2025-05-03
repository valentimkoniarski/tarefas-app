import { applyDecorators, UseInterceptors, Type } from '@nestjs/common';
import { SerializeOptions } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { TransformInterceptor } from '../interceptors/transform.interceptor';

export function Representacao(dto: Type<unknown>) {
  return applyDecorators(
    UseInterceptors(new TransformInterceptor(dto)),
    SerializeOptions({ strategy: 'excludeAll' }),
    ApiOkResponse({ type: dto }),
  );
}

export function RepresentacaoLista(dto: Type<unknown>) {
  return applyDecorators(
    UseInterceptors(new TransformInterceptor(dto)),
    SerializeOptions({ strategy: 'excludeAll' }),
    ApiOkResponse({ type: [dto] }),
  );
}
