import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthGuard} from 'src/app/auth/auth-guard.service';
import {ProfileComponent} from './profile/profile.component';
import {PartnerEditComponent} from './partner-edit/partner-edit.component';
import {EmployeesComponent} from './employees/employees.component';
import {EmployeesFeedbackComponent} from './employees/employees-feedback/employees-feedback.component';
import {EmployeesInviteComponent} from './employees/employees-invite/employees-invite.component';
import {EmployeesListCoursesComponent} from './employees/employees-list-courses/employees-list-courses.component';
import {EmployeesProfileComponent} from './employees/employees-profile/employees-profile.component';
import {SettingsComponent} from './settings/settings.component';
import {BusinessStarComponent} from './business-star/business-star.component';
import {StaffProfileInfoComponent} from './profile/staff-profile-info/staff-profile-info.component';
const routes: Routes = [
    {
        path: '',
        children: [
        ],
        canActivate: [AuthGuard]
    },
    { path: 'partner-edit', component: PartnerEditComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'star', component: BusinessStarComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'profile/staff-profile-info', component: StaffProfileInfoComponent },
    { path: 'employees', component: EmployeesComponent },
    { path: 'employees/employees-feedback', component: EmployeesFeedbackComponent },
    { path: 'employees/employees-invite', component: EmployeesInviteComponent },
    { path: 'employees/employees-list-courses', component: EmployeesListCoursesComponent },
    { path: 'employees/employees-profile', component: EmployeesProfileComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BusinessProfileRoutingModule {
}
