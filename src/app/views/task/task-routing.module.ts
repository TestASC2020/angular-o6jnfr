import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TaskComponent } from './task.component';
import { AuthGuard } from 'src/app/auth/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: TaskComponent,
    children: [
    ],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskRoutingModule {
}
