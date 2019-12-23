import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseLessonComponent } from './course-lesson.component';

describe('UserProfileComponent', () => {
  let component: CourseLessonComponent;
  let fixture: ComponentFixture<CourseLessonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseLessonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
