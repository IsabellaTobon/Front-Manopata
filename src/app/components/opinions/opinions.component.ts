import { Component, OnInit } from '@angular/core';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { CommentsService, UserComment } from '../../services/comments.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { NotificationsService } from '../../services/notifications.service';
import { NotificationsComponent } from '../notifications/notifications.component'; // Importar el servicio de notificaciones

@Component({
  selector: 'app-opinions',
  standalone: true,
  imports: [
    StarRatingComponent,
    CommonModule,
    FormsModule,
    NotificationsComponent,
  ],
  templateUrl: './opinions.component.html',
  styleUrls: ['./opinions.component.css'],
})
export class OpinionsComponent implements OnInit {
  comments: UserComment[] = [];
  extraComments: UserComment[] = [];
  showExtraComments: boolean = false;
  newComment: UserComment = {
    text: '',
    rating: 0,
    user: { name: '', nickname: '' },
  };
  userRating: number = 0;
  isSubmitting: boolean = false;

  constructor(
    private commentsService: CommentsService,
    private authService: AuthService,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.commentsService.getComments().subscribe((comments) => {
      // SORT COMMENTS BY DATE FROM NEWEST TO OLDEST
      comments.sort(
        (a, b) =>
          new Date(b.commentDate!).getTime() -
          new Date(a.commentDate!).getTime()
      );

      // SHOW ONLY THE FIRST 3 COMMENTS, THE REST GO TO EXTRACOMMENTS
      this.comments = comments.slice(0, 3);
      this.extraComments = comments.slice(3);
    });
  }

  // FUNCTION TO CHECK IF A URL IS EXTERNAL
  isExternalUrl(url: string): boolean {
    return /^https?:\/\//.test(url);
  }

  get averageRating(): number {
    const allComments = [...this.comments, ...this.extraComments]; // COMBINE BOTH ARRAYS
    if (allComments.length === 0) return 5; // IF THERE ARE NO COMMENTS, RETURN 5 AS DEFAULT VALUE
    const totalRating = allComments.reduce(
      (sum, comment) => sum + comment.rating,
      0
    );
    return totalRating / allComments.length; // CALCULATE THE AVERAGE OF ALL COMMENTS
  }

  submitComment(): void {
    if (!this.authService.isLoggedIn()) {
      this.authService.logout();
      return;
    }

    // CHECK IF THE RATING IS GREATER THAN 0
    if (this.newComment.rating === 0 || !this.newComment.text) {
      this.notificationsService.showNotification(
        'Por favor completa el comentario y selecciona una calificación antes de enviar.',
        'warning'
      );
      return;
    }

    this.isSubmitting = true; // START SHIPPING STATUS

    // CREATE THE COMMENT OBJECT TO SEND TO THE BACKEND
    const commentToSubmit: UserComment = {
      text: this.newComment.text,
      rating: this.newComment.rating,
      commentDate: new Date(),
      user: this.newComment.user, // USER DATA IS ALREADY FILLED IN
    };

    this.commentsService.postComment(commentToSubmit).subscribe({
      next: (response: any) => {

        this.notificationsService.showNotification(response.message, 'success');

        // ADD THE NEWLY CREATED COMMENT TO THE COMMENTS ARRAY
        this.comments.push(response.comment);

        // CLEAR FORM
        this.newComment = {
          text: '',
          rating: 0,
          user: { name: '', nickname: '' },
        };

        // CLOSE THE FORM AFTER 2 SECONDS
        setTimeout(() => {
          this.notificationsService.clearNotification();
        }, 2000);

        this.isSubmitting = false; // RESET SHIPPING STATUS
      },
      error: (error) => {
        this.notificationsService.showNotification(
          'Error al enviar el comentario.',
          'error'
        );
        this.isSubmitting = false; // RESET SHIPPING STATUS
      },
    });
  }
  // SHOW ALL COMMENTS ADDITIONALS
  viewAllComments(): void {
    this.showExtraComments = true;
  }

  // HIDE ADDITIONAL COMMENTS
  hideExtraComments(): void {
    this.showExtraComments = false;
  }

  onRatingChange(newRating: number): void {
    this.userRating = newRating;
  }
}
