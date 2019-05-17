import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingGuidesComponent } from './training-guides.component';

describe('TrainingGuidesComponent', () => {
  let component: TrainingGuidesComponent;
  let fixture: ComponentFixture<TrainingGuidesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingGuidesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingGuidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
