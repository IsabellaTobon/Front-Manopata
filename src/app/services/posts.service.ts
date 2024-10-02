import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:8080/api/post';

  constructor(private http: HttpClient) {}

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
    // Solo añadir parámetros si no son nulos ni vacíos
    if (filters.available !== undefined && filters.available !== null && filters.available !== '') {
      params = params.set('available', filters.available.toString());
    }
    if (filters.isPPP !== undefined && filters.isPPP !== null && filters.isPPP !== '') {
      params = params.set('isPPP', filters.isPPP.toString());
    }
    if (filters.vaccinated !== undefined && filters.vaccinated !== null && filters.vaccinated !== '') {
      params = params.set('vaccinated', filters.vaccinated.toString());
    }

    console.log('Parámetros enviados:', params.toString()); // Verificar los filtros que se están enviando

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(data => {
        console.log('Datos recibidos del backend:', data);  // Verifica la estructura de los datos
        if (Array.isArray(data)) {
          return data;
        } else if (data._embedded && Array.isArray(data._embedded.postList)) {
          return data._embedded.postList;
        } else {
          return []; // Devuelve un array vacío si no hay datos
        }
      })
    );
  }

  // Método para dar like a un post
  likePost(postId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/${postId}/like`, {}, { headers });
  }

  // Método para crear un post
  createPost(postData: any): Observable<any> {
    const headers = this.getAuthHeaders();
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

  // Método centralizado para obtener los headers de autorización
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No se encontró token, continuando sin Authorization header');
      return new HttpHeaders(); // Sin autorización
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
}
