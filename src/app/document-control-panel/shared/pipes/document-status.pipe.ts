import { Pipe, PipeTransform } from '@angular/core';
import { DocumentStatus, DocumentStatusValues } from '../enums/document-status.enum';

@Pipe({
  name: 'documentStatus',
})
export class DocumentStatusPipe implements PipeTransform {
  transform(value: DocumentStatus): string {
    return DocumentStatusValues[value];
  }
}
