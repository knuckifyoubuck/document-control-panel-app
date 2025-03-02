import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  AfterViewInit,
  WritableSignal,
  signal,
  inject,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTable, MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { DocumentResDto } from '../../shared/interfaces/document-res-dto.interface';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { LoaderService } from '@document-control-app/core/services/loader.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DocumentDataSource } from '../../shared/models/document-data-source.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService } from '@document-control-app/login/shared/services/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DocumentStatus, DocumentStatusValues } from '../../shared/enums/document-status.enum';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  DOCUMENT_LIST_COLUMNS_REVIEWER,
  DOCUMENT_LIST_COLUMNS_USER,
} from '../../shared/consts/document-list-columns.consts';
import { MatInputModule } from '@angular/material/input';
import { DialogService } from '@document-control-app/core/services/dialog.service';
import { DocumentStatusPipe } from '../../shared/pipes/document-status.pipe';

@Component({
  selector: 'app-document-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    DatePipe,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    DocumentStatusPipe,
  ],
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentListComponent implements AfterViewInit {
  dialogService = inject(DialogService);

  readonly displayedColumns: string[];
  readonly documentStatusSelect = Object.entries(DocumentStatusValues).map(([key, value]) => ({
    key,
    value,
  }));

  documentListSource = new DocumentDataSource();
  pageIndex: WritableSignal<number> = signal(0);
  pageSize: WritableSignal<number> = signal(5);
  listLength: WritableSignal<number> = signal(0);
  isLoading: WritableSignal<boolean> = inject(LoaderService).isLoading;

  statusSelectForm = new FormControl<DocumentStatus | ''>('');
  creatorEmailForm: FormControl<string | ''>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<DocumentResDto>;

  isReviewer = inject(UserService).isReviewer;

  ngAfterViewInit() {
    this.documentListSource.paginator = this.paginator;
    this.documentListSource.sort = this.sort;
    this.documentListSource.statusFilter = this.statusSelectForm as FormControl;
    if (this.isReviewer()) {
      this.documentListSource.creatorEmailFilter = this.creatorEmailForm;
    }

    this.table.dataSource = this.documentListSource;
  }

  constructor() {
    this.displayedColumns = this.isReviewer()
      ? DOCUMENT_LIST_COLUMNS_REVIEWER
      : DOCUMENT_LIST_COLUMNS_USER;

    if (this.isReviewer()) {
      this.creatorEmailForm = new FormControl<string | ''>('') as FormControl;
    }
  }

  openDocument(document: DocumentResDto) {
    this.dialogService.viewDocumentDialog(document);
  }
}
