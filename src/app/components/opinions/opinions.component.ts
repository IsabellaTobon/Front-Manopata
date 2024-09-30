import { Component, OnInit } from '@angular/core';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { CommentsService, UserComment } from '../../services/comments.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { NotificationsService } from '../../services/notifications.service'; // Importar el servicio de notificaciones

@Component({
  selector: 'app-opinions',
  standalone: true,
  imports: [StarRatingComponent, CommonModule, FormsModule],
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
      this.notificationsService.showNotification('Debe iniciar sesión para enviar un comentario.', 'warning'); // Notificación de advertencia
      this.authService.logout();
      return;
    }

    // Verificar si el rating es mayor que 0
    if (this.newComment.rating === 0) {
      this.notificationsService.showNotification('Por favor selecciona una calificación antes de enviar tu comentario.', 'error'); // Notificación de error
      return;
    }

    const commentToSubmit: UserComment = {
      text: this.newComment.text,
      rating: this.newComment.rating
    };

    this.commentsService.postComment(commentToSubmit).subscribe(
      (response: UserComment) => {
        this.comments.push(response); // Añadir el nuevo comentario al array de comentarios
        this.newComment = { text: '', rating: 0 }; // Limpiar el formulario
        this.notificationsService.showNotification('Comentario enviado exitosamente.', 'success', 2000); // Notificación de éxito que se cierra en 2 segundos
      },
      (error) => {
        this.notificationsService.showNotification('Error al enviar el comentario.', 'error', 2000); // Notificación de error
        console.error('Error al enviar el comentario:', error);
      }
    );
  }

  onRatingChange(newRating: number): void {
    this.userRating = newRating;
    console.log('New rating:', newRating);
  }
}
