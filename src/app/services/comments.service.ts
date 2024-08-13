import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  //ACTIVAR cuando haga llamadas al backend-->
  // private apiUrl = 'http://localhost:4200/opinions';

  // constructor(private http: HttpClient) { }

  // getComments(): Observable<UserComment[]> {
  //   return this.http.get<UserComment[]>(this.apiUrl);
  // }

   // EJEMPLO datos ficticios aquí
   private comments: UserComment[] = [
    {
      name: 'Juan Pérez',
      rating: 5,
      text: '¡Excelente servicio! Adopté un gatito y el proceso fue muy fácil y rápido.',
      date: '2023-07-20'
    },
    {
      name: 'Ana Martínez',
      rating: 4,
      text: 'Adopté un perro y estoy muy contenta. ¡Gracias por todo!',
      date: '2023-06-15'
    },
    {
      name: 'Carlos López',
      rating: 3,
      text: 'El servicio fue bueno, pero hubo algunos problemas con el proceso de adopción.',
      date: '2023-05-22'
    },
    {
      name: 'Laura Gómez',
      rating: 4,
      text: 'Buena experiencia en general. El personal fue amable y atento.',
      date: '2023-04-10'
    },
    {
      name: 'Pedro Fernández',
      rating: 5,
      text: 'Un proceso muy sencillo y rápido. Estoy muy feliz con mi nueva mascota.',
      date: '2023-03-18'
    }
  ];

  constructor() { }

  getComments(): Observable<UserComment[]> {
    // Devuelve los comentarios ficticios como un Observable
    return of(this.comments);
  }
}



export interface UserComment {
  //id: number;
  name: any;
  text: string;
  rating: number;
  date: string;
}


