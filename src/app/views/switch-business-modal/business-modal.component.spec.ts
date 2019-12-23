import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SwitchBusinessModalComponent } from './switch-business-modal.component';

describe('SwitchBusinessModalComponent', () => {
  let component: SwitchBusinessModalComponent;
  let fixture: ComponentFixture<SwitchBusinessModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwitchBusinessModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchBusinessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
