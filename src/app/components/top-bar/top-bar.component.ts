import { Component, EventEmitter, Output } from '@angular/core';
@Component({
  selector: 'top-bar',
  standalone: true,
  imports: [],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css',
})
export class TopBarComponent {

  @Output() loginFormOpened = new EventEmitter<void>();
  @Output() registerFormOpened = new EventEmitter<void>();

  openLoginForm(): void {
    console.log("login from button clicked");
    this.loginFormOpened.emit();
  }

  openRegisterForm(): void {
    console.log("register from button clicked");
    this.registerFormOpened.emit();
  }
}
