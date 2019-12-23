import {CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoginComponent} from './login/login.component';
import {AuthRoutingModule} from './auth-routing';
import {PermissionDenyComponent} from './403/permission-deny.component';
import {AuthService} from './auth.service';
import {AsyncPipe, CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {AuthGuard} from './auth-guard.service';
import {RegisterComponent} from './register/register.component';
import {NotFoundComponent} from './404/not-found.component';
import {PolicyComponent} from './register/policy/policy.component';
import {UserService} from '../services/user.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {SwitchBusinessModalModule} from '../views/switch-business-modal/switch-business-modal.module';
import {RegisterService} from '../services/register.service';
import {MDBBootstrapModulesPro, ToastService} from '../lib/ng-uikit-pro-standard';
import {RecoveryService} from '../services/recovery.service';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';

@NgModule({
    declarations: [
        LoginComponent,
        PermissionDenyComponent,
        RegisterComponent,
        PolicyComponent,
        NotFoundComponent,
        ForgotPasswordComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        AuthRoutingModule,
        ReactiveFormsModule,
        MDBBootstrapModulesPro.forRoot(),
        TranslateModule,
        SwitchBusinessModalModule,
        CKEditorModule,
    ],
    entryComponents: [
        PolicyComponent
    ],
    providers: [
        AuthService,
        UserService,
        RegisterService,
        RecoveryService,
        AsyncPipe,
        AuthGuard,
        TranslateService,
        ToastService,
    ],
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    exports: []
})
export class AuthModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AuthModule,
            providers: [
                AuthService, AuthGuard
            ]
        };
    }
}
