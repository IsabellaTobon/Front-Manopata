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
  extraComments: UserComment[] = [];
  showExtraComments: boolean = false;
  newComment: UserComment = { text: '', rating: 0 };
  userRating: number = 0;
  isSubmitting: boolean = false;

  constructor(
    private commentsService: CommentsService,
    private authService: AuthService,
    private notificationsService: NotificationsService
  ) { }

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.commentsService.getComments().subscribe(comments => {

       // Ordenar los comentarios por fecha de más reciente a más antiguo
    comments.sort((a, b) => new Date(b.commentDate!).getTime() - new Date(a.commentDate!).getTime());

      // Mostrar solo los primeros 3 comentarios, el resto va a extraComments
      this.comments = comments.slice(0, 3);
      this.extraComments = comments.slice(3);
    });
  }

  get averageRating(): number {
    const allComments = [...this.comments, ...this.extraComments]; // Combinar ambos arrays
    if (allComments.length === 0) return 5; // Si no hay comentarios, retornar 5 como valor predeterminado
    const totalRating = allComments.reduce((sum, comment) => sum + comment.rating, 0);
    return totalRating / allComments.length; // Calcular la media de todos los comentarios
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

    this.isSubmitting = true; // Iniciar el estado de envío

    const commentToSubmit: UserComment = {
      text: this.newComment.text,
      rating: this.newComment.rating
      // No incluimos commentDate, el servidor lo manejará automáticamente
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

        this.isSubmitting = false; // Restablecer el estado de envío
      },
      error: (error) => {
        this.notificationsService.showNotification('Error al enviar el comentario.', 'error');
        this.isSubmitting = false; // Restablecer el estado de envío
      }
    });
  }

  // Mostrar todos los comentarios adicionales
  viewAllComments(): void {
    this.showExtraComments = true; // Mostrar los comentarios adicionales
  }

  // Ocultar los comentarios adicionales
  hideExtraComments(): void {
    this.showExtraComments = false; // Ocultar los comentarios adicionales
  }

  onRatingChange(newRating: number): void {
    this.userRating = newRating;
  }
}
