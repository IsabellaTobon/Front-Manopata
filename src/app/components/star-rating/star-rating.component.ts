import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.css'
})
export class StarRatingComponent {
  @Input() rating: number = 0;
  @Input() readonly: boolean = false;
  @Output() ratingChange = new EventEmitter<number>();

  onStarClick(index: number): void {
    if (this.readonly) return;
    this.rating = index + 1;
    this.ratingChange.emit(this.rating);
  }

  getStars(): number[] {
    return Array(5).fill(0).map((_, index) => index);
  }

}
