import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CoursesService} from '../../../../services/courses.service';
import {CookieService} from 'ngx-cookie';
import {UtilsService} from '../../../../services/utils.service';
import {ModalDirective} from '../../../../lib/ng-uikit-pro-standard/free/modals';

@Component({
    selector: 'app-courses-course-info',
    templateUrl: './course-info.component.html',
    styleUrls: ['./course-info.component.scss']
})
export class CourseInfoComponent implements OnInit {
    @ViewChild('errorModal') errorModal: ModalDirective;
    error: any;
    courseInfo: any;
    staffList: Array<any> = new Array<any>();
    toRouters: Array<any>;

    constructor(private router: Router,
                private cookieService: CookieService,
                private route: ActivatedRoute,
                private utilsService: UtilsService,
                private service: CoursesService) {
    }

    ngOnInit() {
        if (this.cookieService.get('routLinks')) {
            this.toRouters = JSON.parse(this.cookieService.get('routLinks'));
        } else if (this.cookieService.get('toRouters')) {
            this.toRouters = JSON.parse(this.cookieService.get('toRouters'));
        } else {
            this.toRouters = [
                {
                    'link': '../',
                    'display': 'Courses.Course'
                },
                {
                    'display': 'Courses.Course_info'
                }
            ];
        }
        if (this.toRouters[this.toRouters.length - 1]['display'].indexOf('LAYOUT.EDIT') !== -1) {
            this.toRouters.splice(this.toRouters.length - 1, 1);
            this.toRouters.forEach(lk => {
               lk['link'] = lk['link'].replace('../', '');
               if (lk['link'].indexOf('../') < 0) {
                   lk['link'] = '../' + lk['link'];
               }
            });
            delete this.toRouters[this.toRouters.length - 1]['link'];
        }
        if (this.cookieService.get('courseInfo')) {
            const temp = JSON.parse(this.cookieService.get('courseInfo'));
            const data = {
                crsSig: temp.crsSig
            };
            this.service.loadCrsInfo(data).subscribe(resp => {
               this.courseInfo = resp['data'];
                this.courseInfo['crsName'] = temp.crsName;
                this.courseInfo['crsSig'] = temp.crsSig;
                if (this.courseInfo.staff && this.courseInfo.staff.length > 0) {
                    this.courseInfo.staff.forEach(staff => {
                        this.staffList.push(staff);
                    });
                } else {
                    this.staffList = [];
                }
            });
        }
    }

    get getCreateDateInfo() {
        return this.utilsService.getCreateDateInfo;
    }

    infoedit() {
        const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
        this.cookieService.put('courseInfo', JSON.stringify({crsSig: this.courseInfo.signature, cvId: this.courseInfo.cvId}), opt);
        const routLinks = [
            {
                'link': '../',
                'display': 'Courses.Course'
            },
            {
                'link': '../course-info',
                'display': 'Courses.Course_info'
            },
            {
                'display': 'LAYOUT.EDIT'
            }
        ];
        this.cookieService.put('routLinks', JSON.stringify(routLinks), opt);
        this.router.navigate(['courses/course-list/course-edit']);
    }

    getTutorList() {
        return this.staffList.filter(item => item.type === 1);
    }

    getAdminList() {
        return this.staffList.filter(item => item.type === 2);
    }

    gotoStaffProfiles(user) {
        this.service.loadOrgStaffProfile({staffSig: user.userSig}).subscribe(
            resp => {
                const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
                this.cookieService.put('staffInfo',
                    JSON.stringify({
                        crsName: this.courseInfo.crsName, crsSig: this.courseInfo.crsSig, userSig: user.userSig}),
                    opt);
                this.router.navigate(['courses/course-list/course-info/staff-profile']);
            },
            err => {
                this.error = {
                    text: 'Load staff profile error: ' + err.text
                };
                this.errorModal.show();
            }
        );
    }
}
