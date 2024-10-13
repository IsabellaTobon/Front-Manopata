import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NotificationsService } from '../../services/notifications.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  editProfileForm!: FormGroup;
  changePasswordForm!: FormGroup;
  deleteAccountForm!: FormGroup;
  selectedOption: string = 'edit';
  profileImageUrl: string = '';
  selectedFile: File | null = null;
  userProfile: any;
  passwordsDoNotMatch: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationsService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initForms();

    const userId = this.authService.getUserId();
    if (userId) {
      this.authService.getUserData().subscribe({
        next: (data) => {
          this.userProfile = data;
          this.profileImageUrl = 'http://localhost:8080' + this.userProfile.photo;
          this.updateForms();
        },
        error: (error) => {
          console.error('Error fetching profile:', error);
        }
      });
    }

    // SUBSCRIBE TO PROFILE PICTURE CHANGES
    this.authService.profileImageChanged$.subscribe((newImageUrl) => {
      if (this.userProfile) {
        this.profileImageUrl = newImageUrl;
      }
    });
  }

  // INITIALIZE FORMS
  initForms(): void {
    this.editProfileForm = this.fb.group({
      name: [''],
      lastName: [''],
      email: ['', [Validators.email]],
      nickname: [''],
      password: ['', Validators.required]
    });

    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', Validators.required]
    });

    this.deleteAccountForm = this.fb.group({
      password: ['', Validators.required],
    });

    this.changePasswordForm.valueChanges.subscribe(() => {
      this.validatePasswords();
    });
  }

  // UPDATES FORM VALUES ​​WITH USER DATA
  updateForms(): void {
    this.editProfileForm.patchValue({
      name: this.userProfile?.name || '',
      lastName: this.userProfile?.lastname || '',
      email: this.userProfile?.email || '',
      nickname: this.userProfile?.nickname || '',
      profileImageUrl: this.userProfile?.photo || ''
    });
  }

  // VALIDATE THAT PASSWORDS MATCH
  validatePasswords(): void {
    const newPassword = this.changePasswordForm.get('newPassword')?.value;
    const confirmNewPassword = this.changePasswordForm.get('confirmNewPassword')?.value;
    this.passwordsDoNotMatch = newPassword !== confirmNewPassword;
  }

  // HANDLE PASSWORD CHANGE
  onChangePassword(): void {
    if (this.changePasswordForm.valid && !this.passwordsDoNotMatch) {
      const { oldPassword, newPassword } = this.changePasswordForm.value;
      this.authService.changePassword(oldPassword, newPassword).subscribe({
        next: () => {
          this.notificationService.showNotification('Contraseña cambiada con éxito', 'success');
        },
        error: () => {
          this.notificationService.showNotification('Error al cambiar la contraseña', 'error');
        }
      });
    }
  }

  // HANDLE PROFILE EDIT FORM SUBMISSION
  onSubmit(): void {
    if (this.editProfileForm.valid) {
      const userId = this.authService.getUserId();
      const userData = this.editProfileForm.value;

      // UPDATE USER DATA
      this.authService.updateUserProfile(userData).subscribe({
        next: () => {
          this.notificationService.showNotification('Perfil actualizado con éxito', 'success');
        },
        error: () => {
          this.notificationService.showNotification('Error al actualizar el perfil', 'error');
        }
      });
    }
  }

  // HANDLE FILE SELECTION FOR PROFILE PICTURE
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // VERIFY THAT THE FILE IS AN IMAGE
      const validImageTypes = ['image/jpeg', 'image/png'];
      if (!validImageTypes.includes(file.type)) {
        this.notificationService.showNotification('El archivo seleccionado no es una imagen válida', 'error');
        return;
      }

      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImageUrl = e.target.result;  // SHOW IMAGE PREVIEW
      };
      reader.readAsDataURL(file);
    }
  }

  // MANAGE PROFILE PICTURE CHANGE
  onSaveProfileImage(): void {
    if (this.selectedFile) {

      const formData = new FormData();
      formData.append('image', this.selectedFile);

      this.authService.updateProfileImage(this.selectedFile).subscribe({
        next: (response: any) => {
          this.profileImageUrl = `http://localhost:8080/uploads/${response.fileName}`;
          this.notificationService.showNotification('Imagen de perfil actualizada', 'success');
        },
        error: (err) => {
          this.notificationService.showNotification('Error al actualizar la imagen de perfil', 'error');
        }
      });
    }
  }

  // MANAGE ACCOUNT DEACTIVATION
  onDeleteAccount(): void {
    if (this.deleteAccountForm.valid) {
      const password = this.deleteAccountForm.get('password')?.value;
      this.authService.deactivateAccount(password).subscribe({
        next: () => {
          this.notificationService.showNotification('Cuenta desactivada', 'success');
          window.location.href = '/';
        },
        error: () => {
          this.notificationService.showNotification('Error al desactivar la cuenta', 'error');
        }
      });
    }
  }

  // SELECT AN OPTION FROM THE SIDE PANEL
  selectOption(option: string): void {
    this.selectedOption = option;
  }
}
