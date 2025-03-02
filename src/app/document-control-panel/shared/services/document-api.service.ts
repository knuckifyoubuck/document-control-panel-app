import { Injectable } from '@angular/core';
import { HttpService } from '@document-control-app/core/services/http.service';
import { DocumentPageReqDto } from '../interfaces/document-page-req-dto.interface';
import { DocumentsPageResDto } from '../interfaces/document-page-res-dto.interface';
import { DocumentResDto } from '../interfaces/document-res-dto.interface';
import { ChangeDocumentStatusDto } from '../interfaces/change-document-status-dto.interface';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentApiService {
  documentChanged$ = new Subject<void>();

  constructor(private readonly http: HttpService) {}

  createNewDocument(createDocumentDto: FormData) {
    return this.http.post<FormData, DocumentResDto>('/document', createDocumentDto);
  }

  getDocumentList(documentPageReqDto: DocumentPageReqDto) {
    return this.http.get<DocumentPageReqDto, DocumentsPageResDto>('/document', documentPageReqDto);
  }

  getDocumentById(id: string) {
    return this.http.get<{ id: string }, DocumentResDto>(`/document/${id}`);
  }

  updateDocument(id: string, name: string) {
    return this.http.patch<{ name: string }, null>(`/document/${id}`, { name });
  }

  removeDocument(id: string) {
    return this.http.delete<null>(`/document/${id}`);
  }

  sendDocumentToReview(id: string) {
    return this.http.post<null, null>(`/document/${id}/send-to-review`, null);
  }

  revokeDocumentFromReview(id: string) {
    return this.http.post<null, null>(`/document/${id}/revoke-review`, null);
  }

  changeDocumentStatus(id: string, changeDocumentStatus: ChangeDocumentStatusDto) {
    return this.http.post<ChangeDocumentStatusDto, ChangeDocumentStatusDto>(
      `/document/${id}/change-status`,
      changeDocumentStatus
    );
  }
}
