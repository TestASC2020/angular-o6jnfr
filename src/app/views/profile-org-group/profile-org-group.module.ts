import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileOrgGroupComponent } from './profile-org-group.component';
import { ProfileOrgGroupRoutingModule } from './profile-org-group-routing.module';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MDBBootstrapModulesPro} from '../../lib/ng-uikit-pro-standard';

@NgModule({
  declarations: [ProfileOrgGroupComponent],
  imports: [
    CommonModule,
    TranslateModule,
    ProfileOrgGroupRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModulesPro.forRoot(),
  ]
})
export class ProfileOrgGroupModule { }
