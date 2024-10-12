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

  // Variables para la funcionalidad de respuesta
  replyMessage: string = '';
  currentRecipientId: number | null = null;
  currentRecipientNickname: string | null = '';
  currentPostId: number | null = null;
  currentMessageBody: string = '';

  constructor(
    private authService: AuthService,
    private messageService: MessagesService,
    private notificationsService: NotificationsService // Asegúrate de tener este servicio
  ) {}

  ngOnInit(): void {
    // Subscribirse al estado de autenticación
    this.authService.isLoggedIn().subscribe((isLoggedIn) => {
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
            console.error('Error al obtener los datos del perfil:', error);
          },
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
        this.unreadCount = messages.length; // Suponiendo que todas las notificaciones son no leídas
      },
      error: (error) => {
        console.error('Error al obtener los mensajes:', error);
      },
    });
  }

  // Método para abrir el modal de respuesta
  openReplyModal(senderId: number, postId: number, messageBody: string, notification: any): void {
    this.currentRecipientId = senderId;
    this.currentPostId = postId;
    this.currentMessageBody = messageBody; // Mostrar el cuerpo del mensaje

    const sender = this.notifications.find((n) => n.sender.id === senderId);
    if (sender) {
      this.currentRecipientNickname = sender.sender.nickname;
    }

    this.replyMessage = ''; // Limpiar el mensaje anterior

    // Actualizar el contador de notificaciones (restar solo si no ha sido leída antes)
    if (!notification.isRead) {
      notification.isRead = true; // Marcar la notificación como leída
      this.unreadCount = Math.max(this.unreadCount - 1, 0); // Restar el contador
    }

    // Abrir el modal
    const modalElement = document.getElementById('replyModal');
    if (modalElement) {
      const replyModal = new (window as any).bootstrap.Modal(modalElement);
      replyModal.show();
    }
  }

  // Método para enviar la respuesta
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
