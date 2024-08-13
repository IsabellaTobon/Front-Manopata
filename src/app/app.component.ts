import { Component, OnInit } from '@angular/core';
import { TopBarComponent } from "./components/top-bar/top-bar.component";
import { LoginSignUpComponent } from "./components/login-sign-up/login-sign-up.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TopBarComponent, LoginSignUpComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ManoPata';

  showLoginForm = false;
  showRegisterForm = false;

  onLoginFormOpened(): void {
    console.log("onLoginFormOpened triggered");
    this.showLoginForm = true;
    this.showRegisterForm = false;
  }

  onRegisterFormOpened(): void {
    console.log("onRegisterFormOpened triggered");
    this.showLoginForm = false;
    this.showRegisterForm = true;
  }
}
