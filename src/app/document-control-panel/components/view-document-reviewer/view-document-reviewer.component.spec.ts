import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ViewDocumentReviewerComponent } from './view-document-reviewer.component';
import { DocumentApiService } from '../../shared/services/document-api.service';
import { LoaderService } from '@document-control-app/core/services/loader.service';
import { SnackBarService } from '@document-control-app/core/services/snackbar.service';
import { ChangeDocumentStatus } from '../../shared/enums/change-document-status.enum';
import { DocumentStatus } from '../../shared/enums/document-status.enum';
import { UserRole } from '@document-control-app/core/enums/user-role.enum';
import { DocumentResDto } from '@document-control-app/document-control-panel/shared/interfaces/document-res-dto.interface';
import { provideHttpClient } from '@angular/common/http';
import { ChangeDocumentStatusDto } from '@document-control-app/document-control-panel/shared/interfaces/change-document-status-dto.interface';

describe('ViewDocumentReviewerComponent', () => {
  let component: ViewDocumentReviewerComponent;
  let fixture: ComponentFixture<ViewDocumentReviewerComponent>;
  let documentApiService: DocumentApiService;
  let mockDialogRef: MatDialogRef<ViewDocumentReviewerComponent>;

  const mockDocument: DocumentResDto = {
    creator: {
      id: 'id',
      email: 'email',
      fullName: 'name',
      role: UserRole.USER
    },
    id: 'id',
    name: 'Test Document',
    status: DocumentStatus.READY_FOR_REVIEW,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    fileUrl: '/testpath'
  };

  beforeEach(waitForAsync(() => {
    mockDialogRef = jasmine.createSpyObj(['close']);
    
    TestBed.configureTestingModule({
      providers: [
        ViewDocumentReviewerComponent,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MAT_DIALOG_DATA, useValue: { document: mockDocument } },
        { provide: MatDialogRef, useValue: mockDialogRef },
        DocumentApiService,
        LoaderService,
        SnackBarService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDocumentReviewerComponent);
    component = fixture.componentInstance;
    documentApiService = TestBed.inject(DocumentApiService);

    spyOn(documentApiService, 'changeDocumentStatus').and.callFake((id: string, changeDocumentStatus: ChangeDocumentStatusDto) => {
        component.documentStatus.set(changeDocumentStatus.status);
        return of();
      }
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change document status to UNDER_REVIEW', () => {
    component.changeStatus(ChangeDocumentStatus.UNDER_REVIEW);
    
    expect(documentApiService.changeDocumentStatus).toHaveBeenCalledWith(mockDocument.id, { status: ChangeDocumentStatus.UNDER_REVIEW });
    expect(component.documentStatus()).toBe(ChangeDocumentStatus.UNDER_REVIEW);
  });

  it('should change document status to APPROVED', () => {
    component.changeStatus(ChangeDocumentStatus.APPROVED);
    
    expect(documentApiService.changeDocumentStatus).toHaveBeenCalledWith(mockDocument.id, { status: ChangeDocumentStatus.APPROVED });
    expect(component.documentStatus()).toBe(ChangeDocumentStatus.APPROVED);
  });

  it('should change document status to DECLINED', () => {
    component.changeStatus(ChangeDocumentStatus.DECLINED);
    
    expect(documentApiService.changeDocumentStatus).toHaveBeenCalledWith(mockDocument.id, { status: ChangeDocumentStatus.DECLINED });
    expect(component.documentStatus()).toBe(ChangeDocumentStatus.DECLINED);
  });
});
