import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoginSignUpComponent } from '../login-sign-up/login-sign-up.component';

@Component({
  selector: 'top-bar',
  standalone: true,
  imports: [RouterLink, LoginSignUpComponent],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css'
})
export class TopBarComponent {
  constructor(private router: Router) {}
  navigateTo(route:string) {
    this.router.navigate([route]);
  }

}
