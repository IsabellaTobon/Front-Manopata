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

  protectors: any[] = []; //Array list of all protectors
  filteredProtectors: any[] = []; //Array list of all protectors that match the search criteria
  selectedProtector: any = null; //Details of selected protector

  constructor(private protectorsService: ProtectorsService) {}

  ngOnInit(): void {

    // Datos de ejemplo
    this.protectors = [
      {
        name: 'Protectora Amigo Fiel',
        location: 'Madrid',
        services: ['Adopción', 'Refugio'],
        image: 'https://images.pexels.com/photos/36740/dog-friend-loyalty-trust.jpg?auto=compress&cs=tinysrgb&w=600',
        description: 'Refugio especializado en perros abandonados. Ofrecemos adopción responsable y servicios de veterinario.',
      },
      {
        name: 'Hogar Gatuno',
        location: 'Barcelona',
        services: ['Adopción', 'Refugio', 'Veterinario'],
        image: 'https://images.pexels.com/photos/1056251/pexels-photo-1056251.jpeg?auto=compress&cs=tinysrgb&w=600',
        description: 'Protectora centrada en la rehabilitación y adopción de gatos callejeros.',
      },
      {
        name: 'Refugio Animalia',
        location: 'Valencia',
        services: ['Adopción', 'Refugio'],
        image: 'https://images.pexels.com/photos/1472999/pexels-photo-1472999.jpeg?auto=compress&cs=tinysrgb&w=600',
        description: 'Un lugar seguro para animales abandonados, con programas de adopción activa.',
      },
      {
        name: 'Salvando Patas',
        location: 'Sevilla',
        services: ['Refugio'],
        image: 'https://images.pexels.com/photos/1559713/pexels-photo-1559713.jpeg?auto=compress&cs=tinysrgb&w=600',
        description: 'Nuestra misión es rescatar animales en situaciones de riesgo y encontrarles un hogar permanente.',
      },
      {
        name: 'Protectora de Amigos Peludos',
        location: 'Bilbao',
        services: ['Adopción', 'Veterinario'],
        image: 'https://images.pexels.com/photos/2046369/pexels-photo-2046369.jpeg?auto=compress&cs=tinysrgb&w=600',
        description: 'Ofrecemos servicios veterinarios y adopción de perros y gatos. Todos merecen un hogar lleno de amor.',
      }
    ];

    // Copia de los datos para aplicar filtros
    this.filteredProtectors = [...this.protectors];


    // this.protectorsService.getProtectors().subscribe((data) => {
    //   this.protectors = data;
    //   this.filteredProtectors = [...this.protectors]; //Copy all protectors to filteredProtectors
    // });
  }

  filterByLocation(event: any) {
    const location = event.target.value;
    this.filteredProtectors = this.protectors.filter (protector => location === '' || protector.location === location
    );
  }

  filterByService(event: any) {
    const service = event.target.value;
    this.filteredProtectors = this.protectors.filter (protector => service === '' || protector.services.includes(service)
    ); //Check if the protector provides the service

    this.selectProtector(null); //Clear selected protector
  }

  selectProtector(protector: any) {
    this.selectedProtector = protector;
  }

}
