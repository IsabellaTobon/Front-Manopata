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
  selectedProtector: any = null;

  constructor(private protectorsService: ProtectorsService) {}

  ngOnInit(): void {
    // Obtener protectoras
    this.protectorsService.getProtectors().subscribe((data) => {
      this.protectors = data; // Asigna a protectors
      this.filteredProtectors = data.map(protector => {
          return {
              ...protector,
              photo: `${protector.photo}` // Asegúrate de que esto sea correcto
          };
      });
    });
  }

  selectProtector(protector: any) {
    this.selectedProtector = protector;

    const modal = new bootstrap.Modal(document.getElementById('protectorModal'));
    modal.show();
  }

  filterByLocation(event: any) {
    const location = event.target.value;
    this.filteredProtectors = this.protectors.filter(protector =>
      location === '' || protector.city === location // Ajusta si la propiedad del objeto es 'city'
    );
  }

  filterByService(event: any) {
    const service = event.target.value;
    this.filteredProtectors = this.protectors.filter(protector =>
      service === '' || protector.services.includes(service)
    ); // Comprobar si la protectora ofrece el servicio

    this.selectProtector(null); // Limpiar el protector seleccionado
  }

}
