import { Component, OnInit } from '@angular/core';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { CommentsService, UserComment } from '../../services/comments.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-opinions',
  standalone: true,
  imports: [StarRatingComponent, CommonModule],
  templateUrl: './opinions.component.html',
  styleUrl: './opinions.component.css'
})
export class OpinionsComponent implements OnInit {

  comments: UserComment[] = [];
  userRating: number = 0;

  constructor(private commentsService: CommentsService) { }

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



  onRatingChange(newRating: number): void {
    this.userRating = newRating;
    console.log('New rating:', newRating);
  }
}
