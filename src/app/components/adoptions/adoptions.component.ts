import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/posts.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { RouterModule } from '@angular/router';
import { NotificationsService } from '../../services/notifications.service';

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
    private authService: AuthService,
    private notificationsService: NotificationsService
  ) {
    this.regionsAndCities = this.dataService.regionsAndCities;
    this.animalTypesAndBreeds = this.dataService.animalTypesAndBreeds;
  }

  ngOnInit(): void {
    this.loadProvinces();
    this.loadPosts();

    this.authService.isLoggedIn().subscribe({
      next: (loggedIn: boolean) => {
        this.isLoggedIn = loggedIn; // Actualizar estado de autenticación
      },
      error: (error: any) => {
        console.error('Error al verificar el estado de autenticación', error);
      },
    });
  }

  // Función para verificar si la URL es externa
  isExternalUrl(url: string): boolean {
    return url.startsWith('http://') || url.startsWith('https://');
  }

  loadProvinces(): void {
    this.postsService.getProvinces().subscribe({
      next: (provinces: string[]) => {
        this.provinces = provinces; // Asignar provincias obtenidas
      },
      error: (error: any) => {
        console.error('Error al cargar las provincias', error);
      },
    });
  }

  onProvinceChange(province: string): void {
    this.postsService.getCities(province).subscribe({
      next: (cities: string[]) => {
        this.cities = cities; // Asignar ciudades obtenidas
      },
      error: (error: any) => {
        console.error(
          'Error al cargar las ciudades, usando respaldo estático',
          error
        );
        this.cities = this.regionsAndCities[province] || [];
      },
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
        console.error(
          'Error al cargar las razas, usando respaldo estático',
          error
        );
        this.breeds = this.animalTypesAndBreeds[animalType] || [];
      },
    });
  }

  // Method to load posts without filters
  loadPosts(filters: any = null): void {
    const postRequest = filters
      ? this.postsService.getPosts(filters)
      : this.postsService.getPosts();

    postRequest.subscribe({
      next: (data: any) => {
        console.log('Datos recibidos del backend:', data);

        if (data._embedded && data._embedded.postList) {
          this.posts = data._embedded.postList;
        } else if (Array.isArray(data)) {
          this.posts = data;
        } else {
          this.posts = [];
        }

        // Verificar si el usuario ha dado like a cada post
        this.posts.forEach((post) => {
          console.log(
            `Post ${post.id} - Usuario ha dado like: ${post.userHasLiked}`
          );
        });
      },
      error: (error: any) => {
        console.error('Error al cargar los posts', error);
        this.posts = [];
      },
    });
  }

  // Check if the current user has liked the post
  checkUserHasLiked(post: any): boolean {
    const userId = localStorage.getItem('userId'); // Asume que tienes el userId en el localStorage
    const hasLiked = post.likedByUsers?.some((user: any) => user.id === userId);
    console.log(`Post ${post.id} - Usuario ${userId} ha dado like:`, hasLiked); // Log para verificar si el usuario ha dado like
    return hasLiked;
  }

  // Toggle like/unlike a post
  toggleLike(post: any): void {
    if (!this.isLoggedIn) {
      this.notificationsService.showNotification(
        'Necesitas estar logueado para dar like.',
        'warning'
      );
      return;
    }

    const hasLiked = post.userHasLiked;

    this.postsService.likePost(post.id).subscribe(
      (response: any) => {
        post.likes = response.likes;

        // Alternar el estado del like
        post.userHasLiked = !hasLiked;

        // Mostrar notificación de éxito
        const message = hasLiked
          ? 'Like quitado correctamente.'
          : 'Like añadido correctamente.';
        this.notificationsService.showNotification(message, 'success');
      },
      (error) => {
        this.notificationsService.showNotification(
          'Error al intentar dar like.',
          'error'
        );
      }
    );
  }

  // Method to apply filters
  applyFilters(filters: any): void {
    console.log('Filtros aplicados:', filters);

    // Filtrar valores vacíos y renombrar 'region' a 'province' si es necesario
    const cleanedFilters: { [key: string]: any } = Object.keys(filters)
      .filter(
        (key) =>
          filters[key] !== '' &&
          filters[key] !== null &&
          filters[key] !== undefined
      )
      .reduce((obj, key) => {
        if (key === 'region') {
          obj['province'] = filters[key]; // Renombrar 'region' a 'province'
        } else {
          obj[key] = filters[key];
        }
        return obj;
      }, {} as { [key: string]: any });

    console.log('Filtros limpios:', cleanedFilters);

    // Llamar al método `loadPosts` con los filtros limpios
    this.loadPosts(
      Object.keys(cleanedFilters).length === 0 ? null : cleanedFilters
    );
  }

  // Method to reset filters and reload posts
  resetFilters(form: any): void {
    form.resetForm(); // Restablece todos los campos del formulario a su estado inicial
    this.loadPosts(); // Carga los posts sin filtros
    this.notificationsService.showNotification(
      'Filtros restablecidos.',
      'info'
    ); // Muestra una notificación
  }
}
