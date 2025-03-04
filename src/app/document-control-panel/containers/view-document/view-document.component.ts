import { Component, inject, AfterViewInit, input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoaderService } from '@document-control-app/core/services/loader.service';
import { DocumentApiService } from '@document-control-app/document-control-panel/shared/services/document-api.service';
import PSPDFKit from 'pspdfkit';
import { DocumentStatusPipe } from '../../shared/pipes/document-status.pipe';
import { DocumentStatus } from '@document-control-app/document-control-panel/shared/enums/document-status.enum';

@Component({
  selector: 'app-view-document',
  imports: [DocumentStatusPipe],
  templateUrl: './view-document.component.html',
  styleUrl: './view-document.component.scss',
})
export class ViewDocumentComponent implements AfterViewInit {
  dialogRef = inject(MatDialogRef);
  documentData = inject(MAT_DIALOG_DATA).document;
  documentApiService = inject(DocumentApiService);
  isLoading = inject(LoaderService).isLoading;

  documentName = input.required<string>();
  documentStatus = input.required<DocumentStatus>();

  ngAfterViewInit() {
    this.documentApiService.getDocumentById(this.documentData.id).subscribe(res => {
      PSPDFKit.load({
        baseUrl: `${location.protocol}//${location.host}/assets/`,
        document: res.fileUrl!,
        container: '#pspdfkit-container',
      });
    });
  }
}
