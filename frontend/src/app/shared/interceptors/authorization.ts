import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!req.headers.get('auth-token') && this.authService.getToken()) {
      return next.handle(
        req.clone({
          headers: req.headers.set(
            'auth-token',
            this.authService.getToken() || ''
          ),
        })
      );
    }

    return next.handle(req);
  }
}
