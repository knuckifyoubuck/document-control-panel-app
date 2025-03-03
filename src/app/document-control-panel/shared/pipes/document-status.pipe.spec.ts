import { DocumentStatus } from '../enums/document-status.enum';
import { DocumentStatusPipe } from './document-status.pipe';

describe('DocumentStatusPipe', () => {
  it('tranforms "READY_FOR_REVIEW" to "Ready for review"', () => {
    const pipe = new DocumentStatusPipe();
    expect(pipe.transform(DocumentStatus.READY_FOR_REVIEW)).toBe('Ready for review');
  });
});
