import { Component, OnInit } from '@angular/core';
import { ProtectorsService } from '../../services/protectors.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-protectors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './protectors.component.html',
  styleUrl: './protectors.component.css'
})
export class ProtectorsComponent implements OnInit {

  protectors: any[] = [];
  filteredProtectors: any[] = [];
  selectedProtector: any;
  provinces: string[] = [];
  cities: string[] = [];

  constructor(private protectorsService: ProtectorsService ) {}

  ngOnInit(): void {
    // Obtener protectoras
    this.protectorsService.getProtectors().subscribe((data) => {
      this.protectors = data.map(protector => ({
        ...protector,
        photo: `${protector.photo}`
      }));

      this.filteredProtectors = [...this.protectors]; // Crea una copia para filtrar
    });

    // Cargar las provincias desde el backend
    this.loadProvinces();
  }

  loadProvinces(): void {
    this.protectorsService.getAllProvinces().subscribe({
      next: (provinces: string[]) => {
        this.provinces = provinces; // Asigna las provincias obtenidas
      },
      error: (error: any) => {
        console.error('Error al cargar provincias', error);
      }
    });
  }

  onProvinceChange(selectedProvince: string): void {
    // Al cambiar de provincia, cargar las ciudades correspondientes
    this.protectorsService.getCitiesByProvince(selectedProvince).subscribe({
      next: (cities: string[]) => {
        this.cities = cities; // Asigna las ciudades obtenidas
      },
      error: (error: any) => {
        console.error('Error al cargar ciudades', error);
        this.cities = []; // Resetear ciudades en caso de error
      }
    });
  }

  selectProtector(protector: any) {
    this.selectedProtector = protector;

    // Obtener el modal y mostrarlo utilizando Bootstrap nativo
    const modalElement = document.getElementById('protectorModal');
    if (modalElement) {

      const bootstrapModal = new (window as any).bootstrap.Modal(modalElement);
      bootstrapModal.show();
    } else {
      console.error('No se pudo encontrar el modal.');
    }
  }

  filterByLocation(event: any) {
    const location = event.target.value;
    if (location) {
      // Filtrar sobre el array original de protectoras
      this.filteredProtectors = this.protectors.filter(protector => protector.province === location);
    } else {
      // Restaura la lista completa de protectoras
      this.filteredProtectors = [...this.protectors];  // Crea una copia del array original
    }
  }

}
