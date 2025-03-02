import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { DocumentApiService } from '../../shared/services/document-api.service';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {
  ChangeDocumentStatus,
  ChangeDocumentStatusValues,
} from '../../shared/enums/change-document-status.enum';
import { LoaderService } from '@document-control-app/core/services/loader.service';
import { SnackBarService } from '@document-control-app/core/services/snackbar.service';
import { MatButtonModule } from '@angular/material/button';
import { DocumentStatus } from '../../shared/enums/document-status.enum';
import { ViewDocumentComponent } from '../view-document/view-document.component';

@Component({
  selector: 'app-view-document-reviewer',
  imports: [
    MatDialogModule,
    MatIconModule,
    MatProgressSpinner,
    MatButtonModule,
    ViewDocumentComponent,
  ],
  templateUrl: './view-document-reviewer.component.html',
  styleUrl: './view-document-reviewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [NO_ERRORS_SCHEMA],
})
export class ViewDocumentReviewerComponent {
  documentData = inject(MAT_DIALOG_DATA).document;
  documentApiService = inject(DocumentApiService);
  isLoading = inject(LoaderService).isLoading;
  snackBar = inject(SnackBarService);

  documentName = signal(this.documentData.name);
  documentStatus = signal(this.documentData.status);
  documentStatusEnum = DocumentStatus;
  changeStatusEnum = ChangeDocumentStatus;

  changeStatus(documentStatus: ChangeDocumentStatus) {
    this.documentApiService
      .changeDocumentStatus(this.documentData.id, { status: documentStatus })
      .subscribe(() => {
        this.documentApiService.documentChanged$.next();
        this.documentStatus.set(documentStatus);
        this.snackBar.success(
          `Document status was successfuly changed to '${ChangeDocumentStatusValues[documentStatus]}'`
        );
      });
  }
}
