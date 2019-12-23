import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseDiscussionThreadComponent } from './course-discussion-thread.component';

describe('UserProfileComponent', () => {
  let component: CourseDiscussionThreadComponent;
  let fixture: ComponentFixture<CourseDiscussionThreadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseDiscussionThreadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseDiscussionThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
