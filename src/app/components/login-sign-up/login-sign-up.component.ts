import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { catchError, map, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from '../notifications/notifications.component';


@Component({
  selector: 'app-login-sign-up',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NotificationsComponent
  ],
  templateUrl: './login-sign-up.component.html',
  styleUrl: './login-sign-up.component.css'
})
export class LoginSignUpComponent implements OnInit{

  @Input() showLoginForm: Boolean = false;
  @Input() showRegisterForm: Boolean = false;
  @Input() showForgotPasswordForm: Boolean = false;

  errorMessage: string = '';
  notificationType: 'success' | 'error' | 'info' | 'warning' = 'info';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  loginForm: FormGroup = new FormGroup({
    nickname: new FormControl(""),
    password: new FormControl("")
  })

  registerForm: FormGroup = new FormGroup({
    name: new FormControl(""),
    lastname: new FormControl(""),
    nickname: new FormControl(""),
    email: new FormControl(""),
    password: new FormControl(""),
    confirmPassword: new FormControl("")
  })

  forgotPasswordForm: FormGroup = new FormGroup({
    email: new FormControl("")
  });

  changePasswordForm: FormGroup = new FormGroup({
    nickname: new FormControl(''),
    oldPassword: new FormControl(''),
    newPassword: new FormControl('')
  });

  resetPasswordForm: FormGroup = new FormGroup({
    newPassword: new FormControl('')
  });

  ngOnInit(): void {
     // Inicializar el formulario de login
    this.loginForm = this.fb.group({
      nickname: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(20)]]
    })

    // Inicializar el formulario de registro
    this.registerForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ]],
      lastname: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ]],
      nickname: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ]],
      confirmPassword: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ]]
    }, { validator: this.passwordMatchValidator });

    // Inicializar el formulario de forgot password
  this.forgotPasswordForm = this.fb.group({
    email: ['', [
      Validators.required,
      Validators.email
    ]]
  });

  // Inicializar el formulario de cambio de contraseña
  this.changePasswordForm = this.fb.group({
    nickname: ['', Validators.required],
    oldPassword: ['', Validators.required],
    newPassword: ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20)
    ]]
  });

  // Inicializar el formulario de restablecimiento de contraseña
  this.resetPasswordForm = this.fb.group({
    newPassword: ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20)
    ]]
  });
  }

  // Validador para verificar si el nickname está en uso
  nicknameValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.authService.checkNicknameAvailability(control.value).pipe(
      map(isAvailable => isAvailable ? null : { nicknameTaken: true }),
      catchError(() => of(null))
    );
  }

  // Validador para verificar si el email está en uso
  emailValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.authService.checkEmailAvailability(control.value).pipe(
      map(isAvailable => isAvailable ? null : { emailTaken: true }),
      catchError(() => of(null))
    );
  }

  // Valida si las contraseñas coinciden
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmitRegister(): void {
    if (this.registerForm.invalid) {
      this.notificationType = 'warning';  // Tipo de advertencia
      this.errorMessage = 'Por favor, completa todos los campos correctamente';  // Mensaje de advertencia
      return;
    }

    const { name, lastname, nickname, email, password, confirmPassword } = this.registerForm.value;
    if (password !== confirmPassword) {
      this.notificationType = 'error';  // Tipo de error
      this.errorMessage = 'Las contraseñas no coinciden';  // Mensaje de error
      return;
    }

    this.authService.register(nickname, name, lastname, email, password).subscribe(
      () => {
        this.notificationType = 'success';  // Tipo de éxito
        this.errorMessage = 'Registro exitoso. Ahora puedes iniciar sesión';  // Mensaje de éxito
        this.openLoginForm();  // Redirige al formulario de login
      },
      (error) => {
        this.notificationType = 'error';  // Tipo de error
        this.errorMessage = error.message || 'Error durante el registro';  // Mensaje de error
      }
    );
  }

  onSubmitLogin(): void {
    const { nickname, password } = this.loginForm.value;
    this.authService.login(nickname, password).subscribe(
      (response) => {
        this.notificationType = 'success';  // Tipo de mensaje de éxito
        this.errorMessage = 'Inicio de sesión exitoso';  // Mensaje de éxito
        // Redirige al usuario o realiza otra acción
      },
      (error) => {
        this.notificationType = 'error';  // Tipo de mensaje de error
        this.errorMessage = 'Usuario o contraseña incorrectos';  // Mensaje de error
      }
    );
  }

  onSubmitForgotPassword(): void {
    if (this.forgotPasswordForm.invalid) {
      this.notificationType = 'warning';
      this.errorMessage = 'Por favor, ingresa un correo válido.';
      return;
    }

    const email = this.forgotPasswordForm.value.email;
    this.authService.forgotPassword(email).subscribe(
      (response) => {
        this.notificationType = 'success';
        this.errorMessage = 'Enlace de restablecimiento enviado a tu email.';
      },
      (error) => {
        this.notificationType = 'error';
        this.errorMessage = error.message || 'Error al enviar el enlace de restablecimiento.';
      }
    );
  }

  onSubmitChangePassword(): void {
    const { nickname, oldPassword, newPassword } = this.changePasswordForm.value;
    if (this.changePasswordForm.invalid) {
      this.notificationType = 'warning';
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    this.authService.changePassword(oldPassword, newPassword).subscribe(
      (response) => {
        this.notificationType = 'success';
        this.errorMessage = 'Contraseña actualizada correctamente.';
      },
      (error) => {
        this.notificationType = 'error';
        this.errorMessage = error.message || 'Error al cambiar la contraseña.';
      }
    );
  }

  onSubmitResetPassword(): void {
    const token = this.route.snapshot.queryParamMap.get('token');  // Obtener el token de la URL
  const newPassword = this.resetPasswordForm.value.newPassword;

  if (!token) {
    this.notificationType = 'error';
    this.errorMessage = 'Token no válido o no presente en la URL.';
    return;
  }

  if (this.resetPasswordForm.invalid) {
    this.notificationType = 'warning';
    this.errorMessage = 'Por favor, ingresa una nueva contraseña válida.';
    return;
  }

  this.authService.resetPassword(token, newPassword).subscribe(
    (response) => {
      this.notificationType = 'success';
      this.errorMessage = 'Contraseña restablecida correctamente.';
    },
    (error) => {
      this.notificationType = 'error';
      this.errorMessage = error.message || 'Error al restablecer la contraseña.';
    }
  );
  }

  openLoginForm(): void {
    this.showLoginForm = true;
    this.showRegisterForm = false;

    this.showForgotPasswordForm = false;
    this.loginForm.reset();
  }

  openForgotPasswordForm(): void {
    this.showLoginForm = false;
    this.showRegisterForm = false;
    this.showForgotPasswordForm = true;
    this.forgotPasswordForm.reset();
  }

  openRegisterForm(): void {
    this.showLoginForm = false;
    this.showRegisterForm = true;

    this.showForgotPasswordForm = false;
    this.registerForm.reset();
  }

  closeForms(): void {
    this.showLoginForm = false;
    this.showRegisterForm = false;
  }

}
