import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PagerService} from '../../../../services/pager.service';
import {ModalDirective} from '../../../../lib/ng-uikit-pro-standard/free/modals/index';
import {BusinessService} from '../../../../services/business.service';
import {CookieService} from 'ngx-cookie';
import {UtilsService} from '../../../../services/utils.service';

@Component({
    selector: 'app-business-profile-employees-set-status',
    templateUrl: './employees-list-courses.component.html',
    styleUrls: ['./employees-list-courses.component.scss']
})
export class EmployeesListCoursesComponent  implements OnInit {
    @ViewChild('exportModal') exportModal: ModalDirective;
    items: Array<any> = new Array<any>();
    employeeProfile: any;
    totalUsers: number = 0;
    totalAmount: number = 0;
    totalReceivedAMT: number = 0;
    currentDateTime: Date;
    currentDay: any;
    currentMonth: any;
    currentYear: any;
    currentHour: any;
    currentMinute: any;
    currentSecond: any;
    currentAMPM: any;
    view_items: Array<any>;
    // pager object
    pager: any = {};
    pageSize: Array<number> = [5, 10, 15, 20];
    // paged items
    pagedItems: any[];

    constructor(private router: Router,
                private route: ActivatedRoute,
                private cookieService: CookieService,
                private utilsService: UtilsService,
                private pagerService: PagerService,
                private service: BusinessService) {
        setInterval(() => {
            this.currentDateTime = new Date();
            this.currentDay = ('0' + this.currentDateTime.getDay().toString()).slice(-2);
            this.currentMonth = this.utilsService.shortMonth(this.currentDateTime.getMonth());
            this.currentYear = this.currentDateTime.getFullYear();
            this.currentHour = this.currentDateTime.getHours();
            if (this.currentHour > 12) {
                this.currentHour = this.currentHour - 12;
                this.currentAMPM = 'PM';
            } else {
                this.currentAMPM = 'AM';
            }
            this.currentHour = ('0' + this.currentHour.toString()).slice(-2);
            this.currentMinute = ('0' + this.currentDateTime.getMinutes().toString()).slice(-2);
            this.currentSecond = ('0' + this.currentDateTime.getSeconds().toString()).slice(-2);
        }, 1);
    }

    ngOnInit() {
        if (this.cookieService.get('employeeProfile')) {
            this.employeeProfile = JSON.parse(this.cookieService.get('employeeProfile'));
            this.service.loadOrgStaffCourses({staffSig: this.employeeProfile.staffSig}).subscribe(result => {
                this.items = result['data'];
                this.view_items = [];
                this.items.forEach(item => {
                    this.view_items.push(item);
                });
                this.setPage(1);
            });
        }
    }

    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }

        if (this.items.length < 1) {
            this.pagedItems = [];
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(this.items.length, page, this.pageSize[0]);

        // get current page of items
        this.pagedItems = this.items.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }
    viewFeedback() {
        const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
        this.cookieService.put('employee', JSON.stringify(this.employeeProfile), opt);
        this.router.navigate(['business-profile/employees/employees-feedback']);
    }
    generateAddress() {
        const temp = [];
        if (this.employeeProfile.city) {
            temp.push(this.employeeProfile.city);
        }
        if (this.employeeProfile.region) {
            temp.push(this.employeeProfile.region);
        }
        if (this.employeeProfile.country) {
            temp.push(this.employeeProfile.country);
        }
        return temp.join(', ');
    }
}