import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PagerService} from '../../../services/pager.service';
import {BusinessService} from '../../../services/business.service';
import {ToastService} from '../../../lib/ng-uikit-pro-standard/pro/alerts';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-business-profile-employees',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent  implements OnInit {
    settings: any;
    lastSettings: any;
    constructor(private router: Router,
                private route: ActivatedRoute,
                private pagerService: PagerService,
                private toastrService: ToastService,
                private translate: TranslateService,
                private service: BusinessService) {
    }

    ngOnInit() {
        this.service.loadOrgSetting({}).subscribe(result => {
            const temp = result['data'];
            this.settings = {
                maxDayToLearn: (temp['maxDayToLearn']) ? temp['maxDayToLearn'] : '',
                minPayment: (temp['minPayment']) ? temp['minPayment'] : '',
                blkCost: (temp['blkCost']) ? temp['blkCost'] : '',
                allowSendMsg: (temp['allowSendMsg']) ? temp['allowSendMsg'] : '',
                showFeedback: (temp['showFeedback']) ? temp['showFeedback'] : ''
            };
            this.copySettings();
        });

    }

    copySettings(): void {
        this.lastSettings = {
            maxDayToLearn: this.settings.maxDayToLearn,
            minPayment: this.settings.minPayment,
            blkCost: this.settings.blkCost,
            allowSendMsg: this.settings.allowSendMsg,
            showFeedback: this.settings.showFeedback
        };
    }

    changeAllowSendMsg($event) {
        this.settings.allowSendMsg = $event.target.checked;
    }

    changeShowFeedback($event) {
        this.settings.showFeedback = $event.target.checked;
    }

    saveSettings() {
        this.settings.blkCost = JSON.parse(this.settings.blkCost);
        this.settings.maxDayToLearn = JSON.parse(this.settings.maxDayToLearn);
        this.settings.minPayment = JSON.parse(this.settings.minPayment);
        this.settings.showFeedback = (this.settings.showFeedback !== '') ? this.settings.showFeedback : false;
        this.settings.allowSendMsg = (this.settings.allowSendMsg !== '') ? this.settings.allowSendMsg : false;
        this.toastrService.clear();
        const notifNeigbourId = '#notif-neigbour';
        this.service.updateOrgSettings(this.settings).subscribe(
            result => {
                this.copySettings();
                const message = 'MESSAGE.NameList.UpdateSettingsSuccess';
                this.translate.get(message).subscribe(
                    text => {
                        this.toastrService.success(text);
                        const elem = document.querySelector(notifNeigbourId).getBoundingClientRect();
                        (document.querySelector('#toast-container') as HTMLElement).style.top = elem.top + 'px';
                        (document.querySelector('#toast-container') as HTMLElement).style.left = (elem.left + elem.width + 10) + 'px';
                    }
                );
            },
            err => {
                const message = 'MESSAGE.NameList.UpdateSettingsFailed';
                const error = 'MESSAGE.NameList.NothingChanged';
                this.translate.get(error).subscribe(
                    text1 => {
                        this.translate.get(message, {error: text1}).subscribe(
                            text2 => {
                                this.toastrService.error(text2);
                                const elem = document.querySelector(notifNeigbourId).getBoundingClientRect();
                                (document.querySelector('#toast-container') as HTMLElement).style.top = elem.top + 'px';
                                (document.querySelector('#toast-container') as HTMLElement).style.left = (elem.left + elem.width + 10) + 'px';
                            }
                        );
                    }
                );
            }
        );
    }

    restoreSettings() {
        this.settings = {
            maxDayToLearn: this.lastSettings.maxDayToLearn,
            minPayment: this.lastSettings.minPayment,
            blkCost: this.lastSettings.blkCost,
            allowSendMsg: this.lastSettings.allowSendMsg,
            showFeedback: this.lastSettings.showFeedback
        };
    }
}