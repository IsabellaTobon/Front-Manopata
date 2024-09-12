import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit{
  @Input() message: string = '';

  ngOnInit(): void {
    setTimeout(() => {
      this.message = '';
    }, 3000);  // Ocultar después de 3 segundos
  }
}
