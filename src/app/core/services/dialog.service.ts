import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { CreateDocumentComponent } from '@document-control-app/document-control-panel/components/create-document/create-document.component';
import { DocumentResDto } from '@document-control-app/document-control-panel/shared/interfaces/document-res-dto.interface';
import { ViewDocumentReviewerComponent } from '@document-control-app/document-control-panel/components/view-document-reviewer/view-document-reviewer.component';
import { ViewDocumentUserComponent } from '@document-control-app/document-control-panel/components/view-document-user/view-document-user.component';
import { UserService } from '@document-control-app/login/shared/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private dialog = inject(MatDialog);
  private isReviewer = inject(UserService).isReviewer;

  createDocumentDialogRef: MatDialogRef<CreateDocumentComponent>;
  openDocumentDialogRef: MatDialogRef<ViewDocumentUserComponent | ViewDocumentReviewerComponent>;

  createDocumentDialog() {
    this.createDocumentDialogRef = this.dialog.open(CreateDocumentComponent, {
      width: '500px',
    });
  }

  viewDocumentDialog(document: DocumentResDto) {
    const dialogConfig: MatDialogConfig = {
      minWidth: '90vw',
      height: '90vh',
      autoFocus: false,
      data: { document },
    };

    if (this.isReviewer()) {
      this.openDocumentDialogRef = this.dialog.open(ViewDocumentReviewerComponent, dialogConfig);
    } else {
      this.openDocumentDialogRef = this.dialog.open(ViewDocumentUserComponent, dialogConfig);
    }
  }
}
