import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolFilesComponent } from './school-files.component';

describe('SchoolFilesComponent', () => {
  let component: SchoolFilesComponent;
  let fixture: ComponentFixture<SchoolFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
