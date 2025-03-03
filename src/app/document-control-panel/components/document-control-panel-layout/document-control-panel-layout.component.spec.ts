import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { DocumentControlPanelLayoutComponent } from './document-control-panel-layout.component';
import { LocalStorageService } from '@document-control-app/core/services/local-storage.service';
import { DialogService } from '@document-control-app/core/services/dialog.service';
import { UserService } from '@document-control-app/login/shared/services/user.service';
import { SnackBarService } from '@document-control-app/core/services/snackbar.service';
import { DocumentApiService } from '@document-control-app/document-control-panel/shared/services/document-api.service';
import { signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

describe('DocumentControlPanelLayoutComponent', () => {
  let component: DocumentControlPanelLayoutComponent;
  let fixture: ComponentFixture<DocumentControlPanelLayoutComponent>;
  let router: Router;
  let localStorageService: jasmine.SpyObj<LocalStorageService>;
  let dialogService: jasmine.SpyObj<DialogService>;
  let snackBarService: jasmine.SpyObj<SnackBarService>;
  let documentApiService: jasmine.SpyObj<DocumentApiService>;
  let documentChanged$: Subject<void>;

  beforeEach(async () => {
    const localStorageServiceSpy = jasmine.createSpyObj('LocalStorageService', [
      'deleteAuthToken',
      'deleteUserData',
    ]);
    const dialogServiceSpy = jasmine.createSpyObj('DialogService', ['createDocumentDialog'], {
      createDocumentDialogRef: { afterClosed: () => of(true) } as MatDialogRef<any>,
    });
    const snackBarServiceSpy = jasmine.createSpyObj('SnackBarService', ['success', 'default']);
    const documentApiServiceSpy = jasmine.createSpyObj('DocumentApiService', [], {
      documentChanged$: new Subject<void>(),
    });
    const userServiceSpy = jasmine.createSpyObj('UserService', [], {
      isReviewer: signal(false),
      userData: () => ({ fullName: 'John Doe', role: 'User' }),
    });

    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule, MatButtonModule, MatIconModule],
      providers: [
        DocumentControlPanelLayoutComponent,
        { provide: LocalStorageService, useValue: localStorageServiceSpy },
        { provide: DialogService, useValue: dialogServiceSpy },
        { provide: SnackBarService, useValue: snackBarServiceSpy },
        { provide: DocumentApiService, useValue: documentApiServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentControlPanelLayoutComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    localStorageService = TestBed.inject(
      LocalStorageService
    ) as jasmine.SpyObj<LocalStorageService>;
    dialogService = TestBed.inject(DialogService) as jasmine.SpyObj<DialogService>;
    snackBarService = TestBed.inject(SnackBarService) as jasmine.SpyObj<SnackBarService>;
    documentApiService = TestBed.inject(DocumentApiService) as jasmine.SpyObj<DocumentApiService>;
    documentChanged$ = documentApiService.documentChanged$ as Subject<void>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createDocumentDialog and emit signal on createDocument', () => {
    spyOn(documentChanged$, 'next');
    component.createDocument();
    expect(dialogService.createDocumentDialog).toHaveBeenCalled();
    expect(documentChanged$.next).toHaveBeenCalled();
    expect(snackBarService.success).toHaveBeenCalledWith('Document was saved successfuly');
  });

  it('should call localStorageService methods and navigate on logout', async () => {
    const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    await component.logout();
    expect(localStorageService.deleteAuthToken).toHaveBeenCalled();
    expect(localStorageService.deleteUserData).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['login']);
    expect(snackBarService.default).toHaveBeenCalledWith('Log out from system');
  });

  it('should display user information', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.user-info div:nth-child(1)').textContent).toContain(
      'Name: John Doe'
    );
    expect(compiled.querySelector('.user-info div:nth-child(2)').textContent).toContain(
      'Role: User'
    );
  });
});
