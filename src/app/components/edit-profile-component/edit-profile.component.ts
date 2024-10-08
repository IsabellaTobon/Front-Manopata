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

    // Suscribirse a los cambios de la imagen de perfil
    this.authService.profileImageChanged$.subscribe((newImageUrl) => {
      if (this.userProfile) {
        this.profileImageUrl = newImageUrl;
      }
    });
  }

  // Inicializar formularios
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

  // Actualiza los valores de los formularios con los datos del usuario
  updateForms(): void {
    this.editProfileForm.patchValue({
      name: this.userProfile?.name || '',
      lastName: this.userProfile?.lastname || '',
      email: this.userProfile?.email || '',
      nickname: this.userProfile?.nickname || '',
      profileImageUrl: this.userProfile?.photo || ''
    });
  }

  // Validar que las contraseñas coincidan
  validatePasswords(): void {
    const newPassword = this.changePasswordForm.get('newPassword')?.value;
    const confirmNewPassword = this.changePasswordForm.get('confirmNewPassword')?.value;
    this.passwordsDoNotMatch = newPassword !== confirmNewPassword;
  }

  // Manejar el cambio de contraseña
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

  // Manejar el envío del formulario de edición de perfil
  onSubmit(): void {
    if (this.editProfileForm.valid) {
      const userId = this.authService.getUserId(); // Obtener el ID del usuario
      const userData = this.editProfileForm.value;

      // Actualizar el perfil del usuario
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

  // Manejar la selección de archivo para la imagen de perfil
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Verificar si el archivo es una imagen
      const validImageTypes = ['image/jpeg', 'image/png'];
      if (!validImageTypes.includes(file.type)) {
        this.notificationService.showNotification('El archivo seleccionado no es una imagen válida', 'error');
        return;
      }

      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImageUrl = e.target.result;  // Mostrar vista previa de la imagen
      };
      reader.readAsDataURL(file);
    }
  }

  // Manejar el cambio de imagen de perfil
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

  // Manejar la desactivación de la cuenta
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

  // Seleccionar una opción del panel lateral
  selectOption(option: string): void {
    this.selectedOption = option;
  }
}
