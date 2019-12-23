import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {CookieService} from 'ngx-cookie';
import {AppState} from '../../app-state.service';
import {RecoveryService} from '../../services/recovery.service';
import {ModalDirective} from '../../lib/ng-uikit-pro-standard/free/modals';
import {HttpHeaders} from '@angular/common/http';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

    form1: FormGroup;
    form2: FormGroup;
    showNewPass: boolean = false;
    email: any;
    step = 1;
    error: any;
    userToken: string = '';
    check1: boolean = false;
    emailSig: string = null;
    @ViewChild('errorModal') errorModal: ModalDirective;
    @ViewChild('forgotModal') forgotModal: ModalDirective;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private service: UserService,
                private cookieService: CookieService,
                private appState: AppState,
                private recoveryService: RecoveryService
    ) {
        this.createForm();
    }

    ngOnInit() {
        try {
            this.recoveryService.receiveMessage();
        } catch (e) {
        }
    }

    createForm() {
        this.form1 = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9.-]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')])
        });
    }

    nextStep() {
        const _this = this;
        this.email = this.form1.get('email').value;
        const headers = new HttpHeaders();
        headers.append('lang', this.appState.locale.lang);
        this.service.checkRecoverPwd({email: this.email}, headers).subscribe(
            resp => {
                _this.userToken = resp['data'];
                if (_this.check1 === false) {
                    _this.recoveryService.receiveMessage(_this.userToken, _this.check1).subscribe(dataResult => {
                        if (dataResult && dataResult['EmailSig'] && _this.check1 === false) {
                            _this.service.recoverPwd({sig: dataResult['EmailSig']}).subscribe(tada => {
                                if (tada['success'] === true) {
                                    _this.check1 = true;
                                    _this.step = 2;
                                    _this.emailSig = dataResult['EmailSig'];
                                    _this.form2 = new FormGroup({
                                        password: new FormControl('', [Validators.required, Validators.minLength(6)])
                                    });
                                }
                            });
                        }
                    });
                }
                console.log(resp['text']);
                if (resp['text'] === 'Check reset pass Ok') {
                    _this.forgotModal.show();
                }
            },
            err => {
                _this.error = err;
                _this.errorModal.show();
            }
        );
    }

    prevStep() {
        this.step = 1;
        this.check1 = false;
    }

    changePwd() {
        const _this = this;
        const data = {
            emailSig: this.emailSig,
            password: this.form2.get('password').value
        };
        const headers = new HttpHeaders();
        headers.append('lang', this.appState.locale.lang);
        this.service.forgotPassword(data, headers).subscribe(resp => {
            // CHUYEN DEN TRANG LOGIN
            const data2 = {
                email: _this.email,
                password: data.password
            };
            const opt = {expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate())};
            _this.cookieService.put('userInfo', JSON.stringify(data2), opt);
            _this.router.navigate(['/login']);
        });
    }
}
