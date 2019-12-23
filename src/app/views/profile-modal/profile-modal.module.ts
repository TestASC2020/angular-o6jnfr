import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileModalComponent } from './profile-modal.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ProfileModalComponent
  ],
  entryComponents: [
    ProfileModalComponent
  ],
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [
    ProfileModalComponent
  ]
})
export class ProfileModalModule { }
