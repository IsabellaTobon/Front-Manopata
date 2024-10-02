import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/posts.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  featuredPets: any[] = [];

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.selectFeaturedPosts(); // Llama a la función para cargar mascotas destacadas
  }

  selectFeaturedPosts(): void {
    const featuredPostIds = [1, 2, 3]; // Cambiar estos IDs según necesidad
    this.postService.getPostsByIds(featuredPostIds).subscribe({
      next: (data) => {
        this.featuredPets = data;
      },
      error: (error) => {
        console.error('Error al cargar mascotas destacadas', error);
      },
    });
  }

  isExternalUrl(url: string): boolean {
    return url.startsWith('http://') || url.startsWith('https://');
  }
}
