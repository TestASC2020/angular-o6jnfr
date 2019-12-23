import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {AuthGuard} from '../../auth/auth-guard.service';

const routes: Routes = [
    {
        path: '',
        children: [
        ],
        canActivate: [AuthGuard]
    },
    { path: 'change-password', component: ChangePasswordComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {
}
