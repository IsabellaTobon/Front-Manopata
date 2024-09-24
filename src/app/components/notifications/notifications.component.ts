import { Component, Input, OnInit } from '@angular/core';
import { NotificationsService } from '../../services/notifications.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit{
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'info' | 'warning' = 'info';

  constructor(private notificationsService: NotificationsService) { }

  ngOnInit(): void {
    // Suscribirse al observable del servicio de notificaciones
    this.notificationsService.notification$.subscribe(notification => {
      this.message = notification.message;
      this.type = notification.type;
    });
  }

  // Método opcional para ocultar manualmente el mensaje
  closeNotification(): void {
    this.message = '';
  }
}
