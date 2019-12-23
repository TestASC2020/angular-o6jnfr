import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../../services/user.service';
import {ModalDirective} from '../../../../lib/ng-uikit-pro-standard/free';
import {AppState} from '../../../../app-state.service';
import {HttpHeaders} from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-business-profile-employees-invite',
    templateUrl: './employees-invite.component.html',
    styleUrls: ['./employees-invite.component.scss']
})
export class EmployeesInviteComponent  implements OnInit {
    email: string = '';
    message: string = '';
    selectedType: any = 1;
    @ViewChild('errorModal') errorModal: ModalDirective;
    @ViewChild('inviteModal') inviteModal: ModalDirective;
    staffList: Array<any> = new Array<any>();
    selectedStaff: any;
    error: any;
    inviteFormGroup: FormGroup;
    searchText: string = '';
    staffs_list: Array<any>;
    currentPage: number = 0;
    enableMore: boolean = true;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private service: UserService,
                private appState: AppState) {
        this.staffs_list = [];
        this.inviteFormGroup = new FormGroup({
            tutor: new FormControl('', [Validators.required]),
        });
    }

    ngOnInit() {
        this.inviteModal.onShow.subscribe(resp => {
            this.searchText = '';
            this.reloadRecords();
        });
    }

    changeSelectedStaffType($event) {
        this.selectedType = $event.target.value;
    }

    backToEmployeesList() {
        this.router.navigate(['business-profile/employees']);
    }

    sendInvite() {
        const data = {
            message: this.message,
            staffType: JSON.parse(this.selectedType.toString()),
            userSig: this.selectedStaff
        };
        const headers = new HttpHeaders();
        headers.append('lang', this.appState.locale.lang);
        this.service.sendOrgInvite(data, headers).subscribe(
            resp => {
                if (resp['success'] === false) {
                    this.error = resp;
                    this.errorModal.show();
                } else {
                    this.backToEmployeesList();
                }
            },
             err => {
                 this.error = err;
                 this.errorModal.show();
             }
          );
    }
    removeTutor() {
        this.inviteFormGroup.get('tutor').setValue('');
    }

    checkTutorExist() {
        if (this.inviteFormGroup.get('tutor').value) {
            return 'block';
        }
        return 'none';
    }
    checkTutorExistReverse() {
        if (this.inviteFormGroup.get('tutor').value) {
            return 'none';
        }
        return 'block';
    }
    updateAuthor(staff) {
        this.inviteModal.hide();
        this.inviteFormGroup.get('tutor').setValue(staff.name);
        this.selectedStaff = staff.signature;
    }

    loadRecords() {
        const _this = this;
        if (this.currentPage !== -1) {
            this.currentPage++;
            const sendData = {
                pageSz: 10,
                pageNo: this.currentPage
            };
            if (this.searchText) {
                sendData['keyWords'] = this.searchText;
            }
            this.service.loadUserList(sendData).subscribe(staffData => {
                const temp = (staffData['data'] && staffData['data'].length > 0) ? staffData['data'] : [];
                if (temp.length === 0) {
                    _this.enableMore = false;
                    _this.currentPage = -1;
                } else {
                    temp.forEach(te => {
                        _this.staffList.push(te);
                    });
                }
            });
        } else {
            this.enableMore = false;
            this.currentPage = -1;
        }
    }

    reloadRecords() {
        this.currentPage = 0;
        this.staffList = new Array<any>();
        this.loadRecords();
    }

    loadMoreRecords() {
        this.loadRecords();
    }

    checkSearch($event: KeyboardEvent) {
        this.reloadRecords();
    }
}