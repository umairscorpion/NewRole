import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAttachmentPopupComponent } from './show-attachment-popup.component';

describe('ShowAttachmentPopupComponent', () => {
  let component: ShowAttachmentPopupComponent;
  let fixture: ComponentFixture<ShowAttachmentPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowAttachmentPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAttachmentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
