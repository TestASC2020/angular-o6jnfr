import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { UserResponseModel } from 'src/app/models/user-response';
import { Subject } from 'rxjs';
import { MDBModalRef } from 'src/app/lib';
import { UserLoginOrg } from 'src/app/models/user-org';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-switch-business-modal',
  templateUrl: './switch-business-modal.component.html',
  styleUrls: ['./switch-business-modal.component.scss']
})
export class SwitchBusinessModalComponent implements OnInit, AfterViewInit, OnDestroy {

  action: Subject<any> = new Subject();

  submitted: boolean;
  selectedOrg: FormControl;
  orgList: Array<UserLoginOrg> = new Array<UserLoginOrg>();

  constructor(private modalRef: MDBModalRef) {
    this.selectedOrg =  new FormControl(null, [Validators.required]);
    this.submitted = false;
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
  }

  close(): void {
    this.modalRef.hide();
  }

  save(): void {
    this.submitted = true;
    if (this.selectedOrg.valid) {
      this.action.next(this.selectedOrg.value);
      this.modalRef.hide();
    }
  }

  ngOnDestroy(): void {
    this.action.complete();
  }

}
