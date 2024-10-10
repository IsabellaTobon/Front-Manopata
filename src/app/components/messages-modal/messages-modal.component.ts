import { Component, Input, OnInit } from '@angular/core';
import { MessagesService } from '../../services/messages.service';
import { CommonModule } from '@angular/common'; // Importar CommonModule para funciones comunes
import { FormsModule } from '@angular/forms'; // Importar FormsModule para el uso de [(ngModel)]

@Component({
  selector: 'app-messages-modal',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importar módulos necesarios
  templateUrl: './messages-modal.component.html',
  styleUrls: ['./messages-modal.component.css'] // Cambiado a "styleUrls" (plural)
})
export class MessagesModalComponent implements OnInit {

  @Input() userId: number = 0; // ID del usuario autenticado
  messages: any[] = []; // Mensajes recibidos (bandeja de entrada)
  chatHistory: any[] = []; // Historial de mensajes con un usuario específico
  selectedUserId: number = 0; // ID del usuario seleccionado para ver el historial de mensajes
  messageText: string = ''; // Texto del nuevo mensaje

  constructor(private messagesService: MessagesService) {}

  ngOnInit(): void {
    this.loadInboxMessages(); // Cargar la bandeja de entrada al iniciar
  }

  // Cargar la bandeja de entrada (mensajes recibidos)
  loadInboxMessages(): void {
    if (this.userId) {
      this.messagesService.getInboxMessages(this.userId).subscribe((messages) => {
        this.messages = messages;
      });
    }
  }

  // Cargar historial de mensajes con un usuario específico
  loadChatHistory(receiverId: number): void {
    if (this.userId && receiverId) {
      this.messagesService.getChatHistory(this.userId, receiverId).subscribe((messages) => {
        this.chatHistory = messages;
        this.selectedUserId = receiverId; // Almacena el usuario con el que se está chateando
      });
    }
  }

  // Enviar un mensaje en la conversación actual
  sendMessage(): void {
    if (this.messageText.trim()) {
      this.messagesService.sendMessage(this.userId, this.selectedUserId, this.messageText, 0).subscribe(() => {
        this.loadChatHistory(this.selectedUserId); // Recargar el historial de mensajes después de enviar
        this.messageText = ''; // Limpiar el campo de texto
      });
    }
  }

  // Método para cerrar el modal
  closeModal(): void {
    // Aquí puedes agregar la lógica para cerrar el modal desde el componente padre o global
  }
}
