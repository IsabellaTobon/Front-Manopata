import { Component, Input, OnInit } from '@angular/core';
import { MessagesService } from '../../services/messages.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-messages-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messages-modal.component.html',
  styleUrl: './messages-modal.component.css'
})
export class MessagesModalComponent implements OnInit {

  @Input() userId: number = 0;
  messages: any[] = [];
  chatHistory: any[] = [];
  selectedUserId: number = 0;
  messageText: string = '';

  constructor(private messagesService: MessagesService) {}

  ngOnInit(): void {
    this.loadInboxMessages(); // CHARGE INBOX MESSAGES
  }

  // LOAD INBOX MESSAGES METHOD
  loadInboxMessages(): void {
    if (this.userId) {
      this.messagesService.getInboxMessages(this.userId).subscribe((messages) => {
        this.messages = messages;
      });
    }
  }

  // LOAD CHAT HISTORY METHOD
  loadChatHistory(receiverId: number): void {
    if (this.userId && receiverId) {
      this.messagesService.getChatHistory(this.userId, receiverId).subscribe((messages) => {
        this.chatHistory = messages;
        this.selectedUserId = receiverId; // STORES THE USER YOU ARE CHATTING WITH
      });
    }
  }

  // SEND MESSAGE INTO THE CHAT
  sendMessage(): void {
    if (this.messageText.trim()) {
      this.messagesService.sendMessage({
        senderId: this.userId,
        recipientId: this.selectedUserId,
        bodyText: this.messageText,
        postId: 0
      }).subscribe(() => {
        this.loadChatHistory(this.selectedUserId); // RELOAD THE CHAT HISTORY AFTER SENDING THE MESSAGE
        this.messageText = ''; // CLEAN THE MESSAGE TEXT AREA
      });
    }
  }

  closeModal(): void {

  }
}
