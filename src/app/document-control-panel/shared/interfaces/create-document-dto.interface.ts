import { CreateDocumentStatus } from '../enums/create-document-status.enum';

export interface CreateDocumentDto {
  status: CreateDocumentStatus;
  file: string;
  name: string;
}
