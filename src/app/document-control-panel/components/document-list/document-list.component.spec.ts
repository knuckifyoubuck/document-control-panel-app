import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { DocumentListComponent } from './document-list.component';
import { LoaderService } from '@document-control-app/core/services/loader.service';
import { DialogService } from '@document-control-app/core/services/dialog.service';
import { UserService } from '@document-control-app/login/shared/services/user.service';
import { DocumentStatusPipe } from '../../shared/pipes/document-status.pipe';
import { DocumentResDto } from '../../shared/interfaces/document-res-dto.interface';
import { HttpService } from '@document-control-app/core/services/http.service';
import { LocalStorageService } from '@document-control-app/core/services/local-storage.service';
import { of } from 'rxjs';
import { DocumentStatus } from '@document-control-app/document-control-panel/shared/enums/document-status.enum';
import { UserRole } from '@document-control-app/core/enums/user-role.enum';
import { signal } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('DocumentListComponent', () => {
  let component: DocumentListComponent;
  let fixture: ComponentFixture<DocumentListComponent>;
  let dialogService: jasmine.SpyObj<DialogService>;

  const mockDocument: DocumentResDto = {
    creator: {
      id: 'id',
      email: 'email',
      fullName: 'fullName',
      role: UserRole.USER,
    },
    id: 'id',
    name: 'name',
    status: DocumentStatus.DRAFT,
    fileUrl: 'test-file',
    updatedAt: 'updatedAt',
    createdAt: 'createdAt',
  };

  beforeEach(async () => {
    const dialogServiceSpy = jasmine.createSpyObj('DialogService', ['viewDocumentDialog']);
    const loaderServiceSpy = jasmine.createSpyObj('LoaderService', [], {
      isLoading: signal(false),
    });
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUser'], {
      isReviewer: signal(false),
      userData: signal(null),
    });
    const localStorageServiceSpy = jasmine.createSpyObj('LocalStorageService', [
      'getUserData',
      'setUserData',
    ]);

    userServiceSpy.getUser.and.returnValue(
      of({
        fullName: 'John Doe',
        role: 'User',
      })
    );

    await TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatInputModule,
        MatDialogModule,
        DatePipe,
        DocumentStatusPipe,
      ],
      providers: [
        DocumentListComponent,
        provideAnimations(),
        { provide: DialogService, useValue: dialogServiceSpy },
        { provide: LoaderService, useValue: loaderServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: LocalStorageService, useValue: localStorageServiceSpy },
        { provide: HttpService, useValue: jasmine.createSpyObj('HttpService', ['get']) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentListComponent);
    component = fixture.componentInstance;
    dialogService = TestBed.inject(DialogService) as jasmine.SpyObj<DialogService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call viewDocumentDialog on openDocument', () => {
    component.openDocument(mockDocument);
    expect(dialogService.viewDocumentDialog).toHaveBeenCalledWith(mockDocument);
  });
});
