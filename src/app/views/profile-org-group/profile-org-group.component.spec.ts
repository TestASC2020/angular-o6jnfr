import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileOrgGroupComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileOrgGroupComponent;
  let fixture: ComponentFixture<ProfileOrgGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileOrgGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileOrgGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
