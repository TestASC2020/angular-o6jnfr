import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from 'src/app/auth/auth-guard.service';
import { ProfileOrgGroupComponent } from './profile-org-group.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileOrgGroupComponent,
    children: [
    ],
    canActivate: [AuthGuard]
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProfileOrgGroupRoutingModule {
}
