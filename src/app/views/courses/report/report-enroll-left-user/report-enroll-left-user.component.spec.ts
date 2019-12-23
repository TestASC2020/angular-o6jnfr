import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportEnrollLeftUserComponent } from './report-enroll-left-user.component';

describe('UserProfileComponent', () => {
  let component: ReportEnrollLeftUserComponent;
  let fixture: ComponentFixture<ReportEnrollLeftUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportEnrollLeftUserComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportEnrollLeftUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
