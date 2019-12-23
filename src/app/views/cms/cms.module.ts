import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CmsComponent} from './cms.component';
import {CmsRoutingModule} from './cms-routing.module';
import {CmsGuard} from './cms-guard.service';
import {CmsCreatorGuard} from './cms-creator-guard.service';
import {CmsVendorGuard} from './cms-vendor-guard.service';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';

@NgModule({
  declarations: [
      CmsComponent
  ],
  imports: [
    CommonModule,
    CmsRoutingModule
  ],
  providers: [
    CmsGuard,
    CmsCreatorGuard,
    CmsVendorGuard,
    CKEditorModule
  ]
})
export class CmsModule { }
