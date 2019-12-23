import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {RegisterService} from '../../services/register.service';
import {UserService} from '../../services/user.service';
import {CookieService} from 'ngx-cookie';
import {ModalDirective} from '../../lib/ng-uikit-pro-standard/free/modals';
import {HttpHeaders} from '@angular/common/http';
import {AppState} from '../../app-state.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {ToastService} from '../../lib/ng-uikit-pro-standard/pro/alerts';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    showPass: boolean = false;
    signupForm: FormGroup;
    userToken: string = '';
    message: any;
    error: any;
    success: any;
    policyContent: string = '';
    public Editor = ClassicEditor;
    @ViewChild('errorModal') errorModal: ModalDirective;
    @ViewChild('policyModal') policyModal: ModalDirective;
    submitted: boolean = false;
    configs: any = {
        toolbar: []
    };
    constructor(private router: Router,
                private route: ActivatedRoute,
                private service: UserService,
                private translate: TranslateService,
                private cookieService: CookieService,
                private toastervice: ToastService,
                private appState: AppState,
                private registerService: RegisterService) {
        this.cookieService.remove('userInfo');
        this.createForm();
    }

    ngOnInit() {
        try {
            this.registerService.getPermission();
            this.registerService.receiveMessage();
            this.message = this.registerService.currentMessage;
        } catch (e) {
        }
    }

    createForm() {
        this.signupForm = new FormGroup({
            firstName: new FormControl('', Validators.required),
            lastName: new FormControl('', Validators.required),
            email: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9.-]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')]),
            password: new FormControl('', [Validators.required, Validators.minLength(8)]),
            remember: new FormControl(false)
        });
    }

    get JSON() {
      return JSON;
    }

    onSubmit() {
      this.submitted = true;
        if (this.signupForm.valid && this.signupForm.get('remember').value &&
            JSON.parse(this.signupForm.get('remember').value.toString()) === true) {
            const data = {
                email: this.signupForm.get('email').value,
                firstName: this.signupForm.get('firstName').value,
                lastName: this.signupForm.get('lastName').value,
                password: this.signupForm.get('password').value
            };
            const headers = new HttpHeaders();
            this.toastervice.clear();
            headers.append('lang', this.appState.locale.lang);
            this.service.signUp(data, headers).subscribe(
                resp => {
                    this.translate.get('MESSAGE.RegisterAccountSuccess').subscribe(text => {
                        this.toastervice.success(text);
                        this.userToken = resp['data']['userToken'];
                        // CHUYEN DEN TRANG LOGIN
                        this.router.navigate(['/login']);
                    });
                },
                err => {
                    this.translate.get('MESSAGE.RegisterAccountFailed', {error: err.text}).subscribe(text => {
                        this.toastervice.error(text);
                        this.error = err;
                        this.errorModal.show();
                    });
                }
            );
        }
    }

    gotoSigninForm() {
        this.router.navigate(['/login']);
    }

    getServiceTermUrl() {
        const _this = this;
        this.service.getServiceTermUrl({}).subscribe(resp => {
            _this.loadFile(resp['data']);
        });
    }

    loadFile(filePath) {
        const _this = this;
        if (filePath) {
            const xmlhttp = new XMLHttpRequest();
            xmlhttp.open('GET', 'https://cors-anywhere.herokuapp.com/' + filePath, false);
            xmlhttp.send();
            if (xmlhttp.status === 200) {
                const htmlElm = document.createElement('div');
                htmlElm.innerHTML = xmlhttp.responseText;
                if (htmlElm.querySelectorAll('a').length > 0) {
                    htmlElm.querySelectorAll('a').forEach(link => {
                        link.remove();
                    });
                }
                const h1 = htmlElm.querySelector('div.mobile-center').querySelector('h1');
                h1.setAttribute('class', 'my-text-center');
                htmlElm.querySelector('div.mobile-center').innerHTML = '';
                htmlElm.querySelector('div.mobile-center').appendChild(h1);
                htmlElm.querySelector('div.mobile-center').setAttribute('class', '');
                const content = htmlElm.querySelector('div.jsx-653440045.container');
                _this.policyContent = '<div class="policy-list scroll scrollbar-cyan text-justify">' + content.innerHTML + '</div>';
                _this.policyModal.show();
            }
        }
    }
}
