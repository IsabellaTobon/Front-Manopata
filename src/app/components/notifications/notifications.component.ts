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
    // SUBSCRIBE TO THE NOTIFICATION SERVICE OBSERVABLE
    this.notificationsService.notification$.subscribe(notification => {
      this.message = notification.message;
      this.type = notification.type;
    });
  }

  // OPTIONAL METHOD TO MANUALLY HIDE THE MESSAGE
  closeNotification(): void {
    this.message = '';
  }
}
