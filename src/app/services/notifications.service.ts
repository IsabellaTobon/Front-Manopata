import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  // BEHAVIORSUBJECT TO MAINTAIN THE STATE OF THE CURRENT MESSAGE
  private notificationSubject = new BehaviorSubject<{ message: string, type: 'success' | 'error' | 'info' | 'warning' }>({ message: '', type: 'info' });

  // OBSERVABLE SO OTHER COMPONENTS CAN SUBSCRIBE
  notification$ = this.notificationSubject.asObservable();

  // METHOD TO SHOW A NOTIFICATION
  showNotification(message: string, type: 'success' | 'error' | 'info' | 'warning', duration: number = 3000) {
    this.notificationSubject.next({ message, type });

    // CLEAR THE NOTIFICATION AFTER A SPECIFIED DURATION
    setTimeout(() => {
      this.clearNotification();
    }, duration);
  }

  // METHOD TO CLEAR THE NOTIFICATION
  clearNotification() {
    this.notificationSubject.next({ message: '', type: 'info' });
  }
}
