import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private apiUrl = 'http://localhost:8080/api/messages';

  constructor(
    private http: HttpClient) { }

  // Método para enviar un mensaje
  sendMessage(senderId: number, receiverId: number, bodyText: string, postId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/send`, {
      senderId,
      receiverId,
      bodyText,
      postId
    });
  }

  // Obtener mensajes recibidos (bandeja de entrada)
  getInboxMessages(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/inbox`, {
      params: { userId: userId.toString() }
    });
  }

  // Obtener mensajes enviados
  getSentMessages(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sent`, {
      params: { userId: userId.toString() }
    });
  }
}
