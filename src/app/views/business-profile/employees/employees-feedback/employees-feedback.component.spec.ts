import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesFeedbackComponent } from './employees-feedback.component';

describe('AccountingComponent', () => {
  let component: EmployeesFeedbackComponent;
  let fixture: ComponentFixture<EmployeesFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeesFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
