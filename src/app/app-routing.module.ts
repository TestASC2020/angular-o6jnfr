import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './views/welcome/welcome.module#WelcomeModule' },
  { path: 'cms', loadChildren: './views/cms/cms.module#CmsModule'},
  { path: 'courses', loadChildren: './views/courses/courses.module#CoursesModule' },
  { path: 'task', loadChildren: './views/task/task.module#TaskModule' },
  { path: 'company', loadChildren: './views/company/company.module#CompanyModule' },
  { path: 'business-profile', loadChildren: './views/business-profile/business-profile.module#BusinessProfileModule' },
  { path: 'accounting', loadChildren: './views/accounting/accounting.module#AccountingModule' },
  { path: 'message', loadChildren: './views/message/message.module#MessageModule' },
  { path: 'accounting', loadChildren: './views/accounting/accounting.module#AccountingModule' },
  { path: 'profile', loadChildren: './views/profile/profile.module#ProfileModule' },
  { path: 'profile-org-group', loadChildren: './views/profile-org-group/profile-org-group.module#ProfileOrgGroupModule' },
  { path: 'about-us', loadChildren: './views/about-us/about-us.module#AboutUsModule' },
  { path: 'support', loadChildren: './views/support/support.module#SupportModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
