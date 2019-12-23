import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseBalanceComponent } from './course-balance.component';

describe('AccountingComponent', () => {
  let component: CourseBalanceComponent;
  let fixture: ComponentFixture<CourseBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
