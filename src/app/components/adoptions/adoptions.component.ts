import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/posts.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';

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
  regionsAndCities: {[key: string]: string[]} = {};
  animalTypesAndBreeds: {[key: string]: string[]} = {};

  constructor(
    private postsService: PostService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  onRegionChange(region: string): void {
    this.cities = this.dataService.regionsAndCities[region] || [];
  }

  onAnimalTypeChange(animalType: string): void {
    this.breeds = this.dataService.animalTypesAndBreeds[animalType] || [];
  }

  // Method to load posts whitout filters
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

  // Method to apply filters
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
  }

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

