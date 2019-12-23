import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumViewComponent } from './curriculum-view.component';

describe('CourseQuizViewComponent', () => {
  let component: CurriculumViewComponent;
  let fixture: ComponentFixture<CurriculumViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurriculumViewComponent ]
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurriculumViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
