import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesInviteComponent } from './employees-invite.component';

describe('AccountingComponent', () => {
  let component: EmployeesInviteComponent;
  let fixture: ComponentFixture<EmployeesInviteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeesInviteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
