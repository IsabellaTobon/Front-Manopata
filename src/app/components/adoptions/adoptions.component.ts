import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/posts.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-adoptions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './adoptions.component.html',
  styleUrl: './adoptions.component.css'
})
export class AdoptionsComponent implements OnInit {
  posts: any[] = [];
  cities: string[] = [];
  breeds: string[] = [];

  constructor(
    private postsService: PostService
  ) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  onRegionChange(region: string): void {
    this.cities = this.regionsAndCities[region] || [];
  }

  onAnimalTypeChange(animalType: string): void {
    this.breeds = this.animalTypesAndBreeds[animalType] || [];
  }

  // Método para cargar los posts sin filtros
  loadPosts(): void {
    this.postsService.getPosts().subscribe({
      next: (data: any[]) => {
        this.posts = data;
      },
      error: (error: any) => {
        console.error('Error al cargar los posts', error);
      }
    });
  }

  // Método para aplicar los filtros
  applyFilters(filters: any): void {
    this.postsService.getPosts(filters).subscribe({
      next: (data: any[]) => {
        // Si se ha solicitado ordenar por fecha, lo hacemos aquí
        if (filters.orderByDate === 'latest') {
          this.posts = data.sort((a, b) => new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime());
        } else if (filters.orderByDate === 'oldest') {
          this.posts = data.sort((a, b) => new Date(a.fechaPublicacion).getTime() - new Date(b.fechaPublicacion).getTime());
        } else {
          this.posts = data; // Si no hay orden, se muestra tal como viene del backend
        }
      },
      error: (error: any) => {
        console.error('Error al cargar los posts', error);
      }
    });

    // Método para cargar los posts sin filtros(si lo he organizado en el backend)
    // applyFilters(filters: any): void {
    //   this.postService.getPosts(filters).subscribe({
    //     next: (data: any[]) => {
    //       this.posts = data;
    //     },
    //     error: (error: any) => {
    //       console.error('Error al cargar los posts', error);
    //     }
    //   });
  }

  regionsAndCities: { [key: string]: string[] } = {
    'Andalucía': ['Sevilla', 'Málaga', 'Córdoba', 'Granada', 'Almería', 'Cádiz', 'Jaén', 'Huelva'],
    'Aragón': ['Zaragoza', 'Huesca', 'Teruel'],
    'Asturias': ['Oviedo', 'Gijón', 'Avilés'],
    'Baleares': ['Palma de Mallorca', 'Ibiza', 'Manacor'],
    'Canarias': ['Las Palmas de Gran Canaria', 'Santa Cruz de Tenerife', 'La Laguna', 'Arona'],
    'Cantabria': ['Santander', 'Torrelavega'],
    'Castilla y León': ['Valladolid', 'León', 'Burgos', 'Salamanca', 'Segovia', 'Ávila', 'Palencia', 'Soria', 'Zamora'],
    'Castilla-La Mancha': ['Toledo', 'Albacete', 'Ciudad Real', 'Cuenca', 'Guadalajara'],
    'Cataluña': ['Barcelona', 'Girona', 'Lleida', 'Tarragona'],
    'Extremadura': ['Badajoz', 'Cáceres', 'Mérida'],
    'Galicia': ['Santiago de Compostela', 'A Coruña', 'Lugo', 'Ourense', 'Pontevedra', 'Vigo'],
    'Madrid': ['Madrid', 'Alcalá de Henares', 'Móstoles', 'Fuenlabrada'],
    'Murcia': ['Murcia', 'Cartagena', 'Lorca'],
    'Navarra': ['Pamplona', 'Tudela'],
    'País Vasco': ['Bilbao', 'San Sebastián', 'Vitoria-Gasteiz'],
    'La Rioja': ['Logroño', 'Calahorra'],
    'Comunidad Valenciana': ['Valencia', 'Alicante', 'Castellón de la Plana'],
    'Ceuta': ['Ceuta'],
    'Melilla': ['Melilla']
  };

  animalTypesAndBreeds: { [key: string]: string[] } = {
    'Perro': [
      'Mestizo',
      'Labrador Retriever',
      'Pastor Alemán',
      'Bulldog',
      'Beagle',
      'Poodle',
      'Chihuahua',
      'Dachshund',
      'Golden Retriever',
      'Rottweiler',
      'Yorkshire Terrier',
      'Boxer',
      'Schnauzer',
      'Shih Tzu',
      'Doberman',
      'Mastín',
      'Galgo',
      'Pug',
      'Bóxer'
    ],
    'Gato': [
      'Mestizo',
      'Siamés',
      'Persa',
      'Maine Coon',
      'Bengala',
      'Sphynx',
      'British Shorthair',
      'Scottish Fold',
      'Ragdoll',
      'Abisinio',
      'Birmano',
      'Angora',
      'Siberiano',
      'Azul Ruso',
      'Somalí',
      'Manx',
      'Exótico de Pelo Corto'
    ],
    'Ave': [
      'Canario',
      'Periquito',
      'Loro',
      'Agaporni',
      'Cacatúa',
      'Ninfa',
      'Jilguero',
      'Gorrión',
      'Cotorra',
      'Mestizo'
    ],
    'Reptil': [
      'Iguana',
      'Camaleón',
      'Gecko',
      'Serpiente Pitón',
      'Tortuga',
      'Serpiente',
      'Lagarto',
      'Boa',
      'Cobra',
      'Mestizo',
    ],
    'Roedor': [
      'Hámster',
      'Cobaya',
      'Chinchilla',
      'Rata',
      'Ratón',
      'Conejo',
      'Jerbo',
      'Ardilla',
      'Puercoespín',
      'Conejo Enano',
      'Erizo',
      'Marmota',
      'Mestizo'
    ],
    'Pez': [
      'Goldfish',
      'Pez Ángel',
      'Pez Cebra',
      'Pez Globo',
      'Pez Payaso',
      'Mestizo'
    ],
    'Exótico': [
      'Hurón',
      'Tarántula',
      'Escorpión',
      'Serpiente Boa',
      'Cobra',
      'Erizo',
      'Mono',
      'Murciélago',
      'Dragón de Komodo',
      'Caimán',
      'Suricato',
      'Otros'
    ]
  };
}
