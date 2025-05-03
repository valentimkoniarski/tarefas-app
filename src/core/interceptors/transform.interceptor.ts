import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Observable, map } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private readonly dto: Type<unknown>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        console.log('TransformInterceptor data:', data);

        if (Array.isArray(data)) {
          return plainToInstance(this.dto, data, {
            excludeExtraneousValues: true,
          });
        } else if (data?.data && Array.isArray(data.data)) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return {
            ...data,
            data: plainToInstance(this.dto, data.data, {
              excludeExtraneousValues: true,
            }),
          };
        } else {
          return plainToInstance(this.dto, data, {
            excludeExtraneousValues: true,
          });
        }
      }),
    );
  }
}
