import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseOutput } from '../response-output';

@Injectable()
export class FormatResponseInterceptor<T>
  implements NestInterceptor<T, ResponseOutput<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseOutput<T>> {
    return next.handle().pipe(
      map((data) => {
        const { statusCode } = context.switchToHttp().getResponse();

        return {
          statusCode,
          success: true,
          data,
        };
      }),
    );
  }
}
