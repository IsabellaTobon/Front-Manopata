import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../services/posts.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { NotificationsService } from '../../services/notifications.service';
import { MessagesService } from '../../services/messages.service';



@Component({
  selector: 'specific-post',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [DatePipe],
  templateUrl: './specific-post.component.html',
  styleUrls: ['./specific-post.component.css']
})
export class SpecificPostComponent implements OnInit {

  post:any = {};

  message = {
    name: '',
    email: '',
    text: ''
  };

  senderId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private authService: AuthService,
    private notificationsService: NotificationsService,
    private messagesService: MessagesService

    ) { }

    ngOnInit(): void {
      const postId = +this.route.snapshot.paramMap.get('id')!;

      this.postService.getPostById(postId).subscribe({
        next: (data) => {
          this.post = data;
          console.log('Post cargado:', this.post);

          if (this.post.photo) {
            this.post.photo = this.postService.getPostImage(this.post.photo);
          }

          if (this.post.registerDate) {
            this.post.registerDate = new Date(this.post.registerDate);
          }
        },
        error: (err) => {
          console.error('Error al cargar el post:', err);
        }
      });

      // Obtener datos del usuario autenticado
      this.authService.getUserData().subscribe({
        next: (data) => {
          this.message.name = data.nickname;
          this.message.email = data.email;
          this.senderId = data.userId;
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        }
      });

  }

  sendMessage() {
    if (this.senderId === null) {
      console.error('El ID del remitente no está disponible.');
      this.notificationsService.showNotification('No se puede enviar el mensaje. Usuario no autenticado.', 'error');
      return;
    }

    const receiverId = this.post.user?.id;
    if (!receiverId) {
      console.error('El ID del receptor no está disponible.');
      this.notificationsService.showNotification('No se puede enviar el mensaje. El propietario del post no está disponible.', 'error');
      return;
    }

    const postId = this.post.id;
    const bodyText = this.message.text;

    this.messagesService.sendMessage(this.senderId, receiverId, bodyText, postId).subscribe({
      next: (response) => {
        console.log('Mensaje enviado:', response);
        this.notificationsService.showNotification('Mensaje enviado correctamente', 'success');
        this.message.text = ''; // Limpiar el campo de texto después de enviar
      },
      error: (err) => {
        console.error('Error al enviar el mensaje:', err);
        this.notificationsService.showNotification('Error al enviar el mensaje', 'error');
      }
    });
  }

}
