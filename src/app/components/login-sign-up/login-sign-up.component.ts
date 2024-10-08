import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from '../notifications/notifications.component';
import { ReactiveFormsModule } from '@angular/forms'; // Para los formularios reactivos

@Component({
  selector: 'app-login-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    NotificationsComponent,
    ReactiveFormsModule // Importar ReactiveFormsModule
  ],
  templateUrl: './login-sign-up.component.html',
  styleUrls: ['./login-sign-up.component.css'],
})
export class LoginSignUpComponent implements OnInit {

  @Input() showLoginForm: boolean = false;
  @Input() showRegisterForm: boolean = false;
  @Input() showForgotPasswordForm: boolean = false;

  errorMessage: string = '';
  notificationType: 'success' | 'error' | 'info' | 'warning' = 'info';
  serverErrors: any = {};

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  loginForm: FormGroup = new FormGroup({});
  registerForm: FormGroup = new FormGroup({});
  forgotPasswordForm: FormGroup = new FormGroup({});

  ngOnInit(): void {
    // Inicializar el formulario de login
    this.loginForm = this.fb.group({
      nickname: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]+$/),
        Validators.minLength(3),
        Validators.maxLength(20)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(20)
      ]],
    });

    // Inicializar el formulario de registro
    this.registerForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/),
        Validators.minLength(3),
        Validators.maxLength(30),
      ]],
      lastname: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/),
        Validators.minLength(3),
        Validators.maxLength(30),
      ]],
      nickname: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]+$/),
        Validators.minLength(3),
        Validators.maxLength(20),
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/),  // Alfanumérica, distingue entre mayúsculas y minúsculas
        Validators.minLength(8),
        Validators.maxLength(20),
      ]],
      confirmPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
      ]],
    }, { validator: this.passwordMatchValidator });

    // Inicializar el formulario de forgot password
    this.forgotPasswordForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
      ]],
    });
  }

  // Valida si las contraseñas coinciden
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmitRegister(): void {
    if (this.registerForm.invalid) {
      this.notificationType = 'warning';
      this.errorMessage = 'Por favor, completa todos los campos correctamente';
      return;
    }

    const { name, lastname, nickname, email, password, confirmPassword } = this.registerForm.value;
    if (password !== confirmPassword) {
      this.notificationType = 'error';
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.authService.register(nickname, name, lastname, email, password).subscribe(
      () => {
        this.notificationType = 'success';
        this.errorMessage = 'Registro exitoso. Ahora puedes iniciar sesión';
        this.openLoginForm(); // Cambio para asegurarnos de que esta función exista
      },
      (error) => {
        this.notificationType = 'error';
        this.errorMessage = error.message || 'Error durante el registro';
      }
    );
  }

  onSubmitLogin(): void {
    const { nickname, password } = this.loginForm.value;
    this.authService.login(nickname, password).subscribe(
      (response) => {
        this.notificationType = 'success';
        this.errorMessage = 'Inicio de sesión exitoso';

        // Cierra el modal automáticamente cuando el inicio de sesión es exitoso
        setTimeout(() => {
          this.closeForms();  // Cierra el modal
        }, 1000);  // Puedes ajustar el tiempo si es necesario (1 segundo en este caso)

      },
      (error) => {
        this.notificationType = 'error';
        this.errorMessage = 'Usuario o contraseña incorrectos';
      }
    );
  }

  // Método para manejar el envío del formulario de "Olvidé mi contraseña"
  onSubmitForgotPassword(): void {
    if (this.forgotPasswordForm.invalid) {
      this.notificationType = 'warning';
      this.errorMessage = 'Por favor, ingresa un correo electrónico válido';
      return;
    }

    const email = this.forgotPasswordForm.value.email;
    this.authService.forgotPassword(email).subscribe(
      () => {
        this.notificationType = 'success';
        this.errorMessage = 'Enlace de restablecimiento de contraseña enviado a tu correo';
      },
      (error) => {
        this.notificationType = 'error';
        this.errorMessage = error.message || 'Error al enviar el enlace de restablecimiento';
      }
    );
  }

  openLoginForm(): void {
    this.showLoginForm = true;
    this.showRegisterForm = false;
    this.showForgotPasswordForm = false;
    this.loginForm.reset();
  }

  openRegisterForm(): void {
    this.showLoginForm = false;
    this.showRegisterForm = true;
    this.showForgotPasswordForm = false;
    this.registerForm.reset();
  }

  openForgotPasswordForm(): void {
    this.showLoginForm = false;
    this.showRegisterForm = false;
    this.showForgotPasswordForm = true;
    this.forgotPasswordForm.reset();
  }

  closeForms(): void {
    this.showLoginForm = false;
    this.showRegisterForm = false;
    this.showForgotPasswordForm = false;
  }
}
