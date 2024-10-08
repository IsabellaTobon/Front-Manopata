import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  //ACTIVAR cuando haga llamadas al backend-->
  private apiUrl = 'http://localhost:8080/api/comments';

  constructor(private http: HttpClient) { }

  // Método pra obtener los comentarios desde backend
  getComments(): Observable<UserComment[]> {
    return this.http.get<UserComment[]>(this.apiUrl);
  }

  postComment(comment: UserComment): Observable<UserComment> {
    return this.http.post<UserComment>(`${this.apiUrl}/create`, comment);
  }

  }

  export interface UserComment {
    name?: string;
    text: string;
    rating: number;
    commentDate?: Date;
  }
