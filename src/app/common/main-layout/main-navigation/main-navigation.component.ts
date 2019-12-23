import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LANGUAGES } from 'src/app/app.static';
import { MDBModalService } from 'src/app/lib';
import { ActivatedRoute, Router } from '@angular/router';
import { PreloaderService } from 'src/app/shared/pre-loader/service/pre-loader.service';
import { AppState } from 'src/app/app-state.service';
import { AppSharedService } from 'src/app/app-shared.service';

@Component({
    selector: '[app-main-navigation]',
    templateUrl: './main-navigation.component.html',
    styleUrls: ['./main-navigation.component.scss']
})
export class MainNavigationComponent implements OnInit {
    selectedLanguage: any;

    constructor(private translate: TranslateService,
        private modalService: MDBModalService,
        private router: Router,
        private route: ActivatedRoute,
        private preloader: PreloaderService,
        private appState: AppState,
        private appShared: AppSharedService) {
        this.selectedLanguage = this.appState.locale || null;
        this.translate.onLangChange.subscribe(
            lang => {
                this.selectedLanguage = this.appState.locale;
            }
        );
    }

    openMessagePage() {
        this.router.navigate(['message']);
    }

    ngOnInit() {
    }

    get languages(): any {
        return LANGUAGES;
    }

    /*openProfilePage(): void {
        this.router.navigate(['/profile']);
    }*/

    updateLanguage(language: any) {
        this.appState.locale = language;
        this.translate.use(language.code);
        this.selectedLanguage = this.appState.locale;
    }
}
