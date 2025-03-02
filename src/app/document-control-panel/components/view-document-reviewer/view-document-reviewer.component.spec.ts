import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDocumentReviewerComponent } from './view-document-reviewer.component';

describe('ViewDocumentReviewerComponent', () => {
  let component: ViewDocumentReviewerComponent;
  let fixture: ComponentFixture<ViewDocumentReviewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDocumentReviewerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewDocumentReviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
