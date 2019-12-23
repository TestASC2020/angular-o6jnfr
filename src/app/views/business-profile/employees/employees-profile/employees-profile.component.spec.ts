import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesProfileComponent } from './employees-profile.component';

describe('AccountingComponent', () => {
  let component: EmployeesProfileComponent;
  let fixture: ComponentFixture<EmployeesProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeesProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
