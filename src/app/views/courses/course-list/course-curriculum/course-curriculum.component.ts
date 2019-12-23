import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalDirective} from '../../../../lib/ng-uikit-pro-standard/free/modals';
import {CookieService} from 'ngx-cookie';
import {CoursesService} from '../../../../services/courses.service';

@Component({
  selector: 'app-courses-course-curriculum',
  templateUrl: './course-curriculum.component.html',
  styleUrls: ['./course-curriculum.component.scss']
})
export class CourseCurriculumComponent implements OnInit {
  @ViewChild('exportModal') exportModal: ModalDirective;
  cv: any;
  courseInfo: any;
  toRouters: Array<any>;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private service: CoursesService,
              private cookieService: CookieService) {
  }
  ngOnInit() {
    const _this = this;
    if (this.cookieService.get('routLinks')) {
      this.toRouters = JSON.parse(this.cookieService.get('routLinks'));
      if ((this.toRouters.length === 5 && this.toRouters[3]['display'] !== 'AUTH.PROFILE') || this.toRouters.length === 6) {
        this.toRouters.splice(this.toRouters.length - 1);
        delete this.toRouters[this.toRouters.length - 1].link;
        this.toRouters.forEach(lk => {
          if (lk['link']) {
            lk['link'] = lk['link'].replace('../', '');
          }
        });
      } else if (this.toRouters.length === 3) {
        this.toRouters = [
          {
            link: '/courses/course-list',
            display: 'Courses.Course'
          },
          {
            display: 'Courses.Course_Curriculum'
          }
        ];
      }
    } else if (this.cookieService.get('toRouters')) {
      this.toRouters = JSON.parse(this.cookieService.get('toRouters'));
    } else {
      this.toRouters = [
        {
          'link': '../../course-list',
          'display': 'Courses.Course_List'
        },
        {
          'display': 'Courses.Course_Curriculum'
        }
      ];
    }
    if (this.cookieService.get('courseInfo')) {
      this.courseInfo = JSON.parse(this.cookieService.get('courseInfo'));
      this.service.loadCurriculum({crsSig: this.courseInfo.crsSig}).subscribe(resp => {
        _this.cv = resp['data'];
      });
    }
  }

  viewLesson(unit: any, lesson: any) {
    const opt = {expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate())};
    const lessionGroup = [];
    if (unit.lessonGroup && unit.lessonGroup.length > 0) {
      unit.lessonGroup.forEach(gr => {
        lessionGroup.push({
          signature: gr.signature,
          name: gr.name
        });
      });
    }
    this.cookieService.put('lessonGroup',
      JSON.stringify(lessionGroup), opt);
    const sendLesson = {
      signature: lesson.signature,
      name: lesson.name,
      unitSig: unit.signature,
      unitName: unit.name
    };
    this.cookieService.put('lessonInfo',
      JSON.stringify(sendLesson), opt);
    let routLinks = [];
    if (this.toRouters.length === 5) {
      routLinks = [
        {
          'link': '../../',
          'display': 'Courses.Course'
        },
        {
          'link': '../../../report',
          'display': 'SIDEBAR.COURSES.REPORT.NAME'
        },
        {
          'link': '../../../report/report-enroll-left-user',
          'display': 'Courses.Enroll_Left_Users'
        },
        {
          'link': '../../../user-list/user-profile',
          'display': 'AUTH.PROFILE'
        },
        {
          'link': '../',
          'display': 'Courses.Course_Curriculum'
        },
        {
          'display': 'MESSAGE.Lessons'
        }
      ];
    } else if (this.toRouters.length === 4) {
      routLinks = [
        {
          'link': '../../../course-list',
          'display': 'COURSES.LIST'
        },
        {
          'link': '../../../user-list',
          'display': 'Courses.Usr_list'
        },
        {
          'link': '../../../user-list/user-profile',
          'display': 'AUTH.PROFILE'
        },
        {
          'link': '../../../course-list/course-curriculum',
          'display': 'Courses.Course_Curriculum'
        },
        {
          'display': 'MESSAGE.Lessons'
        }
      ];
    } else {
      routLinks = [
        {
          'link': '/courses/course-list',
          'display': 'Courses.Course_List'
        },
        {
          'link': '/courses/course-list/course-curriculum',
          'display': 'Courses.Course_Curriculum'
        },
        {
          'display': 'MESSAGE.Lessons'
        },
      ];
    }
    this.cookieService.put('routLinks', JSON.stringify(routLinks), opt);
    this.router.navigate(['courses/course-list/course-curriculum/course-lesson']);
  }

  viewExercise(unit: any, exercise: any) {
    const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
    const sendExercise = {
      signature: exercise.signature,
      name: exercise.name,
      unitSig: unit.signature,
      unitName: unit.name
    };
    this.cookieService.put('exerciseInfo', JSON.stringify(sendExercise), opt);
    let routLinks = [];
    if (this.toRouters.length === 5) {
      routLinks = [
        {
          'link': '../../',
          'display': 'Courses.Course'
        },
        {
          'link': '../../../report',
          'display': 'SIDEBAR.COURSES.REPORT.NAME'
        },
        {
          'link': '../../../report/report-enroll-left-user',
          'display': 'Courses.Enroll_Left_Users'
        },
        {
          'link': '../../../user-list/user-profile',
          'display': 'AUTH.PROFILE'
        },
        {
          'link': '../',
          'display': 'Courses.Course_Curriculum'
        },
        {
          'display': 'MESSAGE.NameList.Exercise'
        }
      ];
    } else if (this.toRouters.length === 4) {
      routLinks = [
        {
          'link': '../../../course-list',
          'display': 'COURSES.LIST'
        },
        {
          'link': '../../../user-list',
          'display': 'Courses.Usr_list'
        },
        {
          'link': '../../../user-list/user-profile',
          'display': 'AUTH.PROFILE'
        },
        {
          'link': '../../../course-list/course-curriculum',
          'display': 'Courses.Course_Curriculum'
        },
        {
          'display': 'MESSAGE.NameList.Exercise'
        }
      ];
    } else {
      routLinks = [
        {
          'link': '/courses/course-list',
          'display': 'Courses.Course_List'
        },
        {
          'link': '/courses/course-list/course-curriculum',
          'display': 'Courses.Course_Curriculum'
        },
        {
          'display': 'MESSAGE.NameList.Exercise'
        },
      ];
    }
    this.cookieService.put('routLinks', JSON.stringify(routLinks), opt);
    this.router.navigate(['courses/course-list/course-curriculum/course-exercises-view']);
  }

  viewQuiz(unit: any, quiz: any) {
    const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
    const sendQuestion = {
      signature: quiz.signature,
      name: quiz.name,
      unitSig: unit.signature,
      unitName: unit.name
    };
    this.cookieService.put('questionInfo',
      JSON.stringify(sendQuestion), opt);
    let routLinks = [];
    if (this.toRouters.length === 5) {
      routLinks = [
        {
          'link': '../../',
          'display': 'Courses.Course'
        },
        {
          'link': '../../../report',
          'display': 'SIDEBAR.COURSES.REPORT.NAME'
        },
        {
          'link': '../../../report/report-enroll-left-user',
          'display': 'Courses.Enroll_Left_Users'
        },
        {
          'link': '../../../user-list/user-profile',
          'display': 'AUTH.PROFILE'
        },
        {
          'link': '../',
          'display': 'Courses.Course_Curriculum'
        },
        {
          'display': 'MESSAGE.NameList.Question'
        }
      ];
    } else if (this.toRouters.length === 4) {
      routLinks = [
        {
          'link': '../../../course-list',
          'display': 'COURSES.LIST'
        },
        {
          'link': '../../../user-list',
          'display': 'Courses.Usr_list'
        },
        {
          'link': '../../../user-list/user-profile',
          'display': 'AUTH.PROFILE'
        },
        {
          'link': '../../../course-list/course-curriculum',
          'display': 'Courses.Course_Curriculum'
        },
        {
          'display': 'MESSAGE.NameList.Question'
        }
      ];
    } else {
      routLinks = [
        {
          'link': '/courses/course-list',
          'display': 'Courses.Course_List'
        },
        {
          'link': '/courses/course-list/course-curriculum',
          'display': 'Courses.Course_Curriculum'
        },
        {
          'display': 'MESSAGE.NameList.Question'
        },
      ];
    }
    this.cookieService.put('routLinks', JSON.stringify(routLinks), opt);
    this.router.navigate(['courses/course-list/course-curriculum/course-quiz-view']);
  }
}
