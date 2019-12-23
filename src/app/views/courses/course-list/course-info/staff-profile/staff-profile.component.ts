import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PagerService} from '../../../../../services/pager.service';
import {ModalDirective} from '../../../../../lib/ng-uikit-pro-standard/free/modals/index';
import {CoursesService} from '../../../../../services/courses.service';
import {CookieService} from 'ngx-cookie';

@Component({
  selector: 'app-course-staff-profile',
  templateUrl: './staff-profile.component.html',
  styleUrls: ['./staff-profile.component.scss']
})
export class StaffProfileComponent  implements OnInit {
  staffProfile: any;
  staffInfo: any;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private pagerService: PagerService,
              private service: CoursesService,
              private cookieService: CookieService) {
  }

  ngOnInit() {
      if (this.cookieService.get('staffInfo')) {
          this.staffInfo = JSON.parse(this.cookieService.get('staffInfo'));
          this.service.loadOrgStaffProfile({staffSig: this.staffInfo.userSig}).subscribe(resp => {
              this.staffProfile = resp['data'];
          });
      }
  }

  chat() {
      const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
      console.log(this.staffInfo);
      this.cookieService.put('courseInfo', JSON.stringify({courseName: this.staffInfo.crsName, signature: this.staffInfo.crsSig}), opt);
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
      this.cookieService.put('routLinks', JSON.stringify(routLinks), opt);
      this.router.navigate(['courses/course-list/course-discussion']);
  }
}
