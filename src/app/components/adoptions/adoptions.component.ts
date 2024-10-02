import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/posts.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-adoptions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './adoptions.component.html',
  styleUrl: './adoptions.component.css',
})
export class AdoptionsComponent implements OnInit {
  posts: any[] = [];
  provinces: string[] = [];
  cities: string[] = [];
  breeds: string[] = [];

  // Static data as a backup
  regionsAndCities: { [key: string]: string[] } = {};
  animalTypesAndBreeds: { [key: string]: string[] } = {};

  isLoggedIn: boolean = false;

  constructor(
    private postsService: PostService,
    private dataService: DataService,
    private authService: AuthService
  ) {
    this.regionsAndCities = this.dataService.regionsAndCities;
    this.animalTypesAndBreeds = this.dataService.animalTypesAndBreeds;
  }

  ngOnInit(): void {
    this.loadProvinces();
    this.loadPosts();

    this.authService.isLoggedIn().subscribe({
      next: (loggedIn: boolean) => {
        this.isLoggedIn = loggedIn;  // Actualizar estado de autenticación
      },
      error: (error: any) => {
        console.error('Error al verificar el estado de autenticación', error);
      }
    });
  }

  // Función para verificar si la URL es externa
  isExternalUrl(url: string): boolean {
    return url.startsWith('http://') || url.startsWith('https://');
  }

  loadProvinces(): void {
    this.postsService.getProvinces().subscribe({
      next: (provinces: string[]) => {
        this.provinces = provinces;  // Asignar provincias obtenidas
      },
      error: (error: any) => {
        console.error('Error al cargar las provincias', error);
      }
    });
  }

  onProvinceChange(province: string): void {
    this.postsService.getCities(province).subscribe({
      next: (cities: string[]) => {
        this.cities = cities;  // Asignar ciudades obtenidas
      },
      error: (error: any) => {
        console.error('Error al cargar las ciudades, usando respaldo estático', error);
        this.cities = this.regionsAndCities[province] || [];
      }
    });
  }

  onRegionChange(region: string): void {
    this.cities = this.dataService.regionsAndCities[region] || [];
  }

  onAnimalTypeChange(animalType: string): void {
    this.postsService.getBreeds(animalType).subscribe({
      next: (breeds: string[]) => {
        this.breeds = breeds;
      },
      error: (error: any) => {
        console.error('Error al cargar las razas, usando respaldo estático', error);
        this.breeds = this.animalTypesAndBreeds[animalType] || [];
      }
    });
  }

  // Method to load posts without filters
  loadPosts(filters: any = null): void {
    // Si no se pasan filtros, cargar todos los posts
    const postRequest = filters ? this.postsService.getPosts(filters) : this.postsService.getPosts();

    postRequest.subscribe({
      next: (data: any) => {
        // Verificar si _embedded y postList están presentes
        if (data._embedded && data._embedded.postList) {
          this.posts = data._embedded.postList;  // Asignar los posts correctamente
        } else if (Array.isArray(data)) {
          this.posts = data;  // Manejar la respuesta como array si es necesario
        } else {
          this.posts = [];  // Si no hay posts, asignar array vacío
        }
      },
      error: (error: any) => {
        console.error('Error al cargar los posts', error);
        this.posts = [];  // En caso de error, asignar array vacío
      }
    });
  }

  // Check if the current user has liked the post
  checkUserHasLiked(post: any): boolean {
    const userId = localStorage.getItem('userId');  // Asume que tienes el userId en el localStorage
    return post.likedByUsers?.some((user: any) => user.id === userId);
  }

  // Toggle like/unlike a post
  toggleLike(post: any): void {
    if (!this.isLoggedIn) {
      alert("Necesitas estar logueado para dar like.");
      return;
    }

    this.postsService.likePost(post.id).subscribe(
      (response: any) => {
        post.likes = response.likes;
        post.userHasLiked = !post.userHasLiked;  // Alternar el estado del like
      },
      (error) => {
        console.error('Error al dar like:', error);
      }
    );
  }

  // Method to apply filters
  applyFilters(filters: any): void {
    console.log('Filtros aplicados:', filters);

    // Filtrar valores vacíos y renombrar 'region' a 'province' si es necesario
    const cleanedFilters: { [key: string]: any } = Object.keys(filters)
      .filter(key => filters[key] !== '' && filters[key] !== null && filters[key] !== undefined)
      .reduce((obj, key) => {
        if (key === 'region') {
          obj['province'] = filters[key];  // Renombrar 'region' a 'province'
        } else {
          obj[key] = filters[key];
        }
        return obj;
      }, {} as { [key: string]: any });

    console.log('Filtros limpios:', cleanedFilters);

    // Llamar al método `loadPosts` con los filtros limpios
    this.loadPosts(Object.keys(cleanedFilters).length === 0 ? null : cleanedFilters);
  }
}
