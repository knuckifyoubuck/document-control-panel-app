import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { CreateDocumentComponent } from './create-document.component';
import { DocumentApiService } from '../../shared/services/document-api.service';
import { LoaderService } from '@document-control-app/core/services/loader.service';
import { SnackBarService } from '@document-control-app/core/services/snackbar.service';
import { DocumentResDto } from '@document-control-app/document-control-panel/shared/interfaces/document-res-dto.interface';
import { DocumentStatus } from '@document-control-app/document-control-panel/shared/enums/document-status.enum';

describe('CreateDocumentComponent', () => {
  let component: CreateDocumentComponent;
  let fixture: ComponentFixture<CreateDocumentComponent>;
  let documentApiService: jasmine.SpyObj<DocumentApiService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<CreateDocumentComponent>>;

  beforeEach(async () => {
    const documentApiSpy = jasmine.createSpyObj('DocumentApiService', ['createNewDocument']);
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['isLoading']);
    const snackBarSpy = jasmine.createSpyObj('SnackBarService', ['open']);
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NoopAnimationsModule, CreateDocumentComponent],
      providers: [
        { provide: DocumentApiService, useValue: documentApiSpy },
        { provide: LoaderService, useValue: loaderSpy },
        { provide: SnackBarService, useValue: snackBarSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],
    }).compileComponents();

    documentApiService = TestBed.inject(DocumentApiService) as jasmine.SpyObj<DocumentApiService>;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<
      MatDialogRef<CreateDocumentComponent>
    >;

    fixture = TestBed.createComponent(CreateDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form', () => {
    expect(component.createDocumentForm).toBeDefined();
    expect(component.createDocumentForm.get('name')).toBeDefined();
    expect(component.createDocumentForm.get('file')).toBeDefined();
    expect(component.createDocumentForm.get('status')).toBeDefined();
  });

  it('should display error message when name is empty on blur', () => {
    const nameInput = fixture.nativeElement.querySelector('input[formControlName="name"]');
    nameInput.value = '';
    nameInput.dispatchEvent(new Event('input'));
    nameInput.dispatchEvent(new Event('blur'));

    fixture.detectChanges();

    expect(component.nameErrorMessage()).toBe('You must enter a name');
  });

  it('should display error message when file is not uploaded', () => {
    const fileControl = component.createDocumentForm.get('file');
    fileControl?.setValue(null);
    fileControl?.markAsTouched();
    fixture.detectChanges();

    expect(component.fileErrorMessage()).toBe('You must upload a file');
  });

  it('should call createNewDocument on form submit', () => {
    const mockFormData = new FormData();
    mockFormData.append('name', 'Test Document');
    mockFormData.append('file', 'test.pdf');
    mockFormData.append('status', 'DRAFT');

    component.createDocumentForm.setValue({
      name: 'Test Document',
      file: 'test.pdf',
      status: 'DRAFT',
    });

    const returnValue: DocumentResDto = {
      id: 'id',
      name: 'name',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      status: DocumentStatus.DRAFT,
    };

    documentApiService.createNewDocument.and.returnValue(of(returnValue));
    component.onSubmit();

    expect(documentApiService.createNewDocument).toHaveBeenCalledWith(jasmine.any(FormData));
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });
});
