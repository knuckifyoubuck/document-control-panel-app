import { ChangeDetectionStrategy, Component, inject, AfterViewInit, signal } from '@angular/core';
import { DocumentApiService } from '../../shared/services/document-api.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import PSPDFKit from 'pspdfkit';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {
  ChangeDocumentStatus,
  ChangeDocumentStatusValues,
} from '../../shared/enums/change-document-status.enum';
import { DocumentStatusPipe } from '../../shared/pipes/document-status.pipe';
import { LoaderService } from '@document-control-app/core/services/loader.service';
import { SnackBarService } from '@document-control-app/core/services/snackbar.service';
import { ReactiveFormsModule } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { DocumentStatus } from '../../shared/enums/document-status.enum';

@Component({
  selector: 'app-view-document-reviewer',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinner,
    DocumentStatusPipe,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './view-document-reviewer.component.html',
  styleUrl: './view-document-reviewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewDocumentReviewerComponent implements AfterViewInit {
  dialogRef = inject(MatDialogRef);
  documentData = inject(MAT_DIALOG_DATA).document;
  documentApiService = inject(DocumentApiService);
  isLoading = inject(LoaderService).isLoading;
  snackBar = inject(SnackBarService);

  documentName = signal(this.documentData.name);
  documentStatus = signal(this.documentData.status);
  documentStatusEnum = DocumentStatus;
  changeStatusEnumEnum = ChangeDocumentStatus;

  ngAfterViewInit() {
    this.documentApiService.getDocumentById(this.documentData.id).subscribe(res => {
      PSPDFKit.load({
        baseUrl: `${location.protocol}//${location.host}/assets/`,
        document: res.fileUrl!,
        container: '#pspdfkit-container',
      });
    });
  }

  changeStatus(documentStatus: ChangeDocumentStatus) {
    this.documentApiService
      .changeDocumentStatus(this.documentData.id, { status: documentStatus })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.snackBar.error(error.error.message);
          return of(error);
        })
      )
      .subscribe(res => {
        if (!(res instanceof HttpErrorResponse)) {
          this.documentApiService.documentChanged$.next();
          this.documentStatus.set(documentStatus);
          this.snackBar.success(
            `Document status was successfuly changed to '${ChangeDocumentStatusValues[documentStatus]}'`
          );
        }
      });
  }
}
