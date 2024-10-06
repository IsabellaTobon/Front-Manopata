import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MessagesService } from '../../services/messages.service';
@Component({
  selector: 'top-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
})
export class TopBarComponent implements OnInit {

  @Output() loginFormOpened = new EventEmitter<void>();
  @Output() registerFormOpened = new EventEmitter<void>();

  isLoggedIn: boolean = false;
  nickname: string | null = '';
  profileImageUrl: string = '';

  notifications: any[] = [];
  unreadCount: number = 0;

  constructor(
    private authService: AuthService,
    private messageService: MessagesService
  ) {}

  ngOnInit(): void {
    // Subscribirse al estado de autenticación
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;

      if (this.isLoggedIn) {
        // Obtener el nickname del localStorage
        this.nickname = localStorage.getItem('nickname');
        this.authService.getUserData().subscribe({
          next: (data) => {
            this.profileImageUrl = 'http://localhost:8080' + data.photo;

            const userId = data.id;

            this.loadNotifications(userId);
          },
          error: (error) => {
            console.error('Error fetching profile:', error);
          }
        });
      } else {
        this.nickname = null;
        this.profileImageUrl = '';
      }
    });
  }

  // Cargar las notificaciones desde el servicio de mensajes
  loadNotifications(userId: number): void {
    this.messageService.getInboxMessages(userId).subscribe({
      next: (messages) => {
        this.notifications = messages;
        this.unreadCount = messages.length;  // Suponiendo que todas las notificaciones son no leídas
      },
      error: (error) => {
        console.error('Error fetching messages:', error);
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  openLoginForm(): void {
    this.loginFormOpened.emit();
  }

  openRegisterForm(): void {
    this.registerFormOpened.emit();
  }
}
