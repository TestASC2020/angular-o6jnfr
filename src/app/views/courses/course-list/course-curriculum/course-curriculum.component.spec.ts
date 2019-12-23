import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseCurriculumComponent } from './course-curriculum.component';

describe('UserProfileComponent', () => {
  let component: CourseCurriculumComponent;
  let fixture: ComponentFixture<CourseCurriculumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseCurriculumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseCurriculumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
