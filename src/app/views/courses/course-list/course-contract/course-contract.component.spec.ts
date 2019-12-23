import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseContractComponent } from './course-contract.component';

describe('UserProfileComponent', () => {
  let component: CourseContractComponent;
  let fixture: ComponentFixture<CourseContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
