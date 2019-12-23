import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ModalDirective } from '../../../lib/ng-uikit-pro-standard/free/modals';
import { HttpHeaders } from '@angular/common/http';
import { AppState } from '../../../app-state.service';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-profile-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
    showPass: boolean = false;
    showNewPass: boolean = false;
    showConfirmNewPass: boolean = false;
    oldPwd: string = '';
    newPwd: string = '';
    confirmNewPwd: string = '';
    error: any;
    success: any;
    @ViewChild('confirmModal') confirmModal: ModalDirective;
    @ViewChild('errorModal') errorModal: ModalDirective;
    @ViewChild('passwordNotMatchedModal') passwordNotMatchedModal: ModalDirective;

    constructor(private service: UserService,
        private translate: TranslateService,
        private appState: AppState) {
    }

    ngOnInit() {
    }

    onSubmit() {
        if (this._validatePassForm()) {
            this.confirmModal.show();
        }
    }

    changePasswordNow() {
        if (this._validatePassForm()) {
            const data = {
                oldPwd: this.oldPwd,
                newPwd: this.newPwd
            };
            const headers = new HttpHeaders();
            headers.append('lang', this.appState.locale.lang);
            this.service.changePassword(data, headers).subscribe(
                result => {
                    if (result['success'] === true) {
                        this.success = result['text'];
                        this.confirmModal.hide();
                    } else {
                        this.error = result;
                        this.confirmModal.hide();
                        this.errorModal.show();
                    }
                },
                err => {
                    this.error = err;
                    this.confirmModal.hide();
                    this.errorModal.show();
                }
            );
        }
    }

    private _validatePassForm(): boolean {
        if (!this.oldPwd) {
            this.translate.get('MESSAGE.InvalidOldPassword').subscribe(translatedText => {
                this.error = {
                    text: translatedText
                };
                this.passwordNotMatchedModal.show();
            });
            return false;
        }

        if (!this.newPwd || !this.confirmNewPwd) {
            this.translate.get('MESSAGE.InvalidNewPassword').subscribe(translatedText => {
                this.error = {
                    text: translatedText
                };
                this.passwordNotMatchedModal.show();
            });
            return false;
        }

        if (this.newPwd !== this.confirmNewPwd) {
            this.translate.get('MESSAGE.ACTION_FAILED').subscribe(translatedText => {
                this.error = {
                    text: translatedText
                };
                this.passwordNotMatchedModal.show();
            });
            return false;
        }

        return true;
    }
}
