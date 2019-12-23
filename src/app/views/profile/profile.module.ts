import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileComponent} from './profile.component';
import {ProfileRoutingModule} from './profile-routing.module';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MDBBootstrapModulesPro, ToastService} from '../../lib/ng-uikit-pro-standard';
import {ChangePasswordComponent} from './change-password/change-password.component';

@NgModule({
    declarations: [
        ProfileComponent,
        ChangePasswordComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        ProfileRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MDBBootstrapModulesPro.forRoot(),
    ]
})
export class ProfileModule { }