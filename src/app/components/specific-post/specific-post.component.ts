import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../services/posts.service';
import { ActivatedRoute } from '@angular/router'; // Add this line
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'specific-post',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [DatePipe],
  templateUrl: './specific-post.component.html',
  styleUrl: './specific-post.component.css'
})
export class SpecificPostComponent implements OnInit {

  post:any;

  message = {
    name: '',
    email: '',
    text: ''
  };

  constructor(
    private route: ActivatedRoute,
    private postService: PostService  ) { }

  ngOnInit(): void {
    const postId = +this.route.snapshot.paramMap.get('id')!;
    this.postService.getPostById(postId).subscribe(data => {
      this.post = data;
      // Asegurarse de que registerDate sea un objeto Date
      if (this.post.registerDate) {
        this.post.registerDate = new Date(this.post.registerDate);
      }
    });
  }

  sendMessage() {
    // Lógica para enviar un mensaje al usuario
    console.log('Mensaje enviado:', this.message);
    alert('Mensaje enviado al usuario.');
    // Limpiar el formulario
    this.message = { name: '', email: '', text: '' };
  }

}
