import { AuthService } from './auth.service';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();  // Obtener el token desde el AuthService

  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`  // Agregar el token en el header
      }
    });
    return next(clonedReq);
  }

  return next(req);  // Continuar sin token si no está disponible
};
