import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { LoginComponent } from './login.component';
import { LoginApiService } from './shared/services/login-api.service';
import { UserService } from './shared/services/user.service';
import { LocalStorageService } from '@document-control-app/core/services/local-storage.service';
import { SnackBarService } from '@document-control-app/core/services/snackbar.service';
import { LoaderService } from '@document-control-app/core/services/loader.service';
import { Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    const loginApiSpy = jasmine.createSpyObj('LoginApiService', ['login']);
    const localStorageSpy = jasmine.createSpyObj('LocalStorageService', ['setAuthToken']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUser']);
    const snackBarSpy = jasmine.createSpyObj('SnackBarService', ['open']);
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['isLoading']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NoopAnimationsModule, LoginComponent],
      providers: [
        { provide: LoginApiService, useValue: loginApiSpy },
        { provide: LocalStorageService, useValue: localStorageSpy },
        { provide: Router, useValue: routerSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: SnackBarService, useValue: snackBarSpy },
        { provide: LoaderService, useValue: loaderSpy },
        provideHttpClient(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('email')).toBeDefined();
    expect(component.loginForm.get('password')).toBeDefined();
  });

  it('should display error message when email input is blurred and empty', () => {
    const emailInput = fixture.nativeElement.querySelector('input[formControlName="email"]');
    emailInput.value = '';
    emailInput.dispatchEvent(new Event('input'));
    emailInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(component.emailErrorMessage()).toBe('You must enter an email');
  });

  it('should display error message when email input is blurred and invalid', () => {
    const emailInput = fixture.nativeElement.querySelector('input[formControlName="email"]');
    emailInput.value = 'invalid-email';
    emailInput.dispatchEvent(new Event('input'));
    emailInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(component.emailErrorMessage()).toBe('Not a valid email');
  });

  it('should display error message when password input is blurred and empty', () => {
    const passwordInput = fixture.nativeElement.querySelector('input[formControlName="password"]');
    passwordInput.value = '';
    passwordInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(component.passwordErrorMessage()).toBe('You must enter a password');
  });
});
