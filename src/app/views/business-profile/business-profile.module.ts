import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BusinessProfileRoutingModule} from './business-profile-routing.module';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MDBBootstrapModulesPro} from '../../lib/ng-uikit-pro-standard';
import {PartnerActionMenuComponent} from './partner-action-menu/partner-action-menu.component';
import {StaffActionMenuComponent} from './staff-action-menu/staff-action-menu.component';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {PopoverModule} from 'ngx-popover';
import {PagerService} from '../../services/pager.service';
import {PartnerEditComponent} from './partner-edit/partner-edit.component';
import {BusinessService} from '../../services/business.service';
import {EmployeesComponent} from './employees/employees.component';
import {EmployeesFeedbackComponent} from './employees/employees-feedback/employees-feedback.component';
import {EmployeesInviteComponent} from './employees/employees-invite/employees-invite.component';
import {EmployeesListCoursesComponent} from './employees/employees-list-courses/employees-list-courses.component';
import {EmployeesProfileComponent} from './employees/employees-profile/employees-profile.component';
import {SettingsComponent} from './settings/settings.component';
import {ActionMenuComponent} from './employees/action-menu/action-menu.component';
import {ProfileComponent} from './profile/profile.component';
import {BusinessStarComponent} from './business-star/business-star.component';
import {StaffProfileInfoComponent} from './profile/staff-profile-info/staff-profile-info.component';
import {UtilsService} from '../../services/utils.service';

@NgModule({
    declarations: [
        ProfileComponent,
        StaffProfileInfoComponent,
        PartnerActionMenuComponent,
        StaffActionMenuComponent,
        PartnerEditComponent,
        EmployeesComponent,
        EmployeesFeedbackComponent,
        EmployeesInviteComponent,
        EmployeesListCoursesComponent,
        EmployeesProfileComponent,
        SettingsComponent,
        ActionMenuComponent,
        BusinessStarComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        BusinessProfileRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MDBBootstrapModulesPro.forRoot(),
        CKEditorModule,
        PopoverModule
    ],
    providers: [
        PagerService,
        BusinessService,
        UtilsService
    ]
})
export class BusinessProfileModule { }
