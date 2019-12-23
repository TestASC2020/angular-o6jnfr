import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';

@Component({
  selector: 'app-course-list-action-menu',
  templateUrl: './course-list-action-menu.component.html',
  styleUrls: ['./course-list-action-menu.component.scss']
})
export class CourseListActionMenuComponent implements OnInit, OnDestroy {
  @Input() item: any;
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();
  @Output() status: EventEmitter<any> = new EventEmitter<any>();
  @Output() role: EventEmitter<any> = new EventEmitter<any>();

  constructor(private router: Router,
              private cookieService: CookieService) { }

  ngOnInit() {
  }

  Discussion(item) {
    const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
    this.cookieService.remove('routLinks');
    this.cookieService.remove('toRouters');
    this.cookieService.put('courseInfo', JSON.stringify({courseName: item.name, signature: item.signature}), opt);
    const routLinks = [
      {
        link: '../',
        display: 'Courses.Course'
      },
      {
        display: 'Courses.Discussion'
      },
    ];
    this.cookieService.put('toRouters', JSON.stringify(routLinks), opt);
    this.router.navigate(['courses/course-list/course-discussion']);
  }
  userlist(item) {
    this.cookieService.remove('routLinks');
    this.cookieService.remove('toRouters');
    const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
    this.cookieService.put('courseInfo', JSON.stringify({crsName: item.name, crsSig: item.signature}), opt);
    this.router.navigate(['courses/user-list']);
  }
  courseinfo(item) {
    const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
    this.cookieService.remove('routLinks');
    this.cookieService.put('courseInfo', JSON.stringify({crsName: item.name, crsSig: item.signature}), opt);
    const routLinks = [
      {
        link: '/courses/course-list',
        display: 'Courses.Course'
      },
      {
        display: 'Courses.Course_info'
      },
    ];
    this.cookieService.put('toRouters', JSON.stringify(routLinks), opt);
    this.router.navigate(['courses/course-list/course-info']);
  }
  contract(item) {
    this.cookieService.remove('routLinks');
    this.cookieService.remove('toRouters');
    const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
    this.cookieService.put('courseInfo', JSON.stringify(item), opt);
    this.router.navigate(['courses/course-list/course-contract']);
  }
  curriculum(item) {
    const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
    this.cookieService.remove('routLinks');
    this.cookieService.remove('toRouters');
    this.cookieService.put('courseInfo', JSON.stringify({crsSig: item.signature}), opt);
    const routLinks = [
      {
        link: '/courses/course-list',
        display: 'Courses.Course'
      },
      {
        display: 'Courses.Course_Curriculum'
      },
    ];
    this.cookieService.put('toRouters', JSON.stringify(routLinks), opt);
    this.router.navigate(['courses/course-list/course-curriculum']);
  }
  removeCourse(item) {
    this.delete.emit(item);
  }
  ngOnDestroy() {
    this.delete.complete();
    this.status.complete();
    this.role.complete();
  }
}
