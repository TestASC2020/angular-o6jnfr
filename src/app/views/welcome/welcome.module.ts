

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WelcomeComponent } from './welcome.component';
import { TranslateModule } from '@ngx-translate/core';
import { MDBBootstrapModulesPro } from 'src/app/lib';
import { WelcomeRoutingModule } from './welcome-routing.module';
import {IntroService} from '../../services/intro.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    WelcomeRoutingModule,
    TranslateModule,
    MDBBootstrapModulesPro.forRoot(),
  ],
  declarations: [
    WelcomeComponent
  ],  
  providers: [IntroService]
})
export class WelcomeModule {

}
