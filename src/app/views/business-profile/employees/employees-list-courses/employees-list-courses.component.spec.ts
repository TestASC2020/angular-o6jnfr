import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesListCoursesComponent } from './employees-list-courses.component';

describe('AccountingComponent', () => {
  let component: EmployeesListCoursesComponent;
  let fixture: ComponentFixture<EmployeesListCoursesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeesListCoursesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesListCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
