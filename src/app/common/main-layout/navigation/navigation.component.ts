import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from 'src/app/auth/auth.service';
import {TranslateService} from '@ngx-translate/core';
import {LANGUAGES} from 'src/app/app.static';
import {AppState} from 'src/app/app-state.service';
import {MDBModalService} from 'src/app/lib';
import {SwitchBusinessModalComponent} from 'src/app/views/switch-business-modal/switch-business-modal.component';
import {ActivatedRoute, Router} from '@angular/router';
import {PreloaderService} from 'src/app/shared/pre-loader/service/pre-loader.service';
import {UserService} from 'src/app/services/user.service';
import {ServerResponseModel} from 'src/app/models/server-response';
import {UserLoginOrg} from 'src/app/models/user-org';
import {EventService} from 'src/app/services/event.service';
import {ROLE} from 'src/app/models/role.enum';
import {ORG_TYPE} from 'src/app/models/org-type.enum';
import {UserProfile} from 'src/app/models/user-profile';
import {AppSharedService} from 'src/app/app-shared.service';
import {CookieService} from 'ngx-cookie';
import {MessageSkypeService} from '../../../services/message-skype.service';


@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
    @ViewChild('sidenav') sidenav: any;

    clicked: boolean;
    selectedLanguage: any;
    user: UserProfile;
    totalUnSeenMessages: number = 0;
    messageThreads: Array<any> = new Array<any>();

    constructor(
        public authService: AuthService,
        public userService: UserService,
        public translate: TranslateService,
        private appState: AppState,
        private modalService: MDBModalService,
        private router: Router,
        private cookieService: CookieService,
        private route: ActivatedRoute,
        private preloader: PreloaderService,
        private eventService: EventService,
        private messageSkypeService: MessageSkypeService,
        private appShared: AppSharedService) {
        this.messageSkypeService.getPermission();
        this.clicked = this.clicked === undefined ? false : true;
        this.selectedLanguage = this.appState.locale || null;
        this.translate.onLangChange.subscribe(
            lang => {
                this.selectedLanguage = this.appState.locale;
            }
        );
        this.user = new UserProfile();
    }

    updateCounter() {
        const _ = this;
        _.messageSkypeService.loadUserThread({pageNo: 1}).subscribe(res1 => {
            if (res1['data']) {
                _.messageThreads = res1['data'];
                const arr = _.messageThreads.map(item => item.signature);
                if (arr.length > 0) {
                  _.messageSkypeService.loadUnSeenCount({threadSigs: arr}).subscribe(unSeenDataResponse => {
                    const unSeenData = unSeenDataResponse['data'];
                    if (unSeenData) {
                      _.totalUnSeenMessages = 0;
                      unSeenData.forEach(unSeenDataItem => {
                        const searchIndex = _.messageThreads.map(si => si.id).indexOf(unSeenDataItem.threadId);
                        if (searchIndex !== -1) {
                          _.totalUnSeenMessages += unSeenDataItem.count;
                        }
                      });
                      if (document.getElementById('topNotifIcon').getAttribute('data-count').toString() === '' ||
                        document.getElementById('topNotifIcon').getAttribute('data-count').toString() === '0') {
                        document.getElementById('topNotifIcon').setAttribute('class', 'notification');
                      } else {
                        document.getElementById('topNotifIcon').setAttribute('class', 'notification show-count');
                      }
                      setTimeout(function () {
                        if (_.totalUnSeenMessages < 100) {
                          document.getElementById('topNotifIcon').setAttribute('data-count', String(_.totalUnSeenMessages));
                        } else {
                          document.getElementById('topNotifIcon').setAttribute('data-count', '99');
                        }
                        if (_.totalUnSeenMessages) {
                          document.getElementById('topNotifIcon').setAttribute('class', 'notification notify show-count');
                        } else {
                          document.getElementById('topNotifIcon').setAttribute('class', 'notification');
                        }
                      }, 100);
                    }
                  });
                }
            }
        });
    }

    ngOnInit() {
        const _ = this;
        _.updateCounter();
        _.messageSkypeService.getPermission();
        _.messageSkypeService.listenMessage();
        _.messageSkypeService.geMessages().subscribe(data => {
            _.updateCounter();
        });
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

    setClicked(val: boolean): void {
        this.clicked = val;
    }

    get languages() {
        return LANGUAGES;
    }

    get ROLE() {
        return ROLE;
    }

    isAuthenticated(): boolean {
        return this.authService.isAuthenticated();
    }

    isCMSCreator() {
        return this.authService.user && this.authService.user.orgType === ORG_TYPE.BUSINESS;
    }

    isCMSVendor() {
        return this.authService.user && this.authService.user.orgType === ORG_TYPE.VENDOR;
    }

    switchBusiness(): void {
        this.preloader.enableLoading();
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

    openProfileModal(): void {
        this.router.navigate(['profile-org-group']);
    }

    changePassword() {
        this.router.navigate(['profile/change-password']);
    }

    settings() {
        this.router.navigate(['business-profile/settings']);
    }

    openMessagePage() {
        this.router.navigate(['message']);
    }

    logout(): void {
        this.authService.logout();
    }

    updateLanguage(language: any) {
        this.appState.locale = language;
        this.translate.use(language.code);
        this.selectedLanguage = this.appState.locale;
    }

}
