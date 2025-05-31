import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { TokenService } from '../services/token-service';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

const AUTH_URL = 'https://www.easysalespruebas.com.co/API_Proy_Facturacion/api/WS_FAC_01_Controller/WSFAC001';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url === AUTH_URL) {
    return next(req);
  }
  const tokenService = inject(TokenService);
  return from(tokenService.getToken()).pipe(
    switchMap(token => {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next(authReq);
    })
  );
};