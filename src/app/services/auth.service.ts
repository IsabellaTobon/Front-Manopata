import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

interface LoginResponse {
  token: string;
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';
  private userApiUrl = 'http://localhost:8080/api/user';
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  profileImageChanged$ = new BehaviorSubject<string>('http://localhost:8080/images/default-image.webp');

  constructor(private http: HttpClient, private router: Router) {}

  // Inicio de sesión
  login(nickname: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, { nickname, password })
      .pipe(
        tap((response: LoginResponse) => {
          if (response.userId) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.userId);
            localStorage.setItem('nickname', nickname);
            this.loggedIn.next(true);
          } else {
            console.error('userId is missing in the login response.');
          }
        }),
        catchError((error) => {
          return throwError(() => new Error(error.error?.error || 'Error inesperado durante el inicio de sesión.'));
        })
      );
  }

  // Método para solicitar el restablecimiento de contraseña
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email }).pipe(
      tap(() => console.log('Enlace de restablecimiento de contraseña enviado')),
      catchError((error) => throwError(() => new Error('Error al enviar el enlace de restablecimiento de contraseña.')))
    );
  }

  // Cambiar contraseña
  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    const nickname = localStorage.getItem('nickname');
    return this.http
      .post(`${this.apiUrl}/change-password`, { nickname, oldPassword, newPassword })
      .pipe(
        tap(() => console.log('Contraseña cambiada correctamente')),
        catchError((error) => throwError(() => new Error('Error al cambiar la contraseña.')))
      );
  }

  // Restablecer contraseña con token
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/reset-password`, { token, newPassword })
      .pipe(
        tap(() => console.log('Contraseña restablecida correctamente')),
        catchError((error) => throwError(() => new Error('Error al restablecer la contraseña.')))
      );
  }

  // Actualizar perfil del usuario
  updateUserProfile(userData: any): Observable<any> {
    const userId = this.getUserId();
    return this.http.put(`${this.userApiUrl}/${userId}`, userData).pipe(
      tap(() => console.log('Perfil actualizado')),
      catchError((error) => throwError(() => new Error('Error al actualizar el perfil.')))
    );
  }

  // Actualizar imagen de perfil
  updateProfileImage(imageFile: File): Observable<any> {
    const userId = this.getUserId();
    const formData = new FormData();
    formData.append('image', imageFile);

    return this.http.put(`${this.userApiUrl}/${userId}/profile-image`, formData).pipe(
      tap((response: any) => {
        const newImageUrl = `http://localhost:8080/images/${response.fileName}`;
        this.profileImageChanged$.next(newImageUrl);  // Actualizar la nueva URL de la imagen de perfil
      }),
      catchError((error) => throwError(() => new Error('Error al actualizar la imagen de perfil.')))
    );
  }

  // Desactivar cuenta del usuario
  deactivateAccount(password: string): Observable<any> {
    return this.http.post(`${this.userApiUrl}/deactivate-account`, { password }).pipe(
      tap(() => console.log('Cuenta desactivada')),
      catchError((error) => throwError(() => new Error('Error al desactivar la cuenta.')))
    );
}

  // Actualizar token JWT
  refreshToken(): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/refresh-token`, {}).pipe(
      tap((response) => {
        const newToken = response.token;
        localStorage.setItem('token', newToken);
        console.log('Token renovado correctamente');
      }),
      catchError((error) => throwError(() => new Error('Error al renovar el token.')))
    );
  }

  // Obtener datos del usuario actual
  getUserData(): Observable<any> {
    const userId = this.getUserId();
    if (!userId) {
      return throwError(() => new Error('No se encontró el ID de usuario.'));
    }
    return this.http.get<any>(`${this.userApiUrl}/profile/${userId}`);
  }

  // Registrar usuario nuevo
  register(nickname: string, name: string, lastname: string, email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/register`, { nickname, name, lastname, email, password })
      .pipe(
        tap(() => console.log('Usuario registrado correctamente')),
        catchError((error) => {
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

  // Verificar disponibilidad de nickname
  checkNicknameAvailability(nickname: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.userApiUrl}/check-nickname`, { params: { nickname } });
  }

  // Verificar disponibilidad de email
  checkEmailAvailability(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.userApiUrl}/check-email`, { params: { email } });
  }

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('nickname');
    sessionStorage.clear();
    this.loggedIn.next(false);
    this.router.navigate(['/']);
  }

  // Verificar si el usuario está autenticado
  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  // Comprobar si existe un token en el localStorage
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  // Obtener el token JWT
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Obtener el ID de usuario
  getUserId(): string | null {
    return localStorage.getItem('userId');
  }
}
