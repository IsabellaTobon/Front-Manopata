import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginSignUpComponent } from '../login-sign-up/login-sign-up.component';

@Component({
  selector: 'top-bar',
  standalone: true,
  imports: [RouterLink, LoginSignUpComponent],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css'
})
export class TopBarComponent {

}
