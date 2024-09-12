import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError,tap } from 'rxjs/operators';


interface LoginResponse {
  token: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';
  private userApiUrl = 'http://localhost:8080/api/user';
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient, private router: Router) {}

  getData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/`);
  }

  postData(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/`, data);
  }

  login(nickname: string, password: string): Observable<LoginResponse> {
    console.log('Enviando datos al servidor:', { nickname, password });

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { nickname, password }).pipe(
      tap((response: LoginResponse) => {
        console.log('Respuesta recibida del servidor:', response);

        // Guardar el token y el userId en localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId);
        localStorage.setItem('nickname', nickname);  // Guardar el nickname del usuario
        this.loggedIn.next(true);  // Actualizar el estado de autenticación
      }),
      catchError((error) => {
        console.error('Error recibido del servidor:', error);
        return throwError(() => new Error(error.error?.error || 'Error inesperado durante el inicio de sesión.'));
      })
    );
}

getUserData(): Observable<any> {
  const userId = this.getUserId();
  if (!userId) {
    return throwError(() => new Error('No se encontró el ID de usuario.'));
  }

  return this.http.get<any>(`${this.userApiUrl}/profile/${userId}`);  // Asegúrate de que esta URL devuelva los datos correctos
}

  // Enviar enlace para restablecer contraseña
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  // Cambiar contraseña
  changePassword(nickname: string, oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, { nickname, oldPassword, newPassword });
  }

  // Restablecer contraseña con token
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, newPassword });
  }

  // Renovar token de autenticación
  refreshToken(): Observable<any> {
    return this.http.post(`${this.apiUrl}/refresh-token`, {});
  }

  register(nickname: string, name: string, lastname: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { nickname, name, lastname, email, password }).pipe(
      tap(() => {
        console.log('Usuario registrado correctamente');
      }),
      catchError((error) => {
        console.error('Error durante el registro:', error);
        // Manejo de errores específicos
        if (error.status === 400 && error.error) {
          if (error.error.error === 'El nickname ya está en uso.') {
            return throwError(() => new Error('El nickname ya está en uso.'));
          } else if (error.error.error === 'El email ya está en uso.') {
            return throwError(() => new Error('El email ya está en uso.'));
          }
        }
        return throwError(() => new Error('Error inesperado al registrarse. Intente nuevamente.'));
      })
    );
  }

  //Verify if nickname are available
  checkNicknameAvailability(nickname: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.userApiUrl}/check-nickname`, { params: { nickname } });
  }

  //Verify if email are available
  checkEmailAvailability(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.userApiUrl}/check-email`, { params: { email } });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('nickname');  // Eliminar el nickname del localStorage
    this.loggedIn.next(false);  // Actualizar el estado de autenticación
    this.router.navigate(['/']);  // Redirigir al Inicio
  }

  // Check if the user is logged in
  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }
  // Check if token exists
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  // Get the token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Get the user ID
  getUserId(): string | null {
    const userId = localStorage.getItem('userId');
    return userId ? userId : null;
  }
}
