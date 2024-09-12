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
  @Input() type: 'success' | 'error' | 'info' | 'warning' = 'info';  // Tipo de notificación
  @Input() duration: number = 3000;  // Tiempo antes de que desaparezca (opcional)

  ngOnInit(): void {
    if (this.duration > 0) {
      setTimeout(() => {
        this.message = '';
      }, this.duration);  // Ocultar después de la duración especificada
    }
  }

  // Método opcional para ocultar manualmente el mensaje
  closeNotification(): void {
    this.message = '';
  }
}
