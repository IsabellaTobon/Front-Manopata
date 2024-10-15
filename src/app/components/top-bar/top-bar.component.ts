import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MessagesService } from '../../services/messages.service';
import { FormsModule } from '@angular/forms';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'top-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
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

  // VARIABLES FOR THE RESPONSE FUNCTIONALITY
  replyMessage: string = '';
  currentRecipientId: number | null = null;
  currentRecipientNickname: string | null = '';
  currentPostId: number | null = null;
  currentMessageBody: string = '';

  constructor(
    private authService: AuthService,
    private messageService: MessagesService,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit(): void {
    // SUBSCRIBE TO AUTHENTICATION STATUS
    this.authService.isLoggedIn().subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;

      if (this.isLoggedIn) {
        // OBTAIN THE NICKNAME AND PROFILE IMAGE URL
        this.nickname = localStorage.getItem('nickname');
        this.authService.getUserData().subscribe({
          next: (data) => {
            this.profileImageUrl = 'http://localhost:8080' + data.photo;

            const userId = data.id;

            this.loadNotifications(userId);
          },
          error: (error) => {
            console.error('Error al obtener los datos del perfil:', error);
          },
        });
      } else {
        this.nickname = null;
        this.profileImageUrl = '';
      }
    });
  }

  // LOAD NOTIFICATIONS FROM THE MESSAGING SERVICE
  loadNotifications(userId: number): void {
    this.messageService.getInboxMessages(userId).subscribe({
      next: (messages) => {
        this.notifications = messages;
        this.unreadCount = messages.length;
      },
      error: (error) => {
        console.error('Error al obtener los mensajes:', error);
      },
    });
  }

  // METHOD TO OPEN THE RESPONSE MODAL
  openReplyModal(senderId: number, postId: number, messageBody: string, notification: any): void {
    this.currentRecipientId = senderId;
    this.currentPostId = postId;
    this.currentMessageBody = messageBody;

    const sender = this.notifications.find((n) => n.sender.id === senderId);
    if (sender) {
      this.currentRecipientNickname = sender.sender.nickname;
    }

    this.replyMessage = '';

    // UPDATE NOTIFICATION COUNTER (SUBTRACT ONLY IF NOT READ BEFORE)
    if (!notification.isRead) {
      notification.isRead = true;
      this.unreadCount = Math.max(this.unreadCount - 1, 0); // SUBTRACT THE COUNTER
    }

    // OPEN MODAL
    const modalElement = document.getElementById('replyModal');
    if (modalElement) {
      const replyModal = new (window as any).bootstrap.Modal(modalElement);
      replyModal.show();
    }
  }

  // METHOD FOR SENDING THE RESPONSE
  sendReply(): void {
    if (this.currentRecipientId && this.replyMessage.trim()) {
      const senderId = this.authService.getUserId();
      if (!senderId) {
        console.error('No se pudo obtener el ID del usuario actual.');
        return;
      }

      if (!this.currentPostId) {
        console.error('No se encontró un postId válido.');
        this.notificationsService.showNotification(
          'No se pudo encontrar el post relacionado.',
          'error'
        );
        return;
      }

      this.messageService
        .sendMessage({
          senderId: +senderId,
          recipientId: this.currentRecipientId,
          bodyText: this.replyMessage,
          postId: this.currentPostId,
        })
        .subscribe({
          next: () => {
            const replyModalElement = document.getElementById('replyModal');
            if (replyModalElement) {
              const replyModal = (window as any).bootstrap.Modal.getInstance(
                replyModalElement
              );
              replyModal?.hide();
            }
            this.replyMessage = '';
            this.notificationsService.showNotification(
              'Mensaje enviado con éxito.',
              'success'
            );
          },
          error: (error) => {
            console.error('Error al enviar el mensaje:', error);
            this.notificationsService.showNotification(
              'Error al enviar el mensaje.',
              'error'
            );
          },
        });
    }
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
