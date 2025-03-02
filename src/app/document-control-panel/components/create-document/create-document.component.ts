import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DocumentApiService } from '../../shared/services/document-api.service';
import { tap } from 'rxjs';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CreateDocumentStatus } from '../../shared/enums/create-document-status.enum';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderService } from '@document-control-app/core/services/loader.service';
import { MatSelectModule } from '@angular/material/select';
import { UploadFileFormComponent } from '../upload-file-form/upload-file-form.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackBarService } from '@document-control-app/core/services/snackbar.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-create-document',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatSelectModule,
    UploadFileFormComponent,
    MatSnackBarModule,
  ],
  templateUrl: './create-document.component.html',
  styleUrl: './create-document.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateDocumentComponent {
  dialogRef = inject(MatDialogRef);
  documentApiService = inject(DocumentApiService);
  fb = inject(FormBuilder);
  isLoading = inject(LoaderService).isLoading;
  snackBar = inject(SnackBarService);

  createDocumentForm: FormGroup;
  nameErrorMessage = signal('');
  fileErrorMessage = signal('');
  readonly documentStatusCreateSelect = Object.entries(CreateDocumentStatus).map(
    ([key, value]) => ({ key, value })
  );

  constructor() {
    this.createDocumentForm = this.fb.group({
      name: ['', Validators.required],
      file: [null, [Validators.required, this.fileFormatValidator()]],
      status: [CreateDocumentStatus.DRAFT, Validators.required],
    });

    this.file.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.updateFileErrorMessage();
    });
  }

  onSubmit() {
    const formData = new FormData();

    for (const key in this.createDocumentForm.value) {
      formData.append(key, this.createDocumentForm.value[key]);
    }

    this.documentApiService
      .createNewDocument(formData)
      .pipe(
        tap({
          subscribe: () => (this.dialogRef.disableClose = true),
          finalize: () => (this.dialogRef.disableClose = false),
        })
      )
      .subscribe(() => {
        this.dialogRef.close(true);
      });
  }

  updateNameErrorMessage() {
    if (this.name.hasError('required')) {
      this.nameErrorMessage.set('You must enter an name');
    } else {
      this.nameErrorMessage.set('');
    }
  }

  updateFileErrorMessage() {
    if (this.file.hasError('required')) {
      this.fileErrorMessage.set('You must upload a file');
    } else if (this.file.hasError('fileFormat')) {
      this.fileErrorMessage.set('You must upload file in PDF format');
    } else {
      this.fileErrorMessage.set('');
    }
  }

  get name() {
    return this.createDocumentForm.get('name') as FormControl<string>;
  }

  get file() {
    return this.createDocumentForm.get('file') as FormControl<string>;
  }

  get status() {
    return this.createDocumentForm.get('status') as FormControl<CreateDocumentStatus>;
  }

  private fileFormatValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      return value.type !== 'application/pdf' ? { fileFormat: true } : null;
    };
  }

  compareFunction(o1: any, o2: any) {
    return o1.key == o2.key;
  }
}
