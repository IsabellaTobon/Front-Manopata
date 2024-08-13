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
        image: 'https://imgs.search.brave.com/DEUfQLC0v8f1h_8BJ7UvncsnS0LH03KKgvExHMEjeG0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aW50ZW50YXJsby5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MTgvMDYvZnJhc2Vz/LWJvbml0YXMtZGUt/YW1vci1hLWxvcy1h/bmltYWxlcy5qcGc',
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
        image: 'https://imgs.search.brave.com/L0nACu6N2eyUOOZNEApcdT38EwOijfp0RIfnSpFKjxM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jb250/ZW50LmVsbXVlYmxl/LmNvbS9tZWRpby8y/MDIzLzAxLzI0L2Zy/YXNlLWJvbml0YS1z/b2JyZS1wZXJyb3Nf/MzVlYmI1NWNfMjMw/MTI0MTA0OTUzXzEw/MDB4MTAwMC5qcGc',
        description: 'Nuestra misión es rescatar animales en situaciones de riesgo y encontrarles un hogar permanente.',
      },
      {
        name: 'Protectora de Amigos Peludos',
        location: 'Bilbao',
        services: ['Adopción', 'Veterinario'],
        image: 'https://imgs.search.brave.com/IFi8SCDGY7Er_cz4Lua4Dqjn6C-KMVXG8V3SpKl-o2k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cmVjcmVvdmlyYWwu/Y29tL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDE2LzA0L2NvdmVy/LWFuaW1hbGVzLTUy/MHgyNzIuanBn',
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
