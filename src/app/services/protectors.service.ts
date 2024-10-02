import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProtectorsService {

  private apiUrl = 'http://localhost:8080/protectors';

  constructor( private http: HttpClient) { }

  getProtectors(): Observable<any[]> {
    return this.http.get<any[]> (this.apiUrl);
  }

  getAllProvinces(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/provinces`); // Asegúrate de que este endpoint existe en tu backend
  }

  getCitiesByProvince(province: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/cities`, { params: { province } }); // Asegúrate de que este endpoint también existe en tu backend
  }
}
