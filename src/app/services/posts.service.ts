import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:4200/adoptions';

  constructor(private http: HttpClient) { }

  // Método para obtener un post por ID
  getPostById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Método para obtener todos los posts con filtros opcionales
  getPosts(filters: any = {}): Observable<any[]> {
    let params = new HttpParams();

    // Añadir filtros según sean proporcionados
    if (filters.province) {
      params = params.set('province', filters.province);
    }
    if (filters.city) {
      params = params.set('city', filters.city);
    }
    if (filters.breed) {
      params = params.set('breed', filters.breed);
    }
    if (filters.animalType) {
      params = params.set('animalType', filters.animalType);
    }
    if (filters.orderBy) {
      params = params.set('orderBy', filters.orderBy);
    }
    if (filters.available !== undefined) {
      params = params.set('available', filters.available.toString());
    }
    if (filters.isPPP !== undefined) {
      params = params.set('isPPP', filters.isPPP.toString());
    }
    if (filters.vaccinated !== undefined) {
      params = params.set('vaccinated', filters.vaccinated.toString());
    }

    return this.http.get<any[]>(this.apiUrl, { params });
  }

  // Método para crear un nuevo post
  createPost(postData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, postData);
  }

}
