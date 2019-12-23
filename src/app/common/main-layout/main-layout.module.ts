import {AsyncPipe, CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MDBBootstrapModulesPro} from 'src/app/lib';
import {TranslateModule} from '@ngx-translate/core';
import {ProfileModalModule} from 'src/app/views/profile-modal/profile-modal.module';
import {SwitchBusinessModalModule} from 'src/app/views/switch-business-modal/switch-business-modal.module';
import {MainNavigationComponent} from './main-navigation/main-navigation.component';
import {FooterComponent} from './footer/footer.component';
import {NavigationComponent} from './navigation/navigation.component';
import {MessageSkypeService} from '../../services/message-skype.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    ProfileModalModule,
    SwitchBusinessModalModule,
    MDBBootstrapModulesPro.forRoot()
  ],
  declarations: [
    FooterComponent,
    MainNavigationComponent,
    NavigationComponent
  ],
  exports: [
    FooterComponent,
    MainNavigationComponent,
    NavigationComponent
  ],
  providers: [
      AsyncPipe,
      MessageSkypeService
  ]
})
export class MainLayoutModule {

}
