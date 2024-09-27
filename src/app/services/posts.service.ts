import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:8080/api/post';

  constructor(private http: HttpClient) { }

  // Método para obtener un post por ID
  getPostById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Método para obtener todos los posts con filtros opcionales
  getPosts(filters: any = {}): Observable<any[]> {
    let params = new HttpParams();

    // Añadir filtros solo si están definidos y no son vacíos
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
    if (filters.available !== undefined && filters.available !== null) {
      params = params.set('available', filters.available.toString());
    }
    if (filters.isPPP !== undefined && filters.isPPP !== null) {
      params = params.set('isPPP', filters.isPPP.toString());
    }
    if (filters.vaccinated !== undefined && filters.vaccinated !== null) {
      params = params.set('vaccinated', filters.vaccinated.toString());
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  // Method to like a post
  likePost(postId: number): Observable<any> {
    const token = localStorage.getItem('token');  // Obtener el token JWT del localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/${postId}/like`, {}, { headers });
  }

  createPost(postData: any): Observable<any> {
    const token = localStorage.getItem('token');  // Obtener el token JWT desde el almacenamiento local

    // Configurar los headers con el token de autorización
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    // Enviar el postData al backend con los headers
    return this.http.post(`${this.apiUrl}/create`, postData, { headers });
  }

  // Obtener URL de imagen de un post
  getPostImage(imageName: string): string {
    return `${this.apiUrl.replace('/post', '')}/files/${imageName}`;
  }

  // Obtener provincias desde el backend
  getProvinces(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/provinces`);
  }

  // Obtener ciudades según la provincia desde el backend
  getCities(province: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/cities`, { params: { province } });
  }

  // Obtener razas según el tipo de animal desde el backend
  getBreeds(animalType: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/breeds`, { params: { animalType } });
  }
}
