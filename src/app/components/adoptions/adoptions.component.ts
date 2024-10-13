import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/posts.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { RouterModule } from '@angular/router';
import { NotificationsService } from '../../services/notifications.service';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'app-adoptions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NotificationsComponent],
  providers:[DatePipe],
  templateUrl: './adoptions.component.html',
  styleUrl: './adoptions.component.css',
})
export class AdoptionsComponent implements OnInit {
  posts: any[] = [];
  provinces: string[] = [];
  cities: string[] = [];
  breeds: string[] = [];

  // STATIC DATA AS A BACKUP
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
        this.isLoggedIn = loggedIn; // UPDATE AUTHENTICATION STATUS
      },
      error: (error: any) => {
        console.error('Error al verificar el estado de autenticación', error);
      },
    });
  }

  // FUNCTION TO CHECK IF URL IS EXTERNAL
  isExternalUrl(url: string): boolean {
    return url.startsWith('http://') || url.startsWith('https://');
  }

  loadProvinces(): void {
    this.postsService.getProvinces().subscribe({
      next: (provinces: string[]) => {
        this.provinces = provinces; // ASSIGN OBTAINED PROVINCES
      },
      error: (error: any) => {
        console.error('Error al cargar las provincias', error);
      },
    });
  }

  onProvinceChange(province: string): void {
    this.postsService.getCities(province).subscribe({
      next: (cities: string[]) => {
        this.cities = cities; // ASSIGN OBTAINED CITIES
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

  // METHOD TO LOAD POSTS WITHOUT FILTERS
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

        // CHECK IF THE USER HAS LIKED EACH POST
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

  // CHECK IF THE CURRENT USER HAS LIKED THE POST
  checkUserHasLiked(post: any): boolean {
    const userId = localStorage.getItem('userId');
    const hasLiked = post.likedByUsers?.some((user: any) => user.id === userId);
    console.log(`Post ${post.id} - Usuario ${userId} ha dado like:`, hasLiked); // LOG TO CHECK IF THE USER HAS GIVEN A LIKE
    return hasLiked;
  }

  // TOGGLE LIKE/UNLIKE A POST
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

        // TOGGLE LIKE STATUS
        post.userHasLiked = !hasLiked;

        // SHOW SUCCESS NOTIFICATION
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

  // METHOD TO APPLY FILTERS
  applyFilters(filters: any): void {
    console.log('Filtros aplicados:', filters);

    // FILTER OUT EMPTY VALUES ​​AND RENAME 'REGION' TO 'PROVINCE' IF NECESSARY
    const cleanedFilters: { [key: string]: any } = Object.keys(filters)
      .filter(
        (key) =>
          filters[key] !== '' &&
          filters[key] !== null &&
          filters[key] !== undefined
      )
      .reduce((obj, key) => {
        if (key === 'region') {
          obj['province'] = filters[key]; // RENAME 'REGION' TO 'PROVINCE'
        } else {
          obj[key] = filters[key];
        }
        return obj;
      }, {} as { [key: string]: any });

    console.log('Filtros limpios:', cleanedFilters);

    // CALLING `LOADPOSTS` METHOD WITH CLEAN FILTERS
    this.loadPosts(
      Object.keys(cleanedFilters).length === 0 ? null : cleanedFilters
    );
  }

  // METHOD TO RESET FILTERS AND RELOAD POSTS
  resetFilters(form: any): void {
    form.resetForm(); // RESET FORM
    this.loadPosts(); // RELOAD POSTS
    this.notificationsService.showNotification(
      'Filtros restablecidos.',
      'info'
    );
  }
}
