import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ViewDocumentComponent } from './view-document.component';
import { DocumentApiService } from '@document-control-app/document-control-panel/shared/services/document-api.service';
import { LoaderService } from '@document-control-app/core/services/loader.service';
import { SnackBarService } from '@document-control-app/core/services/snackbar.service';
import PSPDFKit from 'pspdfkit';
import { DocumentResDto } from '@document-control-app/document-control-panel/shared/interfaces/document-res-dto.interface';
import { DocumentStatus } from '@document-control-app/document-control-panel/shared/enums/document-status.enum';
import { provideHttpClient } from '@angular/common/http';

describe('ViewDocumentComponent', () => {
  let component: ViewDocumentComponent;
  let fixture: ComponentFixture<ViewDocumentComponent>;
  let documentApiService: DocumentApiService;

  const mockDialogRef = {
    close: jasmine.createSpy('close'),
  };

  const mockDocument: DocumentResDto = {
    id: '123',
    fileUrl: 'path/to/document.pdf',
    name: 'name',
    status: DocumentStatus.DRAFT,
    createdAt: '123',
    updatedAt: '123',
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        ViewDocumentComponent,
        provideHttpClientTesting(),
        provideHttpClient(),
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { document: mockDocument } },
        DocumentApiService,
        LoaderService,
        SnackBarService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDocumentComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('documentName', 'test');
    fixture.componentRef.setInput('documentStatus', 'test');
    documentApiService = TestBed.inject(DocumentApiService);

    spyOn(documentApiService, 'getDocumentById').and.returnValue(of(mockDocument));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load document using PSPDFKit', () => {
    spyOn(PSPDFKit, 'load').and.callThrough();

    component.ngAfterViewInit();
    fixture.detectChanges();

    expect(documentApiService.getDocumentById).toHaveBeenCalledWith(mockDocument.id);
    expect(PSPDFKit.load).toHaveBeenCalledWith({
      baseUrl: `${location.protocol}//${location.host}/assets/`,
      document: mockDocument.fileUrl!,
      container: '#pspdfkit-container',
    });
  });
});
