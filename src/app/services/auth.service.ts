import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

interface LoginResponse {
  token: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = 'http://localhost:4200';
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient, private router: Router) {}

  getData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/`);
  }

  postData(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/`, data);
  }

  login(nickname: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { nickname, password }).pipe(
      tap((response: LoginResponse) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId); // Save the user ID
        this.loggedIn.next(true);
      })
    );
  }

  register (nickname: string, name: string, lastName: string, email: string ,password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { nickname, name, lastName, email, password }).pipe(
      tap(() => {
        this.router.navigate(['/login']);
      })
    );
  }

  //Verify if nickname are available
  checkNicknameAvailability(nickname: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-nickname/${nickname}`);
  }

  //Verify if email are available
  checkEmailAvailability(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-email/${email}`);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
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
