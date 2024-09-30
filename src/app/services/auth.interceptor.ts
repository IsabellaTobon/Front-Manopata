import { AuthService } from './auth.service';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();  // Obtener el token desde el AuthService

  // Verificar si se obtuvo un token
  if (token) {
    console.log('Token obtenido:', token);  // Para debug: Imprimir el token en consola

    // Clonar la solicitud y añadir el encabezado Authorization
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`  // Agregar el token al header de la solicitud
      }
    });

    // Pasar la solicitud clonada al siguiente interceptor (o al backend)
    return next(clonedReq);
  }

  // Si no hay token, proceder con la solicitud original sin modificar
  console.log('No se encontró token, continuando sin Authorization header');
  return next(req);
};
