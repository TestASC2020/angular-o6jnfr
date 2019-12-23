import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractViewComponent } from './accounting.component';

describe('AccountingComponent', () => {
  let component: ContractViewComponent;
  let fixture: ComponentFixture<ContractViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
