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
    // GET PROTECTORS FROM BACKEND
    this.protectorsService.getProtectors().subscribe((data) => {
      this.protectors = data.map(protector => ({
        ...protector,
        photo: `${protector.photo}`
      }));

      this.filteredProtectors = [...this.protectors]; // CREATE A COPY TO FILTER
    });

    // LOADING PROVINCES FROM THE BACKEND
    this.loadProvinces();
  }

  loadProvinces(): void {
    this.protectorsService.getAllProvinces().subscribe({
      next: (provinces: string[]) => {
        this.provinces = provinces; // ASSIGN THE OBTAINED PROVINCES
      },
      error: (error: any) => {
        console.error('Error al cargar provincias', error);
      }
    });
  }

  onProvinceChange(selectedProvince: string): void {
    // WHEN CHANGING PROVINCES, LOAD THE CORRESPONDING CITIES
    this.protectorsService.getCitiesByProvince(selectedProvince).subscribe({
      next: (cities: string[]) => {
        this.cities = cities; // ASSIGN THE OBTAINED CITIES
      },
      error: (error: any) => {
        console.error('Error al cargar ciudades', error);
        this.cities = []; // RESET CITIES ON ERROR
      }
    });
  }

  selectProtector(protector: any) {
    this.selectedProtector = protector;

    // GET THE MODAL AND DISPLAY IT USING NATIVE BOOTSTRAP
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
      // FILTER ON THE ORIGINAL ARRAY OF PROTECTORS
      this.filteredProtectors = this.protectors.filter(protector => protector.province === location);
    } else {
      // RESTORE THE FULL LIST OF SHELTERS
      this.filteredProtectors = [...this.protectors];  // CREATE A COPY OF THE ORIGINAL ARRAY
    }
  }

}
