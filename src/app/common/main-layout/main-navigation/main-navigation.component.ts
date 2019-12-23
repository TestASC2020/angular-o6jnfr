import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LANGUAGES } from 'src/app/app.static';
import { AppState } from 'src/app/app-state.service';
import { AuthService } from 'src/app/auth/auth.service';
import { MDBModalService } from 'src/app/lib';
import { SwitchBusinessModalComponent } from 'src/app/views/switch-business-modal/switch-business-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerResponseModel } from 'src/app/models/server-response';
import { UserLoginOrg } from 'src/app/models/user-org';
import { UserService } from 'src/app/services/user.service';
import { PreloaderService } from 'src/app/shared/pre-loader/service/pre-loader.service';
import { EventService } from 'src/app/services/event.service';
import { AppSharedService } from 'src/app/app-shared.service';
import { UserProfile } from 'src/app/models/user-profile';
import {MessageSkypeService} from '../../../services/message-skype.service';

@Component({
    selector: '[app-main-navigation]',
    templateUrl: './main-navigation.component.html',
    styleUrls: ['./main-navigation.component.scss']
})
export class MainNavigationComponent implements OnInit {
    selectedLanguage: any;
    user: UserProfile;

    constructor(private translate: TranslateService,
        private authService: AuthService,
        private userService: UserService,
        private appState: AppState,
        private modalService: MDBModalService,
        private router: Router,
        private route: ActivatedRoute,
        private preloader: PreloaderService,
        private eventService: EventService,
        private messageSkypeService: MessageSkypeService,
        private appShared: AppSharedService) {
        this.selectedLanguage = this.appState.locale || null;
        this.translate.onLangChange.subscribe(
            lang => {
                this.selectedLanguage = this.appState.locale;
            }
        );
        this.user = new UserProfile();
    }

    openMessagePage() {
        this.router.navigate(['message']);
    }

    ngOnInit() {
        this.appShared.getUserProfile().subscribe(
            profile => {
                this.user = profile;
            }
        );
        this.appShared.userProfileChange.subscribe(
            profile => {
                this.user = profile;
            }
        );
    }

    get languages(): any {
        return LANGUAGES;
    }

    isAuthenticated(): boolean {
        return this.authService.isAuthenticated();
    }

    switchBusiness(): void {
        this.preloader.enableLoading()
        this.userService.loadUserOrgList().subscribe(
            (resp: ServerResponseModel<Array<UserLoginOrg>>) => {
                const modalRef = this.modalService.show(SwitchBusinessModalComponent, {
                    backdrop: false,
                    keyboard: false,
                    focus: true,
                    show: false,
                    ignoreBackdropClick: true,
                    class: 'modal-sm',
                    containerClass: '',
                    animated: true,
                    data: {
                        orgList: resp.data
                    }
                });
                modalRef.content.action.subscribe(
                    org => {
                        this.eventService.BroadcastEvent('BUSINESS_CHANGE', org);
                    }
                );
            },
            err => { this.preloader.disableLoading(); },
            () => { this.preloader.disableLoading(); }
        );
    }

    openProfilePage(): void {
        this.router.navigate(['/profile']);
    }

    updateLanguage(language: any) {
        this.appState.locale = language;
        this.translate.use(language.code);
        this.selectedLanguage = this.appState.locale;
    }

    logout(): void {
        this.authService.logout();
    }

}
