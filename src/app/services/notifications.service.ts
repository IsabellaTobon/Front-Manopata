import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  // Un BehaviorSubject para mantener el estado del mensaje actual
  private notificationSubject = new BehaviorSubject<{ message: string, type: 'success' | 'error' | 'info' | 'warning' }>({ message: '', type: 'info' });

  // Observable para que otros componentes puedan suscribirse
  notification$ = this.notificationSubject.asObservable();

  // Método para mostrar una notificación
  showNotification(message: string, type: 'success' | 'error' | 'info' | 'warning', duration: number = 3000) {
    this.notificationSubject.next({ message, type });

    // Limpiar el mensaje después del tiempo especificado
    setTimeout(() => {
      this.clearNotification();
    }, duration);
  }

  // Método para limpiar el mensaje de notificación
  clearNotification() {
    this.notificationSubject.next({ message: '', type: 'info' });
  }
}
