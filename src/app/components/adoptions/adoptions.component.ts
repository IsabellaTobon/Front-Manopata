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
    this.loadProvinces();  // Cargar provincias al inicio
    this.loadPosts();  // Cargar posts

    this.authService.isLoggedIn().subscribe({
      next: (loggedIn: boolean) => {
        this.isLoggedIn = loggedIn;  // Actualizar estado de autenticación
      },
      error: (error: any) => {
        console.error('Error al verificar el estado de autenticación', error);
      }
    });
  }

  loadProvinces(): void {
    this.postsService.getProvinces().subscribe({
      next: (provinces: string[]) => {
        this.provinces = provinces;  // Asignar provincias obtenidas
      },
      error: (error: any) => {
        console.error('Error al cargar las provincias', error);
        // Podrías cargar datos estáticos si fuera necesario
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
        // Si hay error, cargar ciudades desde el DataService
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
        // Si hay error, cargar razas desde el DataService
        this.breeds = this.animalTypesAndBreeds[animalType] || [];
      }
    });
  }

  // Method to load posts whitout filters
  loadPosts(): void {
    this.postsService.getPosts().subscribe({
      next: (data: any) => {
        // Verificar si _embedded y postList están presentes
        if (data._embedded && data._embedded.postList) {
          this.posts = data._embedded.postList;  // Asignar los posts correctamente
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

  // Method to apply filters
  applyFilters(filters: any): void {
    this.postsService.getPosts(filters).subscribe({
      next: (data: any[]) => {
        if (filters.orderByDate === 'latest') {
          this.posts = data.sort(
            (a, b) => new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime()
          );
        } else if (filters.orderByDate === 'oldest') {
          this.posts = data.sort(
            (a, b) => new Date(a.fechaPublicacion).getTime() - new Date(b.fechaPublicacion).getTime()
          );
        } else {
          this.posts = data;  // Mostrar los datos sin orden
        }
      },
      error: (error: any) => {
        console.error('Error al cargar los filtros', error);
      }
    });
  }
}
