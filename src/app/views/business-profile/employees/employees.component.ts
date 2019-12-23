import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PagerService} from '../../../services/pager.service';
import {ModalDirective} from '../../../lib/ng-uikit-pro-standard/free/modals';
import {BusinessService} from '../../../services/business.service';
import {ORG_USER_STATUS} from '../../../models/org-user-status';
import {ORG_USER_ROLES} from '../../../models/org-user-roles';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'app-business-profile-employees',
    templateUrl: './employees.component.html',
    styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent  implements OnInit {
    @ViewChild('exportModal') exportModal: ModalDirective;
    @ViewChild('removeEmployees') removeEmployees: ModalDirective;
    @ViewChild('status') status: ModalDirective;
    @ViewChild('roles') roles: ModalDirective;
    items: Array<any> = new Array<any>();
    currentPage: number = 0;
    enableMore: boolean = true;
    item_employee: Array<any> = new Array<any>();
    userStatusList: Array<any> = new Array<any>();
    userRoleList: Array<any> = new Array<any>();
    selectedStatus: any;
    selectedRole: any;
    lastItemStatus: number;
    lastItemRole: number;
    selectedEmployee: any;
    types: any;
    totalUsers: number = 0;
    totalAmount: number = 0;
    totalReceivedAMT: number = 0;
    itemToView: any;
    searchText: string = '';
    pageSizes: Array<number> = [10, 15, 20, 25, 50, 75, 100, 150, 200];
    rowsPerPage: number;
    // sortBy = : byte { None = 0, FirstName = 1, Country = 2, Email = 3 }
    sortBy: number = 0;
    // sortOrder : byte { None=0, Desc=1, Asc=2 }
    sortOrder: Array<number> = [0, 0, 0, 0];
    staffType: any = 0;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private pagerService: PagerService,
                private spinner: NgxSpinnerService,
                private service: BusinessService) {
        this.items = [];
        this.items.forEach(item => {
            this.totalUsers += item.totalUsers;
            this.totalAmount += item.totalAmount;
            this.totalReceivedAMT += item.totalReceivedAMT;
        });
    }

    ngOnInit() {
        this.rowsPerPage = this.pageSizes[0];
        this.service.loadStaffType({}).subscribe(res => {
            this.service.loadUserOrgStatus({}).subscribe(userStatusListData => {
                this.service.loadUserOrgRole({}).subscribe(userRoleListData => {
                    const rollList = userRoleListData['data'];
                    Object.keys(rollList).forEach(rollKey => {
                        this.userRoleList.push({
                            value: rollKey,
                            text: rollList[rollKey]
                        });
                    });
                    const stList = userStatusListData['data'];
                    Object.keys(stList).forEach(stKey => {
                        this.userStatusList.push({
                            value: stKey,
                            text: stList[stKey]
                        });
                    });
                    const items = res['data'];
                    for (const u of Object.keys(items)) {
                        this.item_employee.push({key: u, value: items[u]});
                    }
                    this.service.loadOrgStaffList({pageSz: Number.parseInt(this.rowsPerPage.toString(), 10), pageNo: this.currentPage})
                        .subscribe(result => {
                          this.items = result['data'];
                    });
                });
            });
        });
    }

    invite() {
        this.router.navigate(['business-profile/employees/employees-invite']);
    }
    openRemveEmployees(employee) {
        this.selectedEmployee = employee;
        this.removeEmployees.show();
    }
    remove() {
        const data = {
            signature: this.selectedEmployee.signature
        };

        const index = this.items.map(it => it.signature).indexOf(this.selectedEmployee.signature);
        this.service.removeUserOrg(data).subscribe(
            result => {
                this.items.splice(index, 1);
            },
            err => {
                console.log(err);
            });
    }
    openRoleModal(item) {
        this.itemToView = item;
        const indx = this.userRoleList.map(it => JSON.parse(it.value.toString())).indexOf(item.orgRole.toString());
        if (indx > -1) {
            this.selectedRole = this.userRoleList[indx];
        } else {
            this.selectedRole = this.userRoleList[0];
        }
        this.lastItemRole = item.orgRole;
        if (this.itemToView) {
            this.roles.show();
        }
    }
    updateItemRole(role: any, index: number) {
        this.selectedRole = role;
    }

    saveRole() {
        const data = {
            staffSig: this.itemToView.signature,
            role: JSON.parse(this.selectedRole.value.toString())
        };
        if (this.lastItemRole !== data.role) {
            this.service.updateUserOrgRole(data).subscribe(resp => {
                // cap nhat lai danh sach employees
                this.itemToView.orgRole = data.role;
                const idx = this.items.map(it => it.signature).indexOf(this.itemToView.signature);
                this.items[idx].orgRole = data.role;
                this.lastItemRole = data.role;
                this.roles.hide();
            });
        }
    }
    openStatusModal(item) {
        this.itemToView = item;
        const indx = this.userStatusList.map(it => JSON.parse(it.value.toString())).indexOf(item.orgStatus);
        if (indx > -1) {
            this.selectedStatus = this.userStatusList[indx];
        } else {
            this.selectedStatus = this.userStatusList[0];
        }
        this.lastItemStatus = item.orgStatus;
        if (this.itemToView) {
            this.status.show();
        }
    }

    updateItemStatus(status: any, index: number) {
        this.selectedStatus = status;
    }

    saveStatus() {
        const data = {
            staffSig: this.itemToView.signature,
            status: JSON.parse(this.selectedStatus.value.toString())
        };
        if (this.lastItemStatus !== data.status) {
            this.service.updateUserOrgStatus(data).subscribe(resp => {
                // cap nhat lai danh sach employees
                this.itemToView.orgStatus = data.status;
                const idx = this.items.map(it => it.signature).indexOf(this.itemToView.signature);
                this.items[idx].orgStatus = data.status;
                this.lastItemStatus = data.status;
                this.status.hide();
            });
        }
    }

    get ORG_USER_STATUS() {
        return ORG_USER_STATUS;
    }

    get ORG_USER_ROLES() {
        return ORG_USER_ROLES;
    }

    loadRecords() {
        if (this.currentPage !== -1) {
            this.currentPage++;
            const sendData = {
                pageSz: Number.parseInt(this.rowsPerPage.toString(), 10),
                pageNo: this.currentPage,
                sortOrder: this.sortOrder[this.sortBy],
                sortBy: this.sortBy,
                staffTypes: (Number.parseInt(this.staffType + '' , 10) !== 0) ?
                  [Number.parseInt(this.staffType + '' , 10)] : []
            };
            if (sendData.staffTypes.length === 0) {
                delete sendData.staffTypes;
            }
            if (this.searchText) {
                sendData['name'] = this.searchText;
            }
            this.service.loadOrgStaffList(sendData)
                .subscribe(result => {
                const temp = (result['data'] && result['data'].length > 0) ? result['data'] : [];
                if (temp.length === 0) {
                    this.currentPage = -1;
                } else {
                    if (temp.length < this.rowsPerPage) {
                        this.enableMore = false;
                    } else {
                        this.enableMore = true;
                    }
                    const lastLength = this.items.length;
                    temp.forEach(te => {
                        if (this.items.map(ii => ii.id).indexOf(te.id) < 0) {
                            this.items.push(te);
                        }
                    });
                    if (this.items.length === lastLength) {
                        this.currentPage = -1;
                        this.enableMore = false;
                    }
                }
            });
        } else {
            this.enableMore = false;
        }
    }

    reloadRecords() {
        this.spinner.show();
        this.currentPage = 0;
        this.items = new Array<any>();
        this.loadRecords();
    }

    loadMoreRecords() {
        this.loadRecords();
    }

    checkSearch($event: KeyboardEvent) {
        this.reloadRecords();
    }

    generateLineInfo(item) {
      const result = [];
      if (item.line1) {
        result.push(item.line1);
      }
      if (item.line2) {
        result.push(item.line2);
      }
      return result.join(', ');
    }
}
