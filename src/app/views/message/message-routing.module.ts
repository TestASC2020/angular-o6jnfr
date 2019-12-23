import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MessageComponent } from './message.component';
import { AuthGuard } from 'src/app/auth/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: MessageComponent,
    children: [
    ],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MessageRoutingModule {
}
