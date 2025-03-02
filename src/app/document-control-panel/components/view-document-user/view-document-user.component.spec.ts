import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDocumentUserComponent } from './view-document-user.component';

describe('ViewDocumentComponent', () => {
  let component: ViewDocumentUserComponent;
  let fixture: ComponentFixture<ViewDocumentUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDocumentUserComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewDocumentUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
