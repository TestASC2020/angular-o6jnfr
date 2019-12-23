import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseQuizViewComponent } from './course-quiz-view.component';

describe('UserProfileComponent', () => {
  let component: CourseQuizViewComponent;
  let fixture: ComponentFixture<CourseQuizViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseQuizViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseQuizViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
