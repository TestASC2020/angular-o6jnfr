import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContracListComponent } from './accounting.component';

describe('AccountingComponent', () => {
  let component: ContracListComponent;
  let fixture: ComponentFixture<ContracListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContracListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContracListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
