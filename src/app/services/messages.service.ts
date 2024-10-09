import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { NotificationsService } from './notifications.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private apiUrl = 'http://localhost:8080/api/messages';

  constructor (
    private http: HttpClient,
    private notificationsService: NotificationsService
  ) { }

  // Método para enviar un mensaje
  sendMessage(senderId: number, receiverId: number, bodyText: string, postId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}` // Usamos el JWT almacenado
    });

    const body = {
      senderId: senderId,
      receiverId: receiverId,
      bodyText: bodyText,
      postId: postId
    };

    return this.http.post(`${this.apiUrl}/send`, body, { headers }).pipe(
      tap(() => {

        this.notificationsService.showNotification('Mensaje enviado con éxito.', 'success');
      }),
      catchError((error) => {

        this.notificationsService.showNotification('Error al enviar el mensaje.', 'error');
        throw error;
      })
    );
  }

  // Obtener mensajes recibidos (bandeja de entrada)
  getInboxMessages(userId: number): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}` // Autorización
    });

    return this.http.get<any[]>(`${this.apiUrl}/inbox`, { headers, params: { userId: userId.toString() } }).pipe(
      tap(() => {

        // this.notificationsService.showNotification('Mensajes recibidos cargados con éxito.', 'success');
      }),
      catchError((error) => {

        this.notificationsService.showNotification('Error al cargar los mensajes recibidos.', 'error');
        throw error;
      })
    );
  }

  // Obtener mensajes enviados
  getSentMessages(userId: number): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}` // Autorización
    });

    return this.http.get<any[]>(`${this.apiUrl}/sent`, { headers, params: { userId: userId.toString() } }).pipe(
      tap(() => {

        // this.notificationsService.showNotification('Mensajes enviados cargados con éxito.', 'success');
      }),
      catchError((error) => {

        this.notificationsService.showNotification('Error al cargar los mensajes enviados.', 'error');
        throw error;
      })
    );
  }
}
