import { DataSource } from '@angular/cdk/collections';
import { debounceTime, map, merge, Observable, startWith, switchMap } from 'rxjs';
import { DocumentResDto } from '../interfaces/document-res-dto.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { inject, signal } from '@angular/core';
import { DocumentApiService } from '../services/document-api.service';
import { UserService } from '@document-control-app/login/shared/services/user.service';
import { DocumentStatus } from '../enums/document-status.enum';

export class DocumentDataSource extends DataSource<DocumentResDto> {
  private documentApiService = inject(DocumentApiService);
  private isReviewer = inject(UserService).isReviewer;

  data: DocumentResDto[] = [];
  paginator: MatPaginator;
  sort: MatSort;
  statusFilter: FormControl<DocumentStatus | ''>;
  creatorEmailFilter?: FormControl<string | ''>;
  listLength = signal(0);
  observableList: Observable<unknown>[];

  constructor() {
    super();
  }

  override connect(): Observable<DocumentResDto[]> {
    this.observableList = [
      this.paginator.page,
      this.sort.sortChange,
      this.statusFilter.valueChanges,
      this.documentApiService.documentChanged$,
    ];

    if (this.isReviewer()) {
      if (this.creatorEmailFilter) {
        this.observableList.push(this.creatorEmailFilter.valueChanges.pipe(debounceTime(500)));
      } else {
        throw Error('Creator email filter not provided.');
      }
    }

    if (this.paginator && this.sort && this.statusFilter) {
      return merge(...this.observableList).pipe(
        startWith([]),
        switchMap(() => {
          return this.documentApiService
            .getDocumentList(
              this.filterEmptyObjectValues({
                page: this.paginator?.pageIndex + 1,
                size: this.paginator?.pageSize,
                sort:
                  this.sort?.active && this.sort.direction
                    ? `${this.sort?.active},${this.sort?.direction}`
                    : undefined,
                status: this.statusFilter.value,
                creatorEmail: this.isReviewer() ? this.creatorEmailFilter?.value : undefined,
              })
            )
            .pipe(
              map(data => {
                this.listLength.set(data.count);
                return data.results;
              })
            );
        })
      );
    } else {
      throw Error('Not all parameters setted for the data source before connecting.');
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnect(): void {}

  private filterEmptyObjectValues<T extends Record<string, any>>(obj: T) {
    for (const key in obj) {
      if (obj[key] === undefined || obj[key] === '') {
        delete obj[key];
      }
    }
    return obj;
  }
}
