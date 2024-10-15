import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/posts.service';
import { AuthService } from '../../services/auth.service';
import { MessagesService } from '../../services/messages.service';
import { NotificationsService } from '../../services/notifications.service';
import { NotificationsComponent } from "../notifications/notifications.component";




@Component({
  selector: 'specific-post',
  standalone: true,
  imports: [FormsModule, CommonModule, NotificationsComponent],
  providers: [DatePipe],
  templateUrl: './specific-post.component.html',
  styleUrls: ['./specific-post.component.css']
})
export class SpecificPostComponent implements OnInit {

  post: any = {};
  message = { text: '' };
  senderId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private authService: AuthService,
    private messagesService: MessagesService,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit(): void {
    const postId = +this.route.snapshot.paramMap.get('id')!;
    this.loadPost(postId);
    this.loadUserData();

  }

  loadPost(postId: number): void {
    this.postService.getPostById(postId).subscribe({
      next: (data) => {
        console.log('Datos del post cargados:', data);
        this.post = data;

        // VERIFY IF THE PHOTO IS AN EXTERNAL URL
        if (this.post.photo) {
          if (!this.isExternalUrl(this.post.photo)) {
            this.post.photo = 'http://localhost:8080' + this.post.photo; // Ruta de la carpeta uploads
          }
        }

        if (this.post.registerDate) {
          this.post.registerDate = new Date(this.post.registerDate);
        }
      },
      error: (err) => {
        console.error('Error al cargar el post:', err);
      }
    });
  }

  isExternalUrl(url: string): boolean {
    return url.startsWith('http://') || url.startsWith('https://');
  }

  // LOAD USER DATA
  loadUserData(): void {
    this.authService.getUserData().subscribe({
      next: (data) => {
        console.log('Datos del usuario cargados:', data);
        this.senderId = data.id;
      },
      error: (error) => {
        console.error('Error al obtener los datos del usuario:', error);
      }
    });
  }

  sendMessage(): void {
    // VALIDATE FIELDS
    if (!this.senderId || !this.post || !this.post.user || !this.post.user.id || !this.message.text.trim()) {
      this.notificationsService.showNotification('Todos los campos son obligatorios.', 'error');
      return;
    }

    // SEND MESSAGE USING THE MESSAGES SERVICE
    this.messagesService.sendMessage({
      senderId: this.senderId!,
      recipientId: this.post.user.id!,
      bodyText: this.message.text.trim(),
      postId: this.post.id!
    }).subscribe({
      next: (response) => {
        this.notificationsService.showNotification('Mensaje enviado correctamente', 'success');
        this.message.text = '';
      },
      error: (error) => {
        const errorMsg = error?.message || 'Error al enviar el mensaje';
        console.error('Error al enviar el mensaje:', error);
        this.notificationsService.showNotification(errorMsg, 'error');
      }
    });
  }
}
