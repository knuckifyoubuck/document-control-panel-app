import { DocumentStatus } from '../enums/document-status.enum';
import { UserResDto } from '../../../core/interfaces/user-res-dto.interface';

export interface DocumentResDto {
  creator?: UserResDto;
  id: string;
  name: string;
  status: DocumentStatus;
  fileUrl?: string;
  updatedAt: string;
  createdAt: string;
}
