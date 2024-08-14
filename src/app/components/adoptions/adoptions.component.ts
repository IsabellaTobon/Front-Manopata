import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/posts.service';

@Component({
  selector: 'app-adoptions',
  standalone: true,
  imports: [],
  templateUrl: './adoptions.component.html',
  styleUrl: './adoptions.component.css'
})
export class AdoptionsComponent implements OnInit {
  posts: any[] = [];

  constructor(
    private postsService: PostService
  ) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    const filters = {
      province: 'Madrid',
      city: 'Madrid',
      breed: 'Labrador',
      animalType: 'Perro',
      orderBy: 'latest',
      available: true,
      isPPP: false,
      vaccinated: true
    };

    this.postsService.getPosts(filters).subscribe({
      next: (data: any[]) => {
        this.posts = data;
      },
      error: (error: any) => {
        console.error('Error al cargar los posts', error);
      },
      complete: () => {
        console.log('Carga de posts completa');
      }
    });
  }
}
