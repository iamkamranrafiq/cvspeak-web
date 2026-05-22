import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { SessionService } from '../services/session.service';

export const sessionTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const session = inject(SessionService);
  const token   = session.token;

  const cloned = token
    ? req.clone({ setHeaders: { 'X-Session-Token': token } })
    : req;

  return next(cloned).pipe(
    tap(event => {
      // capture token rotation from response headers
      if ('headers' in event) {
        const newToken = (event as any).headers?.get?.('X-Session-Token');
        if (newToken && newToken !== token) session.token = newToken;
      }
    })
  );
};
