import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PagerService} from '../../../../services/pager.service';
import {BusinessService} from '../../../../services/business.service';
import {CookieService} from 'ngx-cookie';
import {UtilsService} from '../../../../services/utils.service';

@Component({
  selector: 'app-business-profile-employees-feedback',
  templateUrl: './employees-feedback.component.html',
  styleUrls: ['./employees-feedback.component.scss']
})
export class EmployeesFeedbackComponent  implements OnInit {
  employee: any;
  courseList: Array<any> = new Array<any>();
  selectedCourse: string = '';
  feedbackDetails: any;
  currentDateTime: Date;
  currentDay: any;
  currentMonth: any;
  currentYear: any;
  currentHour: any;
  currentMinute: any;
  currentSecond: any;
  currentAMPM: any;

  constructor(private router: Router,
              private cookieService: CookieService,
              private route: ActivatedRoute,
              private pagerService: PagerService,
              private service: BusinessService,
              private utilsService: UtilsService) {
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
      const _this = this;
    if (this.cookieService.get('employee')) {
      this.employee = JSON.parse(this.cookieService.get('employee'));
      this.service.loadOrgStaffCourses({staffSig: this.employee.signature}).subscribe(resp => {
          _this.courseList = resp['data'];
          _this.selectedCourse = this.courseList[0].signature;
        const data = {
          staffSig: _this.employee.signature,
          crsSig: _this.selectedCourse
        };
          _this.service.loadStaffCrsFeedback(data).subscribe(result => {
            _this.feedbackDetails = result['data'];
        });
      });
    }
  }
    generateAddress() {
        const temp = [];
        if (this.employee.city) {
            temp.push(this.employee.city);
        }
        if (this.employee.region) {
            temp.push(this.employee.region);
        }
        if (this.employee.country) {
            temp.push(this.employee.country);
        }
        return temp.join(', ');
    }
  updateCourse($event) {
    this.selectedCourse = $event.target.value;
    const data = {
      staffSig: this.employee.signature,
      crsSig: this.selectedCourse
    };
    this.service.loadStaffCrsFeedback(data).subscribe(result => {
      this.feedbackDetails = result['data'];
    });
  }
}
