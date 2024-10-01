import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AdoptionsComponent } from './components/adoptions/adoptions.component';
import { ProtectorsComponent } from './components/protectors/protectors.component';
import { ContactComponent } from './components/contact/contact.component';
import { LoginSignUpComponent } from './components/login-sign-up/login-sign-up.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { OpinionsComponent } from './components/opinions/opinions.component';
import { SpecificPostComponent } from './components/specific-post/specific-post.component';
import { UploadPostComponent } from './components/upload-post/upload-post.component';
import { EditProfileComponent } from './components/edit-profile-component/edit-profile.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'adoptions', component: AdoptionsComponent },
  { path: 'upload-post', component: UploadPostComponent },
  { path: 'specific-post/:id', component: SpecificPostComponent },
  { path: 'protectors', component: ProtectorsComponent },
  { path: 'opinions',  component: OpinionsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login-sign-up', component: LoginSignUpComponent },
  { path: 'edit-profile', component: EditProfileComponent },
  { path: "**", component: NotFoundComponent }
];
