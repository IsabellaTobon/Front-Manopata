import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

interface LoginResponse {
  token: string;
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

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((response: LoginResponse) => {
        localStorage.setItem('token', response.token);
        this.loggedIn.next(true);
        this.router.navigate(['/']);
      })
    );

  // constructor(private http: HttpClient, private router: Router) {}

  // getData(): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/ruta-del-endpoint`);
  // }

  // postData(data: any): Observable<any> {
  //   return this.http.post<any>(`${this.apiUrl}/ruta-del-endpoint`, data);
  // }

  // login(username: string, password: string): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/login`, { username, password }).pipe(
  //     tap((response: any) => {
  //       localStorage.setItem('token', response.token);
  //       this.loggedIn.next(true);
  //       this.router.navigate(['/']);
  //     })
  //   );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
