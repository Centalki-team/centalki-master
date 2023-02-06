import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const { headers, body, query, params, method, originalUrl } = request;
    console.log('[*] Context');
    console.log({ method, originalUrl });
    console.log({ headers });
    console.log({ body });
    console.log({ query });
    console.log({ params });

    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(`${method} - ${originalUrl} - ${Date.now() - now}ms`),
        ),
      );
  }
}
