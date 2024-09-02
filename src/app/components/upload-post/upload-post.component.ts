import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { PostService } from '../../services/posts.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-upload-post',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './upload-post.component.html',
  styleUrl: './upload-post.component.css'
})
export class UploadPostComponent {

  cities: string[] = [];
  breeds: string[] = [];
  selectedFile: File | null = null;

  newPost: any = {
    name: '',
    breed: '',
    ppp: false,
    vaccinated: false,
    available: true,
    age: '',
    city: '',
    province: '',
    description: '',
    animalType: '',
    imageUrl: ''
  };

  constructor(
    private postsService: PostService,
    private dataService: DataService,
    private http: HttpClient,
    private router: Router
  ) { }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onProvinceChange(province: string): void {
    this.cities = this.dataService.regionsAndCities[province] || [];
  }

  onAnimalTypeChange(animalType: string): void {
    this.breeds = this.dataService.animalTypesAndBreeds[animalType] || [];
  }

  submitPost(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this.http.post<{ fileName: string }>('/api/files/upload', formData).subscribe({
        next: (response) => {
          this.newPost.imageUrl = `/uploads/${response.fileName}`;
          this.savePost();
        },
        error: (error) => {
          console.error('Error al subir la imagen', error);
        }
      });
    } else {
      this.savePost();
    }
  }

  savePost(): void {
    this.postsService.createPost(this.newPost).subscribe({
      next: () => {
        this.router.navigate(['/adoptions']);
      },
      error: (error) => {
        console.error('Error al guardar el post', error);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/adoptions']);
  }
}

