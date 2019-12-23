import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseExercisesViewComponent } from './course-exercises-view.component';

describe('UserProfileComponent', () => {
  let component: CourseExercisesViewComponent;
  let fixture: ComponentFixture<CourseExercisesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseExercisesViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseExercisesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
