import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DocumentApiService } from '../../shared/services/document-api.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { LoaderService } from '@document-control-app/core/services/loader.service';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackBarService } from '@document-control-app/core/services/snackbar.service';
import { DocumentStatus } from '../../shared/enums/document-status.enum';
import { ViewDocumentComponent } from '../view-document/view-document.component';

@Component({
  selector: 'app-view-document-user',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinner,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTooltipModule,
    ViewDocumentComponent,
  ],
  templateUrl: './view-document-user.component.html',
  styleUrl: './view-document-user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [NO_ERRORS_SCHEMA],
})
export class ViewDocumentUserComponent {
  dialogRef = inject(MatDialogRef);
  documentData = inject(MAT_DIALOG_DATA).document;
  documentApiService = inject(DocumentApiService);
  isLoading = inject(LoaderService).isLoading;
  snackBar = inject(SnackBarService);

  documentName = signal(this.documentData.name);
  documentStatus = signal(this.documentData.status);
  newNameFormControl = new FormControl<string>(this.documentData.name, [
    Validators.required,
    this.sameNameValidator(),
  ]);
  newNameErrorMessage = signal('');
  documentStatusEnum = DocumentStatus;

  updateNameErrorMessage() {
    if (this.newNameFormControl.hasError('required')) {
      this.newNameErrorMessage.set('You must enter an name');
    } else if (this.newNameFormControl.hasError('sameName')) {
      this.newNameErrorMessage.set('Name must not be identical');
    } else {
      this.newNameErrorMessage.set('');
    }
  }

  updateDocument() {
    this.documentApiService
      .updateDocument(this.documentData.id, this.newNameFormControl.value as string)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.snackBar.error(error.error.message);
          return of(error);
        })
      )
      .subscribe(res => {
        if (!(res instanceof HttpErrorResponse)) {
          this.documentApiService.documentChanged$.next();
          this.documentName.set(this.newNameFormControl.value);
          this.snackBar.success('Document name was changed successfuly');
        }
      });
  }

  revokeDocumentFromReview() {
    this.documentApiService
      .revokeDocumentFromReview(this.documentData.id)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.snackBar.error(error.error.message);
          return of(error);
        })
      )
      .subscribe(res => {
        if (!(res instanceof HttpErrorResponse)) {
          this.documentApiService.documentChanged$.next();
          this.documentStatus.set(DocumentStatus.REVOKE);
          this.snackBar.success('Document was successfuly revoked from review');
        }
      });
  }

  sendDocumentOnReview() {
    this.documentApiService
      .sendDocumentToReview(this.documentData.id)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.snackBar.error(error.error.message);
          return of(error);
        })
      )
      .subscribe(res => {
        if (!(res instanceof HttpErrorResponse)) {
          this.documentApiService.documentChanged$.next();
          this.documentStatus.set(DocumentStatus.READY_FOR_REVIEW);
          this.snackBar.success('Document was sent on review');
        }
      });
  }

  deleteDocument() {
    this.documentApiService
      .removeDocument(this.documentData.id)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.snackBar.error(error.error.message);
          return of(error);
        })
      )
      .subscribe(res => {
        if (!(res instanceof HttpErrorResponse)) {
          this.documentApiService.documentChanged$.next();
          this.dialogRef.close(true);
          this.snackBar.success('Document was successfuly deleted');
        }
      });
  }

  private sameNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      return value === this.documentName() ? { sameName: true } : null;
    };
  }
}
