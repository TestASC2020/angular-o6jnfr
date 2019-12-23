import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessStarComponent } from './star.component';

describe('AccountingComponent', () => {
  let component: BusinessStarComponent;
  let fixture: ComponentFixture<BusinessStarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessStarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessStarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
