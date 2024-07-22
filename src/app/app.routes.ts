import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AdoptionsComponent } from './components/adoptions/adoptions.component';
import { ProtectorsComponent } from './components/protectors/protectors.component';
import { ContactComponent } from './components/contact/contact.component';
import { LoginSignUpComponent } from './components/login-sign-up/login-sign-up.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'adoptions', component: AdoptionsComponent },
  { path: 'protectors', component: ProtectorsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login-sign-up', component: LoginSignUpComponent },
  { path: "**", component: NotFoundComponent }
];
