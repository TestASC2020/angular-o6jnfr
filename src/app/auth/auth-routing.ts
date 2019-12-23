import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {PermissionDenyComponent} from './403/permission-deny.component';
import {RegisterComponent} from './register/register.component';
import {NotFoundComponent} from './404/not-found.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';

const authRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '403', component: PermissionDenyComponent },
  { path: '404', component: NotFoundComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule],
})
export class AuthRoutingModule { }
