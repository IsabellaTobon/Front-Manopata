import { Component, OnInit } from '@angular/core';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { CommentsService, UserComment } from '../../services/comments.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { NotificationsService } from '../../services/notifications.service';
import { NotificationsComponent } from "../notifications/notifications.component"; // Importar el servicio de notificaciones

@Component({
  selector: 'app-opinions',
  standalone: true,
  imports: [StarRatingComponent, CommonModule, FormsModule, NotificationsComponent],
  templateUrl: './opinions.component.html',
  styleUrls: ['./opinions.component.css']
})
export class OpinionsComponent implements OnInit {

  comments: UserComment[] = [];
  newComment: UserComment = { text: '', rating: 0 };
  userRating: number = 0;

  constructor(
    private commentsService: CommentsService,
    private authService: AuthService,
    private notificationsService: NotificationsService // Inyectar el servicio de notificaciones
  ) { }

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.commentsService.getComments().subscribe(comments => {
      this.comments = comments;
    });
  }

  get averageRating(): number {
    if (this.comments.length === 0) return 5;
    const totalRating = this.comments.reduce((sum, comment) => sum + comment.rating, 0);
    return totalRating / this.comments.length;
  }

  submitComment(): void {
    if (!this.authService.isLoggedIn()) {
      this.authService.logout();
      return;
    }

    // Verificar si el rating es mayor que 0
    if (this.newComment.rating === 0) {
      this.notificationsService.showNotification('Por favor selecciona una calificación antes de enviar tu comentario.', 'warning');
      return;
    }

    const commentToSubmit: UserComment = {
      text: this.newComment.text,
      rating: this.newComment.rating
    };

    this.commentsService.postComment(commentToSubmit).subscribe({
      next: (response: any) => {
        // Mostrar notificación de éxito
        this.notificationsService.showNotification(response.message, 'success');

        // Añadir el comentario recién creado al array de comentarios
        this.comments.push(response.comment);

        // Limpiar el formulario
        this.newComment = { text: '', rating: 0 };

        // Cerrar la notificación automáticamente después de 2 segundos
        setTimeout(() => {
          this.notificationsService.clearNotification();
        }, 2000);
      },
      error: (error) => {
        console.error('Error al enviar el comentario:', error);
        this.notificationsService.showNotification('Error al enviar el comentario.', 'error');
      }
    });
  }

  onRatingChange(newRating: number): void {
    this.userRating = newRating;
    console.log('New rating:', newRating);
  }
}
