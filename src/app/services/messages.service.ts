import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { NotificationsService } from './notifications.service';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private apiUrl = 'http://localhost:8080/api/messages';

  constructor(
    private http: HttpClient,
    private notificationsService: NotificationsService
  ) {}

  // METHOD TO SEND A MESSAGE
  sendMessage(message: {
    senderId: number;
    recipientId: number;
    bodyText: string;
    postId: number;
  }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    return this.http.post(`${this.apiUrl}/send`, message, { headers }).pipe(
      tap(() => {
        this.notificationsService.showNotification(
          'Mensaje enviado con éxito.',
          'success'
        );
      }),
      catchError((error) => {
        this.notificationsService.showNotification(
          'Error al enviar el mensaje.',
          'error'
        );
        throw error;
      })
    );
  }

  // OBTAIN INBOX MESSAGES
  getInboxMessages(userId: number): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`, // AUTHORIZATION
    });

    return this.http
      .get<any[]>(`${this.apiUrl}/inbox`, {
        headers,
        params: { userId: userId.toString() },
      })
      .pipe(
        tap(() => {
          this.notificationsService.showNotification(
            'Mensajes recibidos cargados con éxito.',
            'success'
          );
        }),
        catchError((error) => {
          this.notificationsService.showNotification(
            'Error al cargar los mensajes recibidos.',
            'error'
          );
          throw error;
        })
      );
  }

  // OBTAIN SENT MESSAGES
  getSentMessages(userId: number): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`, // AUTHORIZATION
    });

    return this.http
      .get<any[]>(`${this.apiUrl}/sent`, {
        headers,
        params: { userId: userId.toString() },
      })
      .pipe(
        tap(() => {
          // this.notificationsService.showNotification('Mensajes enviados cargados con éxito.', 'success');
        }),
        catchError((error) => {
          this.notificationsService.showNotification(
            'Error al cargar los mensajes enviados.',
            'error'
          );
          throw error;
        })
      );
  }

  // OBTAIN CHAT HISTORY
  getChatHistory(userId1: number, userId2: number): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    const params = {
      userId1: userId1.toString(),
      userId2: userId2.toString(),
    };

    return this.http
      .get<any[]>(`${this.apiUrl}/history`, { headers, params })
      .pipe(
        tap(() => {
          this.notificationsService.showNotification(
            'Historial de mensajes cargado con éxito.',
            'success'
          );
        }),
        catchError((error) => {
          this.notificationsService.showNotification(
            'Error al cargar el historial de mensajes.',
            'error'
          );
          throw error;
        })
      );
  }
}
