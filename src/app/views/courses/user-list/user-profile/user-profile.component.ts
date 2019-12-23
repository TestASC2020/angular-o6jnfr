import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';
import {CoursesService} from '../../../../services/courses.service';
import {UtilsService} from '../../../../services/utils.service';
import {ModalDirective} from '../../../../lib/ng-uikit-pro-standard/free/modals';
@Component({
    selector: 'app-course-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
    @ViewChild('modal') modal: ModalDirective;
    userProfile: any;
    userCrs: any;
    selectedCertificate: any;
    toRouters: Array<any>;
    constructor(
        private router: Router,
        private cookieService: CookieService,
        private service: CoursesService,
        private utilsService: UtilsService) {
        if (this.cookieService.get('toRouters')) {
          this.toRouters = JSON.parse(this.cookieService.get('toRouters'));
        } else {
          this.toRouters = [
            {
              'link': '../../course-list',
              'display': 'Courses.Course_List'
            },
            {
              'link': '../../user-list',
              'display': 'Courses.User_List'
            },
            {
              'display': 'AUTH.PROFILE'
            }
          ];
        }
    }

    ngOnInit() {
        const _this = this;
        if (this.cookieService.get('userCrs')) {
            this.userCrs = JSON.parse(this.cookieService.get('userCrs'));
            this.service.loadUserCrsProfile({userSig: _this.userCrs.userSig}).subscribe(resp => {
                _this.userProfile = resp['data'];
                _this.userProfile.courses.forEach(course => {
                    course.rank = _this.utilsService.getRandomArbitraryInteger(1, 5);
                });
            });
        }
    }
    showCourseCurriculum(courseEnroll) {
        const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
        this.cookieService.put('courseInfo', JSON.stringify({crsSig: courseEnroll.signature}), opt);
        let routLinks = [
            {
                'link': '../../course-list',
                'display': 'COURSES.LIST'
            },
            {
                'link': '../../user-list',
                'display': 'Courses.Usr_list'
            },
            {
                'link': '../../user-list/user-profile',
                'display': 'AUTH.PROFILE'
            },
            {
                'display': 'Courses.Course_Curriculum'
            }
        ];
        if (this.toRouters.length === 4) {
          routLinks = [
            {
              'link': '../',
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
              'link': '../../user-list/user-profile',
              'display': 'AUTH.PROFILE'
            },
            {
              'display': 'Courses.Course_Curriculum'
            }
          ];
        }
        this.cookieService.put('routLinks', JSON.stringify(routLinks), opt);
        this.router.navigate(['courses/course-list/course-curriculum']);
    }

    get getCreateDateInfo() {
        return this.utilsService.getCreateDateInfo;
    }

    showCertificate(certificateIndex: number) {
        this.selectedCertificate = this.userProfile.certifications[certificateIndex];
        this.modal.show();
    }

    showSignature(certificateIndex: number) {
        this.selectedCertificate = this.userProfile.certifications[certificateIndex];
        this.modal.show();
    }

    downloadCert(modal) {
        this.utilsService.getImage(this.selectedCertificate.url, modal);
    }

    updateScore($event, courseIndex: number) {
        const data = {
            crsId: (this.userProfile.courses[courseIndex].id) ? this.userProfile.courses[courseIndex].id : 0,
            score: $event.score
        };
        if (data.crsId) {
            this.service.updateCrsRank(data).subscribe(resp => {
            });
        }
    }
}
