import { AuthService } from './auth.service';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();  // OBTAIN TOKEN FROM AUTH SERVICE

  // VERIFY IF TOKEN IS PRESENT
  if (token) {
    console.log('Token obtenido:', token);

    // ClLONE THE REQUEST AND ADD THE TOKEN TO THE HEADER
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`  // ADD TOKEN TO THE HEADER
      }
    });

    // PASS THE CLONED REQUEST TO THE NEXT INTERCEPTOR (OR BACKEND)
    return next(clonedReq);
  }

  // IF NO TOKEN IS FOUND, CONTINUE WITHOUT THE AUTHORIZATION HEADER
  console.log('No se encontró token, continuando sin Authorization header');
  return next(req);
};
