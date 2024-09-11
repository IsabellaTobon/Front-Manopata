import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { catchError, map, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login-sign-up',
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule, CommonModule ],
  templateUrl: './login-sign-up.component.html',
  styleUrl: './login-sign-up.component.css'
})
export class LoginSignUpComponent implements OnInit{

  @Input() showLoginForm: Boolean = false;
  @Input() showRegisterForm: Boolean = false;

  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
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

  openLoginForm(): void {
    this.showLoginForm = true;
    this.showRegisterForm = false;
  }

  openRegisterForm(): void {
    this.showLoginForm = false;
    this.showRegisterForm = true;
  }

  closeForms(): void {
    this.showLoginForm = false;
    this.showRegisterForm = false;
  }

  onSubmitLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const { nickname, password } = this.loginForm.value;
    this.authService.login(nickname, password).subscribe(
      () => this.router.navigate(['/']),
      (error) => {
        if (error.status === 401) {
          this.errorMessage = 'Usuario o contraseña incorrectos';
        } else {
          this.errorMessage =
            'Error de autenticación, por favor intente nuevamente';
        }
      }
    );
  }

  onSubmitRegister(): void {
    if (this.registerForm.invalid) {
      return;
    }

    const { name, lastname, nickname, email, password, confirmPassword } = this.registerForm.value;

    if (password !== confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.authService.register(nickname, name, lastname, email, password).subscribe(
      () => {
        this.openLoginForm();
        this.errorMessage = 'Usuario registrado correctamente, inicia sesión';
      },
      (error) => {
        console.log('Error durante el registro:', error.message);
        this.errorMessage = error.message;
      }
    );
  }
}
