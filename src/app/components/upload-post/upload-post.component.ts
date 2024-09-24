import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { PostService } from '../../services/posts.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { NotificationsService } from '../../services/notifications.service';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'app-upload-post',
  standalone: true,
  imports: [FormsModule,CommonModule, NotificationsComponent],
  templateUrl: './upload-post.component.html',
  styleUrl: './upload-post.component.css'
})
export class UploadPostComponent {
  notificationMessage: string = '';
  notificationType: 'success' | 'error' | 'info' | 'warning' = 'info';

  cities: string[] = [];
  breeds: string[] = [];
  regionsAndCities:{ [key: string]: string[] } = {};
  animalTypesAndBreeds:{ [key: string]: string[] } = {};

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
    photo: ''
  };

  constructor(
    private postsService: PostService,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private http: HttpClient,
    private router: Router

  ) { }

  ngOnInit(): void {

    this.regionsAndCities = this.dataService.regionsAndCities;
    this.animalTypesAndBreeds = this.dataService.animalTypesAndBreeds;
  }

  // Manejo del archivo seleccionado
  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.selectedFile = file; // Guardar el archivo seleccionado
    }
  }

  // Change city based on province
  onProvinceChange(province: string): void {
    this.cities = this.regionsAndCities[province] || [];
  }

  // Change breed based on animal type
  onAnimalTypeChange(animalType: string): void {
    this.breeds = this.animalTypesAndBreeds[animalType] || [];
  }

  // Send post form to the backend
  submitPost(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('post', JSON.stringify(this.newPost));

      this.http.post<{ fileName: string }>('http://localhost:8080/api/post/create', formData).subscribe({
        next: () => {
          // Mostrar notificación de éxito
          this.notificationMessage = 'Post subido correctamente';
          this.notificationType = 'success';

          // Limpiar formulario y redireccionar
          this.clearForm();
          setTimeout(() => this.router.navigate(['/adoptions']), 3000);
        },
        error: (error) => {
          // Mostrar notificación de error
          this.notificationMessage = 'Error al guardar el post';
          this.notificationType = 'error';
          console.error('Error al guardar el post', error);
        }
      });
    } else {
      this.savePost(); // Guardar el post sin archivo
    }
  }

  savePost(): void {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const postData = {
      name: this.newPost.name,
      breed: this.newPost.breed,
      ppp: this.newPost.ppp,
      vaccinated: this.newPost.vaccinated,
      available: this.newPost.available,
      age: this.newPost.age,
      city: this.newPost.city,
      province: this.newPost.province,
      description: this.newPost.description,
      animalType: this.newPost.animalType,
      photo: this.newPost.photo
    };

    this.postsService.createPost(postData).subscribe({
      next: () => {
        this.notificationsService.showNotification('Post subido correctamente', 'success');
        this.clearForm();  // Limpiar el formulario después de la subida

        // Retrasar el redireccionamiento
        setTimeout(() => {
          this.router.navigate(['/adoptions']);
        }, 3000);  // Redirigir después de 3 segundos
      },
      error: (error) => {
        this.notificationsService.showNotification('Error al guardar el post', 'error');
        console.error('Error al guardar el post', error);
      }
    });
  }

  clearForm(): void {
    this.newPost = {
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
      photo: ''
    };
    this.selectedFile = null;  // Limpiar el archivo seleccionado
  }

  cancel(): void {
    this.router.navigate(['/adoptions']);
  }
}

