import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CmsComponent } from './cms.component';
import { CmsGuard } from './cms-guard.service';
import { CmsCreatorGuard } from './cms-creator-guard.service';
import { CmsVendorGuard } from './cms-vendor-guard.service';

const routes: Routes = [
  {
    path: '',
    component: CmsComponent
  },
  {
    path: 'creator',
    loadChildren: './creator/creator.module#CmsCreatorModule',
    canActivate: [CmsGuard, CmsCreatorGuard]
  },
  {
    path: 'vendor',
    loadChildren: './vendor/vendor.module#CmsVendorModule',
    canActivate: [CmsGuard, CmsVendorGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CmsRoutingModule {
}
