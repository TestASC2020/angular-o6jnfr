import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {HttpModule} from './shared/http/http.module';
import {CookieModule} from 'ngx-cookie';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpService} from './shared/http/service/http.service';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {MDBBootstrapModulesPro, MDBSpinningPreloader, ToastModule} from './lib';
import {AuthModule} from './auth/auth.module';
import {AppState} from './app-state.service';
import {MainLayoutModule} from './common/main-layout/main-layout.module';
import {PreloaderModule} from './shared/pre-loader/pre-loader.module';
import {AppSharedService} from './app-shared.service';
import {environment} from '../environments/environment';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireMessagingModule} from '@angular/fire/messaging';
import * as firebase from 'firebase/app';
import 'firebase/messaging';
import {AngularFirestoreModule} from '@angular/fire/firestore';

firebase.initializeApp(environment.firebaseConfig);

export function HttpLoaderFactory(http: HttpService) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    AppRoutingModule,
    HttpModule.forRoot(),
    CookieModule.forRoot(),
    ToastModule.forRoot(),
    AuthModule.forRoot(),
    PreloaderModule.forRoot(),
    MDBBootstrapModulesPro.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpService]
      }
    }),
    MainLayoutModule
  ],
  providers: [
    MDBSpinningPreloader,
    AppState,
    AppSharedService
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
