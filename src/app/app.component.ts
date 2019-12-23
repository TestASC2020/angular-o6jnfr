import { Component, AfterViewInit } from '@angular/core';
import { LANGUAGES } from './app.static';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd, ActivatedRoute, NavigationStart } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from './auth/auth.service';
import { AppState } from './app-state.service';
import { PreloaderService } from './shared/pre-loader/service/pre-loader.service';
import { EventService } from './services/event.service';
import { UserLoginOrg } from './models/user-org';
import { CookieService } from 'ngx-cookie';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'e-learning';
    private currentUrl = '';
    specialPage: boolean = true;

    private specialPages: any[] = [
        '/login',
        '/register',
        '/forgot-password',
        '/change-password',
        '/',
        '/404',
        '/403',
        '/about-us',
        '/support',
        '/profile',
        '/message',
        'business-profile',
        'profile-org-group'
    ];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public translate: TranslateService,
        public authService: AuthService,
        private appState: AppState,
        private preloaderService: PreloaderService,
        private eventService: EventService,
        private cookieService: CookieService) {

        this.router.events.subscribe((route: any) => {
            if (route instanceof NavigationStart) {
                this.preloaderService.enableLoading();
            }

            if (route instanceof NavigationEnd) {
                this.currentUrl = route.urlAfterRedirects || route.url;
                const absoluteUrl = this.currentUrl.split('?')[0];
                this.specialPage = this.specialPages.indexOf(absoluteUrl) !== -1;
                this.preloaderService.disableLoading();
            }
        });

        const languages = LANGUAGES.map(i => i.code);
        translate.addLangs(languages);
        translate.setDefaultLang(languages[0]);

        const browserLang = translate.getBrowserLang();
        const languageUse = languages.indexOf(browserLang) >= 0 ? browserLang : languages[0];
        translate.use(languageUse);
        this.appState.locale = LANGUAGES.filter(i => i.code === languageUse)[0];

        this.eventService.GetEvent('BUSINESS_CHANGE').subscribe(
            (data: UserLoginOrg) => {
                if (authService.isAuthenticated()) {
                    this.authService.changeOrg(data.id).subscribe(
                        authData => {
                            this.cookieService.put('org', data.id);
                            this.router.navigate(['cms'], { relativeTo: this.route });
                        }
                    );
                }
            }
        );
    }

    get preloader() {
        return this.preloaderService;
    }

    goBack(): void {
        this.location.back();
    }
}