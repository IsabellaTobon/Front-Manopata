import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NotificationsService } from '../../services/notifications.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  editProfileForm!: FormGroup;
  changePasswordForm!: FormGroup;
  deleteAccountForm!: FormGroup;
  selectedOption: string = 'edit';
  profileImageUrl: string = 'http://localhost:8080/images/default-image.webp'; // URL pública de la imagen predeterminada
  selectedFile: File | null = null;
  userProfile: any;

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
      this.authService.getUserData().subscribe(
        (data) => {
          this.userProfile = data;
          this.updateForms();
        },
        (error) => {
          console.error('Error fetching profile:', error);
        }
      );
    } else {
      console.error('User ID is undefined, cannot fetch profile.');
    }
  }

  // Inicializar los formularios con los datos del usuario
  initForms(): void {
    this.editProfileForm = this.fb.group({
      name: [this.userProfile?.name || '', Validators.required],
      lastName: [this.userProfile?.lastName || '', Validators.required],
      email: [this.userProfile?.email || '', [Validators.required, Validators.email]],
      nickname: [this.userProfile?.nickname || '', Validators.required],
      password: ['', Validators.minLength(6)]  // Contraseña opcional
    });

    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.deleteAccountForm = this.fb.group({
      password: ['', Validators.required],
    });
  }

  // Actualiza los valores de los formularios una vez que se cargan los datos del usuario
  updateForms(): void {
    this.editProfileForm.patchValue({
      name: this.userProfile?.name || '',
      lastName: this.userProfile?.lastName || '',
      email: this.userProfile?.email || '',
      nickname: this.userProfile?.nickname || ''
    });

    if (this.userProfile?.profileImageUrl) {
      this.profileImageUrl = this.userProfile.profileImageUrl;
    }
  }

  // Seleccionar una opción en el panel lateral
  selectOption(option: string): void {
    this.selectedOption = option;
  }

  // Manejar el envío del formulario de edición de perfil
  onSubmit(): void {
    if (this.editProfileForm.valid) {
      const formData = new FormData();
      formData.append('name', this.editProfileForm.get('name')?.value ?? '');
      formData.append('lastName', this.editProfileForm.get('lastName')?.value ?? '');
      formData.append('email', this.editProfileForm.get('email')?.value ?? '');
      formData.append('nickname', this.editProfileForm.get('nickname')?.value ?? '');
      if (this.editProfileForm.get('password')?.value) {
        formData.append('password', this.editProfileForm.get('password')?.value ?? '');
      }
      if (this.selectedFile) {
        formData.append('profileImage', this.selectedFile);
      }

      this.http.put(`/api/user/${this.authService.getUserId()}`, formData).subscribe({
        next: () => {
          this.notificationService.showNotification('Perfil actualizado con éxito', 'success');
        },
        error: () => {
          this.notificationService.showNotification('Error al actualizar el perfil', 'error');
        }
      });
    }
  }

  // Manejar el cambio de contraseña
  onChangePassword(): void {
    if (this.changePasswordForm.valid) {
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

  // Manejar la eliminación de la cuenta
  onDeleteAccount(): void {
    if (this.deleteAccountForm.valid) {
      const password = this.deleteAccountForm.get('password')?.value;
      this.authService.deleteAccount(password).subscribe({
        next: () => {
          this.notificationService.showNotification('Cuenta eliminada', 'success');
          window.location.href = '/';  // Redirigir al inicio tras eliminar la cuenta
        },
        error: () => {
          this.notificationService.showNotification('Error al eliminar la cuenta', 'error');
        }
      });
    }
  }

  // Manejar la selección de archivo para la imagen de perfil
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImageUrl = e.target.result;  // Actualiza la vista previa de la imagen
      };
      reader.readAsDataURL(file);
    }
  }
}
