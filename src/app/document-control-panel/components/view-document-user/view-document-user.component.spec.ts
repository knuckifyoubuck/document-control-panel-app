import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ViewDocumentUserComponent } from './view-document-user.component';
import { DocumentApiService } from '../../shared/services/document-api.service';
import { LoaderService } from '@document-control-app/core/services/loader.service';
import { SnackBarService } from '@document-control-app/core/services/snackbar.service';
import { DocumentResDto } from '@document-control-app/document-control-panel/shared/interfaces/document-res-dto.interface';
import { DocumentStatus } from '@document-control-app/document-control-panel/shared/enums/document-status.enum';
import { UserRole } from '@document-control-app/core/enums/user-role.enum';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

describe('ViewDocumentUserComponent', () => {
  let component: ViewDocumentUserComponent;
  let fixture: ComponentFixture<ViewDocumentUserComponent>;
  let documentApiService: DocumentApiService;
  let mockDialogRef: MatDialogRef<ViewDocumentUserComponent>;

  const mockDocument: DocumentResDto = {
    creator: {
      id: 'id',
      email: 'email',
      fullName: 'name',
      role: UserRole.USER,
    },
    id: 'id',
    name: 'Test Document',
    status: DocumentStatus.DRAFT,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    fileUrl: '/testpath',
  };

  beforeEach(waitForAsync(() => {
    mockDialogRef = jasmine.createSpyObj(['close']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        ViewDocumentUserComponent,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimations(),
        { provide: MAT_DIALOG_DATA, useValue: { document: mockDocument } },
        { provide: MatDialogRef, useValue: mockDialogRef },
        DocumentApiService,
        LoaderService,
        SnackBarService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDocumentUserComponent);
    component = fixture.componentInstance;
    documentApiService = TestBed.inject(DocumentApiService);

    spyOn(documentApiService, 'updateDocument').and.returnValue(of(null));
    spyOn(documentApiService, 'revokeDocumentFromReview').and.returnValue(of(null));
    spyOn(documentApiService, 'sendDocumentToReview').and.returnValue(of(null));
    spyOn(documentApiService, 'removeDocument').and.returnValue(of(null));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update document name', () => {
    const newName = 'Updated Document Name';
    component.newNameFormControl.setValue(newName);
    component.updateDocument();

    expect(documentApiService.updateDocument).toHaveBeenCalledWith('id', newName);
  });

  it('should revoke document from review', () => {
    component.revokeDocumentFromReview();

    expect(documentApiService.revokeDocumentFromReview).toHaveBeenCalledWith('id');
  });

  it('should send document on review', () => {
    component.sendDocumentOnReview();

    expect(documentApiService.sendDocumentToReview).toHaveBeenCalledWith('id');
  });

  it('should delete document', () => {
    component.deleteDocument();

    expect(documentApiService.removeDocument).toHaveBeenCalledWith('id');
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });
});
