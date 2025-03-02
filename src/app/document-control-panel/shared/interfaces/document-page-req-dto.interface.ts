import { SortDirection } from '@angular/material/sort';
import { DocumentStatus } from '../enums/document-status.enum';

export interface DocumentPageReqDto {
  page: number;
  size: number;
  sort?: `${string},${SortDirection}`;
  status?: DocumentStatus | '';
  creatorId?: string;
  creatorEmail?: string;
}
