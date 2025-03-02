import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentControlPanelLayoutComponent } from './document-control-panel-layout.component';

describe('DocumentControlPanelLayoutComponent', () => {
  let component: DocumentControlPanelLayoutComponent;
  let fixture: ComponentFixture<DocumentControlPanelLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentControlPanelLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentControlPanelLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
