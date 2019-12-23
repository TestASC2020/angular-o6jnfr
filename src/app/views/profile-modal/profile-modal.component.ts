import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MDBModalService, MDBModalRef } from 'src/app/lib';
import { UserResponseModel } from 'src/app/models/user-response';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.scss']
})
export class ProfileModalComponent implements OnInit, OnDestroy {
  profile: UserResponseModel;
  action: Subject<any> = new Subject();

  constructor(private modalRef: MDBModalRef,
    private modalService: MDBModalService) { }

  ngOnInit() {
  }

  close(): void {
    this.modalRef.hide();
  }

  save(): void {
    this.action.next(this.profile);
    this.modalRef.hide();
  }

  ngOnDestroy(): void {
    this.action.complete();
  }

}
