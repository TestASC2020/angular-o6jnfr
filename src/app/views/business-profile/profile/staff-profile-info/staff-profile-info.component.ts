import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../../services/user.service';
import {BusinessService} from '../../../../services/business.service';
import {CookieService} from 'ngx-cookie';

@Component({
    selector: 'app-staff-profile-info',
    templateUrl: './staff-profile-info.component.html',
    styleUrls: ['./staff-profile-info.component.scss']
})
export class StaffProfileInfoComponent implements OnInit {
    staffProfile: any;

    constructor(private service: UserService,
                private businessService: BusinessService,
                private cookieService: CookieService) {
    }

    ngOnInit() {
        if (this.cookieService.get('staffSigInfo')) {
            const staffSigInfo = JSON.parse(this.cookieService.get('staffSigInfo'));
            this.businessService.loadOrgStaffProfile({staffSig: staffSigInfo.staffSig}).subscribe(resp => {
                this.staffProfile = resp['data'];
                if (!this.staffProfile.firstName) {
                    const name = (this.staffProfile['name']) ? this.staffProfile['name'] : '';
                    if (name === '') {
                        this.staffProfile['firstName'] = '';
                        this.staffProfile['lastName'] = '';
                    } else if (name.indexOf(' ') < 0) {
                        this.staffProfile['firstName'] = name.trim();
                        this.staffProfile['lastName'] = '';
                    } else {
                        this.staffProfile['firstName'] = name.split(' ').slice(0, -1).join(' ').trim();
                        this.staffProfile['lastName'] = name.split(' ').slice(-1).join(' ').trim();
                    }
                }
            });
        }
    }
}