import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {TranslateService} from '@ngx-translate/core';
import {UserLoginModel} from 'src/app/models/user-login';
import {MDBModalService, ModalDirective} from 'src/app/lib';
import {SwitchBusinessModalComponent} from 'src/app/views/switch-business-modal/switch-business-modal.component';
import {UserResponseModel} from 'src/app/models/user-response';
import {UserService} from 'src/app/services/user.service';
import {ServerResponseModel} from 'src/app/models/server-response';
import {UserLoginOrg} from 'src/app/models/user-org';
import {Observable} from 'rxjs';
import {PreloaderService} from 'src/app/shared/pre-loader/service/pre-loader.service';
import {environment} from 'src/environments/environment';
import {EventService} from 'src/app/services/event.service';
import {AppState} from 'src/app/app-state.service';
import {CookieService} from 'ngx-cookie';

declare const FB: any;
declare const gapi: any;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    @ViewChild('errorModal') errorModal: ModalDirective;
    signinForm: FormGroup;
    submitted: boolean = false;
    errorShow: string;
    error: any;
    auth2: any;
    showPass: boolean = false;

    constructor(
        private ngZone: NgZone,
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthService,
        private translate: TranslateService,
        private userService: UserService,
        private modalService: MDBModalService,
        private cookieService: CookieService,
        private preloaderService: PreloaderService,
        private eventService: EventService,
        private appState: AppState,
        private service: UserService) {
        this.createForm();
        if (this.cookieService.get('userInfo')) {
            const user = JSON.parse(this.cookieService.get('userInfo'));
            this.signinForm.get('email').setValue(user.email);
            this.signinForm.get('password').setValue(user.password);
            this.onSubmit();
        }
    }

    ngOnInit() {
        setTimeout(() => {
            this.authService.logout();
        }, 0);
        this.facebookInit();
        this.googleInit();
    }

    createForm() {
        this.signinForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9.-]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')]),
            password: new FormControl('', [Validators.required, Validators.minLength(6)]),
            remember: new FormControl(''),
        });
    }

    facebookInit() {
        (window as any).fbAsyncInit = function () {
            FB.init({
                appId: environment.facebookAppId,
                cookie: true,
                xfbml: true,
                version: environment.facebookGraphVersion
            });
            FB.AppEvents.logPageView();
        };

        (function (d, s, id) {
            let js;
            const fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = 'https://connect.facebook.net/en_US/sdk.js';
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }

    googleInit() {
        gapi.load('auth2', () => {
            this.auth2 = gapi.auth2.init({
                client_id: environment.googleClientId,
                cookiepolicy: 'single_host_origin',
                scope: 'profile email'
            });
            this.onGGLogin(document.getElementById('googleBtn'));
        });
    }

    onGGLogin(element) {
        this.auth2.attachClickHandler(element, {},
            (googleUser) => {
                const profile = googleUser.getBasicProfile();
                const authResp = googleUser.getAuthResponse();
                const token = authResp.id_token;
                const isRemember = this.signinForm.get('remember').value || false;
                this.preloaderService.enableLoading();
                this.authService.loginGGUser(isRemember, token).subscribe(
                    (resp: UserResponseModel) => {
                        this.userService.loadUserOrgList().subscribe(
                            (resp2: ServerResponseModel<Array<UserLoginOrg>>) => {
                                if (resp2.data && resp2.data.length > 0) {
                                    this.switchBusiness(resp2.data).subscribe(
                                        org => {
                                            this.eventService.BroadcastEvent('BUSINESS_CHANGE', org);
                                        }
                                    );
                                } else {
                                    this.ngZone.run(() => this.router.navigate(['/'])).then();
                                }
                            }
                        );
                    },
                    (err) => {
                        this.preloaderService.disableLoading();
                        this.error = err;
                        this.errorModal.show();
                    },
                    () => {
                        this.preloaderService.disableLoading();
                    }
                );
                // YOUR CODE HERE
            }, (error) => {
                // alert(JSON.stringify(error, undefined, 2));
            });
    }

    onFBLogin() {
        FB.login((response) => {
            if (response.authResponse) {
                // login success
                // login success code here
                // redirect to home page
                const token = response.authResponse.accessToken;
                const isRemember = this.signinForm.get('remember').value || false;
                this.preloaderService.enableLoading();
                this.authService.loginFBUser(isRemember, token).subscribe(
                    (resp: UserResponseModel) => {
                        this.userService.loadUserOrgList().subscribe(
                            (resp2: ServerResponseModel<Array<UserLoginOrg>>) => {
                                if (resp2.data && resp2.data.length > 0) {
                                    this.switchBusiness(resp2.data).subscribe(
                                        org => {
                                            this.eventService.BroadcastEvent('BUSINESS_CHANGE', org);
                                        }
                                    );
                                } else {
                                    this.ngZone.run(() => this.router.navigate(['/'])).then();
                                }
                            }
                        );
                    },
                    (err) => {
                        this.ngZone.run(() => this.preloaderService.disableLoading());
                        this.error = err;
                        this.errorModal.show();
                    },
                    () => {
                        this.ngZone.run(() => this.preloaderService.disableLoading());
                    }
                );
            } else {
                // console.log('User login failed');
            }
        });

    }

    onSubmit() {
        this.submitted = true;
        if (this.signinForm.valid) {
            const userLogin = new UserLoginModel;
            userLogin.email = this.signinForm.get('email').value;
            userLogin.password = this.signinForm.get('password').value;
            userLogin.language = this.appState.locale.lang;

            this.preloaderService.enableLoading();
            this.userService.getUserOrgByAuth(userLogin).subscribe(
                (resp: ServerResponseModel<Array<UserLoginOrg>>) => {
                    this.switchBusiness(resp.data).subscribe(
                        org => {
                            userLogin.orgId = org.id;
                            this.authService.loginUser(userLogin, this.signinForm.get('remember').value)
                                .subscribe(
                                    (response: any) => {
                                        this.eventService.BroadcastEvent('BUSINESS_CHANGE', org);
                                    },
                                    (err: any) => {
                                        this.error = err;
                                        this.errorModal.show();
                                        this.preloaderService.disableLoading();
                                    },
                                    () => {
                                        this.preloaderService.disableLoading();
                                        // 'onCompleted' callback.
                                        // No errors, route to new page here
                                    }
                                );
                        }
                    );
                }, err => {
                    this.preloaderService.disableLoading();
                    this.error = err;
                    this.errorModal.show();
                },
                () => {
                    this.preloaderService.disableLoading();
                    this.service.refreshTokenLogin({}).subscribe(result => {
                    });
                }
            );
        }
    }

    switchBusiness(orgList: Array<UserLoginOrg>): Observable<UserLoginOrg> {
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
                orgList: orgList
            }
        });
        return modalRef.content.action;
    }

    handleExpire() {
        this.errorShow = 'Captcha is expired';
    }
}
