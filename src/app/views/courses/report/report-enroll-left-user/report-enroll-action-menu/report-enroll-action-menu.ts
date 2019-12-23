import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';
import {CoursesService} from '../../../../../services/courses.service';

@Component({
  selector: 'app-cms-report-enroll-left-user-action-menu',
  templateUrl: './report-enroll-action-menu.html',
  styleUrls: ['./report-enroll-action-menu.scss']
})
export class ReportEnrollActionMenuComponent implements OnInit, OnDestroy {
  @Input() item: any;
  @Input() reportInfo: any;
  @ViewChild('popContent') popContent: any;
  @Output() notification: EventEmitter<any> = new EventEmitter<any>();
  @Output() banEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() unBanEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() admin: EventEmitter<any> = new EventEmitter<any>();

  constructor(private router: Router,
              private cookieService: CookieService,
              private service: CoursesService) { }

  ngOnInit() {
    const _this = this;
    if (this.item) {
      const data = {
        userCrsSig: _this.item.signature
      };
      _this.service.checkBanCrsUser(data).subscribe(resp => {
        _this.item.settings = resp['data'].settings;
      });
    }
  }

  userMessages(item) {
    const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
    this.cookieService.put('chatWith', JSON.stringify({userId: item.userId}), opt);
    this.router.navigate(['message']);
  }
  progress(item) {
    const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
    const userCrs = {
      userCrsSig: item.signature
    };
    const toRouters = [
      {
        'link': '../../course-list',
        'display': 'Courses.Course'
      },
      {
        'link': '../../report',
        'display': 'SIDEBAR.COURSES.REPORT.NAME'
      },
      {
        'link': '../../report/report-enroll-left-user',
        'display': 'Courses.Enroll_Left_Users'
      },
      {
        'display': 'CREATOR.CURRICULUMS.progress'
      },
    ];
    this.cookieService.put('toRouters', JSON.stringify(toRouters), opt);
    this.cookieService.put('userCrs', JSON.stringify(userCrs), opt);
    this.router.navigate(['courses/user-list/progress']);
  }
  userprofile(item) {
    const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
    this.cookieService.put('userCrs', JSON.stringify({userSig: item.userSignature}), opt);
    const toRouters = [
      {
        'link': '../../course-list',
        'display': 'Courses.Course'
      },
      {
        'link': '../../report',
        'display': 'SIDEBAR.COURSES.REPORT.NAME'
      },
      {
        'link': '../../report/report-enroll-left-user',
        'display': 'Courses.Enroll_Left_Users'
      },
      {
        'display': 'AUTH.PROFILE'
      },
    ];
    this.cookieService.put('toRouters', JSON.stringify(toRouters), opt);
    this.router.navigate(['courses/user-list/user-profile']);
  }
  sendNotifi(item) {
    this.notification.emit(item);
    this.popContent.hide();
  }
  Admin(item) {
    this.admin.emit(item);
    this.popContent.hide();
  }
  confirmBan(item) {
    this.banEmitter.emit(item);
    this.popContent.hide();
  }
  confirmUnBan(item) {
    this.unBanEmitter.emit(item);
    this.popContent.hide();
  }
  ngOnDestroy() {
    this.notification.complete();
    this.admin.complete();
    this.banEmitter.complete();
    this.unBanEmitter.complete();
  }
}
