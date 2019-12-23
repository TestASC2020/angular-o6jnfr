import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionDenyComponent } from './permission-deny.component';

describe('OrgComponent', () => {
  let component: PermissionDenyComponent;
  let fixture: ComponentFixture<PermissionDenyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermissionDenyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionDenyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
