import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private apiUrl = 'http://localhost:8080/api/comments';

  constructor(private http: HttpClient) {}

  // Método pra obtener los comentarios desde backend
  getComments(): Observable<UserComment[]> {
    return this.http.get<UserComment[]>(this.apiUrl);
  }

  postComment(comment: UserComment): Observable<UserComment> {
    return this.http.post<UserComment>(`${this.apiUrl}/create`, comment);
  }
}

// Modificación en la interfaz UserComment para incluir al usuario
export interface UserComment {
  text: string;
  rating: number;
  commentDate?: Date;
  user: {
    // Añadimos una propiedad user para los detalles del usuario
    name: string;
    photo?: string;
    nickname: string;
  };
}
