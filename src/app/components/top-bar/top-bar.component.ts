import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribirse al estado de autenticación
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;

      if (this.isLoggedIn) {
        // Obtener el nickname del localStorage
        this.nickname = localStorage.getItem('nickname');
      } else {
        this.nickname = null;
      }
    });
  }

  logout(): void {
    this.authService.logout();  // Llamar al método de logout
  }

  openLoginForm(): void {
    this.loginFormOpened.emit();
  }

  openRegisterForm(): void {
    this.registerFormOpened.emit();
  }
}
