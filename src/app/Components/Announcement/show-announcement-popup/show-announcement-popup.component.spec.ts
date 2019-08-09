import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAnnouncementPopupComponent } from './show-announcement-popup.component';

describe('ShowAnnouncementPopupComponent', () => {
  let component: ShowAnnouncementPopupComponent;
  let fixture: ComponentFixture<ShowAnnouncementPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowAnnouncementPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAnnouncementPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
