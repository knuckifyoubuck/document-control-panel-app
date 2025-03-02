import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginApiService } from './shared/services/login-api.service';
import { LoginReqDto } from '@document-control-app/core/interfaces/login-req-dto.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LocalStorageService } from '@document-control-app/core/services/local-storage.service';
import { concatMap, merge, tap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { LoaderService } from '@document-control-app/core/services/loader.service';
import { UserService } from './shared/services/user.service';
import { SnackBarService } from '@document-control-app/core/services/snackbar.service';

@Component({
  selector: 'app-login',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [LoginApiService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  emailErrorMessage = signal('');
  passwordErrorMessage = signal('');
  loginForm: FormGroup;
  isLoading: WritableSignal<boolean>;

  constructor(
    private formBuilder: FormBuilder,
    private loginApiService: LoginApiService,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private snackBar: SnackBarService,
    private router: Router
  ) {
    this.isLoading = inject(LoaderService).isLoading;

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateEmailErrorMessage());

    merge(this.password.statusChanges, this.password.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updatePasswordErrorMessage());
  }

  onSubmit() {
    this.loginApiService
      .login(this.loginForm.value as LoginReqDto)
      .pipe(
        tap(loginRes => {
          this.localStorageService.setAuthToken(loginRes.access_token);
        }),
        concatMap(() => this.userService.getUser())
      )
      .subscribe(() => {
        this.router.navigate(['document-control-panel']);
      });
  }

  updateEmailErrorMessage() {
    if (this.email.hasError('required')) {
      this.emailErrorMessage.set('You must enter an email');
    } else if (this.email.hasError('email')) {
      this.emailErrorMessage.set('Not a valid email');
    } else {
      this.emailErrorMessage.set('');
    }
  }

  updatePasswordErrorMessage() {
    if (this.email.hasError('required')) {
      this.passwordErrorMessage.set('You must enter a password');
    } else {
      this.emailErrorMessage.set('');
    }
  }

  get email() {
    return this.loginForm.get('email') as FormControl<string>;
  }

  get password() {
    return this.loginForm.get('password') as FormControl<string>;
  }
}
