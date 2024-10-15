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

  getPostById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getPostsByIds(ids: number[]): Observable<any[]> {
    const idsParam = ids.join(','); // CONVERT ARRAY OF IDS TO A COMMA-SEPARATED STRING
    return this.http.get<any[]>(`${this.apiUrl}/by-ids`, { params: { ids: idsParam } });
  }

  // METHOD TO GET ALL POSTS WITH OPTIONAL FILTERS
  getPosts(filters: any = {}): Observable<any[]> {
    let params = new HttpParams();

    // ADD FILTERS ONLY IF THEY ARE DEFINED AND NOT EMPTY
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
    // ONLY ADD PARAMETERS IF THEY ARE NOT NULL OR EMPTY
    if (filters.available !== undefined && filters.available !== null && filters.available !== '') {
      params = params.set('available', filters.available.toString());
    }
    if (filters.isPPP !== undefined && filters.isPPP !== null && filters.isPPP !== '') {
      params = params.set('isPPP', filters.isPPP.toString());
    }
    if (filters.vaccinated !== undefined && filters.vaccinated !== null && filters.vaccinated !== '') {
      params = params.set('vaccinated', filters.vaccinated.toString());
    }

    console.log('Parámetros enviados:', params.toString()); // CHECK THE FILTERS THAT ARE BEING SENT

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(data => {
        console.log('Datos recibidos del backend:', data);  // CHECK THE STRUCTURE OF THE DATA
        if (Array.isArray(data)) {
          return data;
        } else if (data._embedded && Array.isArray(data._embedded.postList)) {
          return data._embedded.postList;
        } else {
          return []; // RETURNS AN EMPTY ARRAY IF THERE IS NO DATA
        }
      })
    );
  }

  // METHOD TO LIKE A POST
  likePost(postId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/${postId}/like`, {}, { headers });
  }

  // METHOD TO CREATE A POST
  createPost(postData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/create`, postData, { headers });
  }

  // OBTAIN POST IMAGES
  getPostImage(imageName: string): string {
    if (this.isExternalUrl(imageName)) {
      return imageName;
    }
    return `${this.apiUrl.replace('/post', '')}/files/${imageName}`;
  }

  // FUNCTION TO CHECK IF THE URL IS EXTERNAL
  private isExternalUrl(url: string): boolean {
    return url.startsWith('http://') || url.startsWith('https://');
  }

  // OBTAING PROVINCES FROM THE BACKEND
  getProvinces(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/provinces`);
  }

  // OBTAIN CITIES ACCORDING TO THE PROVINCE FROM THE BACKEND
  getCities(province: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/cities`, { params: { province } });
  }

  // OBTAIN ANIMAL BREEDS ACCORDING TO THE TYPE OF ANIMAL
  getBreeds(animalType: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/breeds`, { params: { animalType } });
  }

  // CENTRALIZED METHOD FOR OBTAINING AUTHORIZATION HEADERS
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No se encontró token, continuando sin Authorization header');
      return new HttpHeaders(); // WITHOUT AUTHORIZATION HEADER
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
}
