import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CourseListComponent} from './course-list/course-list.component';
import {UserListComponent} from './user-list/user-list.component';
import {ReportComponent} from './report/report.component';
import {AuthGuard} from '../../auth/auth-guard.service';
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
import {UserMessagesComponent} from './user-list/user-messages/user-messages.component';
import {ReportEnrollLeftUserComponent} from './report/report-enroll-left-user/report-enroll-left-user.component';

const routes: Routes = [
    {
        path: '',
        children: [
        ],
        canActivate: [AuthGuard]
    },
    { path: 'course-list', component: CourseListComponent },
    { path: 'course-list/course-edit', component: CourseEditComponent },
    { path: 'course-list/course-info', component: CourseInfoComponent },
    { path: 'course-list/course-info/staff-profile', component: StaffProfileComponent },
    { path: 'course-list/course-contract', component: CourseContractComponent },
    { path: 'course-list/course-curriculum', component: CourseCurriculumComponent},
    { path: 'course-list/course-curriculum/course-lesson', component: CourseLessonComponent},
    { path: 'course-list/course-curriculum/course-exercises-view', component: CourseExercisesViewComponent},
    { path: 'course-list/course-curriculum/course-quiz-view', component: CourseQuizViewComponent},
    { path: 'course-list/course-discussion', component: CourseDiscussionComponent},
    { path: 'course-list/course-discussion/course-discussion-thread', component: CourseDiscussionThreadComponent},
    { path: 'user-list', component: UserListComponent },
    { path: 'user-list/progress', component: ProgressComponent },
    { path: 'user-list/user-profile', component: UserProfileComponent },
    { path: 'user-list/user-messages', component: UserMessagesComponent},
    { path: 'report', component: ReportComponent },
    { path: 'report/report-enroll-left-user', component: ReportEnrollLeftUserComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoursesRoutingModule {
}
