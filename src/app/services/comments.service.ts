import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private apiUrl = 'http://localhost:8080/api/comments';

  constructor(private http: HttpClient) {}

  // METHOD TO GET COMMENTS
  getComments(): Observable<UserComment[]> {
    return this.http.get<UserComment[]>(this.apiUrl);
  }
  // METHOD TO POST A COMMENT
  postComment(comment: UserComment): Observable<UserComment> {
    return this.http.post<UserComment>(`${this.apiUrl}/create`, comment);
  }
}

// MODIFICATION IN THE USERCOMMENT INTERFACE TO INCLUDE THE USER
export interface UserComment {
  text: string;
  rating: number;
  commentDate?: Date;
  user: {
    // ADD USER PROPERTY FOR USER DETAILS
    name: string;
    photo?: string;
    nickname: string;
  };
}
