import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CoursesRoutingModule} from './courses-routing.module';
import {CourseListComponent} from './course-list/course-list.component';
import {UserListComponent} from './user-list/user-list.component';
import {ReportComponent} from './report/report.component';
import {TranslateModule} from '@ngx-translate/core';
import {MDBBootstrapModulesPro, ToastService} from '../../lib/ng-uikit-pro-standard';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {PopoverModule} from 'ngx-popover';
import {PagerService} from '../../services/pager.service';
import {CourseEditComponent} from './course-list/course-edit/course-edit.component';
import {CourseInfoComponent} from './course-list/course-info/course-info.component';
import {StaffProfileComponent} from './course-list/course-info/staff-profile/staff-profile.component';
import {CourseContractComponent} from './course-list/course-contract/course-contract.component';
import {CourseCurriculumComponent} from './course-list/course-curriculum/course-curriculum.component';
import {CourseDiscussionComponent} from './course-list/course-discussion/course-discussion.component';
import {CourseDiscussionThreadComponent} from './course-list/course-discussion/course-discussion-thread/course-discussion-thread.component';
import {UserProfileComponent} from './user-list/user-profile/user-profile.component';
import {ProgressComponent} from './user-list/progress/progress.component';
import {CourseLessonComponent} from './course-list/course-curriculum/course-lesson/course-lesson.component';
import {CourseExercisesViewComponent} from './course-list/course-curriculum/course-exercises-view/course-exercises-view.component';
import {CourseQuizViewComponent} from './course-list/course-curriculum/course-quiz-view/course-quiz-view.component';
import {StarComponent} from '../star/star.component';
import {CoursesService} from '../../services/courses.service';
import {UserMessagesComponent} from './user-list/user-messages/user-messages.component';
import {CurriculumsService} from '../../services/curriculums.service';
import {CourseListActionMenuComponent} from './course-list/course-list-action-menu/course-list-action-menu.component';
import {UserListActionMenuComponent} from './user-list/user-list-action-menu/user-list-action-menu.component';
import {UtilsService} from '../../services/utils.service';
import {ExcelService} from '../../services/excel.service';
import {ChatService} from '../../services/chat.service';
import {NgxSpinnerModule} from 'ngx-spinner';
import {ClientEventService} from '../../services/client-event.service';
import {PdfService} from '../../services/pdf.service';
import {ReportEnrollActionMenuComponent} from './report/report-enroll-left-user/report-enroll-action-menu/report-enroll-action-menu';
import {ReportEnrollLeftUserComponent} from './report/report-enroll-left-user/report-enroll-left-user.component';


@NgModule({
    declarations: [
        UserListActionMenuComponent,
        CourseListActionMenuComponent,
        CourseListComponent,
        UserListComponent,
        ReportComponent,
        CourseEditComponent,
        CourseInfoComponent,
        StaffProfileComponent,
        CourseContractComponent,
        CourseCurriculumComponent,
        CourseDiscussionComponent,
        CourseDiscussionThreadComponent,
        UserProfileComponent,
        ProgressComponent,
        CourseLessonComponent,
        CourseExercisesViewComponent,
        CourseQuizViewComponent,
        UserMessagesComponent,
        StarComponent,
        ReportEnrollActionMenuComponent,
        ReportEnrollLeftUserComponent
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CoursesRoutingModule,
        CommonModule,
        TranslateModule,
        MDBBootstrapModulesPro.forRoot(),
        CKEditorModule,
        PopoverModule,
        NgxSpinnerModule
    ],
    providers: [
        UtilsService,
        PagerService,
        CoursesService,
        CurriculumsService,
        ClientEventService,
        ToastService,
        DatePipe,
        ExcelService,
        PdfService,
        ChatService
    ]
})
export class CoursesModule { }
