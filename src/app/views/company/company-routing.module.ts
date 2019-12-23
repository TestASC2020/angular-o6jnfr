import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CompanyComponent } from './company.component';
import { AuthGuard } from 'src/app/auth/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: CompanyComponent,
    children: [
    ],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyRoutingModule {
}
