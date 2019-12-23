import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {CoursesService} from '../../../../services/courses.service';
import {CookieService} from 'ngx-cookie';
@Component({
  selector: 'app-user-list-action-menu',
  templateUrl: './user-list-action-menu.component.html',
  styleUrls: ['./user-list-action-menu.component.scss']
})
export class UserListActionMenuComponent implements OnInit, OnDestroy {
  @Input() item: any;
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
    this.cookieService.put('courseInfo', JSON.stringify({courseName: item.crsName, signature: item.crsSig}), opt);
    const routLinks = [
      {
        link: '/courses/course-list',
        display: 'Courses.Course'
      },
      {
        link: '/courses/user-list',
        display: 'Courses.User_List'
      },
      {
        display: 'Courses.Discussion'
      },
    ];
    this.cookieService.put('toRouters', JSON.stringify(routLinks), opt);
    this.router.navigate(['courses/course-list/course-discussion']);
  }
  progress(item) {
    const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
    const userCrs = {
      userCrsSig: item.signature
    };
    this.cookieService.put('userCrs', JSON.stringify(userCrs), opt);
    this.router.navigate(['courses/user-list/progress']);
  }
  userprofile(item) {
    const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
    const userCrs = {
      userSig: item.userSignature
    };
    this.cookieService.put('userCrs', JSON.stringify(userCrs), opt);
    const routLinks = [
      {
        link: '/courses/course-list',
        display: 'Courses.Course'
      },
      {
        link: '/courses/user-list',
        display: 'Courses.User_List'
      },
      {
        display: 'AUTH.PROFILE'
      },
    ];
    this.cookieService.put('toRouters', JSON.stringify(routLinks), opt);
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
