import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSchoolFilesPopupComponent } from './show-school-files-popup.component';

describe('ShowSchoolFilesPopupComponent', () => {
  let component: ShowSchoolFilesPopupComponent;
  let fixture: ComponentFixture<ShowSchoolFilesPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowSchoolFilesPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowSchoolFilesPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
