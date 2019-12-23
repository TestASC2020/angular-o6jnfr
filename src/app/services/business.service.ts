import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import {environment} from '../../environments/environment';
import {HttpService} from 'src/app/shared/http/service/http.service';

@Injectable()
export class BusinessService {
    public static items: Array<any> = new Array<any>();
    constructor(private http: HttpService) {
    }

    // load list of partners
    getPartnersList(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Org/LoadOrgPartnerList', data);
    }

    loadOrgProfile(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Org/LoadOrgProfile', data);
    }

    updateUserOrgStatus(data): Observable<any> {
        // data: {staffSig: string, status: integer}
        return this.http.post(environment.serverUrl + 'User/UpdateUserOrgStatus', data);
    }

    loadUserOrgStatus(data): Observable<any> {
        // data: {staffSig: string, status: integer}
        return this.http.post(environment.serverUrl + 'User/LoadUserOrgStatus', data);
    }

    uploadOrgPartnerLogo(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Org/UploadOrgPartnerLogo', data);
    }
    // Employees list
    loadStaffType(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'User/LoadStaffType', data);
    }
    // Employees list
    loadOrgStaffList(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Org/LoadOrgStaffList', data);
    }

    loadOrgProfileStaffList(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Org/LoadOrgProfileStaffList', data);
    }

    removeOrgProfileStaff(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Org/RemoveOrgProfileStaff', data);
    }

    updateOrgProfileStaff(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Org/UpdateOrgProfileStaff', data);
    }

    loadOrgStaffProfile(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Org/LoadOrgStaffProfile', data);
    }

    // Category list
    loadCategoryList(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Master/LoadCategoryList', data);
    }

    // add org category
    addOrgCategory(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Org/AddOrgCategory', data);
    }

    // update about
    updateOrgAbout(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Org/UpdateOrgAbout', data);
    }

    // update profile info
    updateOrgProfileInfo(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Org/UpdateOrgProfileInfo', data);
    }

    // remove org category
    removeOrgCategory(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Org/RemoveOrgCategory', data);
    }

    // load course list
    loadOrgStaffCourses(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Org/LoadOrgStaffCourses', data);
    }

    // load course list of a given staffId
    loadCrsList(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Lms/LoadCrsList', data);
    }

    // load feedback
    loadStaffCrsFeedback(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Lms/LoadStaffCrsFeedback', data);
    }
    // loadCvList(data): Observable<any> {
    //     data.pageSz = 32767;
    //     return this.http.post(environment.serverUrl + 'Cms/LoadCvList', data);
    // }
    // Load UserOrgRole
    loadUserOrgRole(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'User/LoadUserOrgRole', data);
    }

    // update UserOrgRole
    updateUserOrgRole(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'User/UpdateUserOrgRole', data);
    }

    // Load settings
    loadOrgSetting(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Org/LoadOrgSetting', data);
    }

    // Upload settings
    updateOrgSettings(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Org/UpdateOrgSettings', data);
    }

    loadOrgPartner(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Org/LoadOrgPartner', data);
    }

    updateOrgPartner(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Org/UpdateOrgPartner', data);
    }

    addOrgPartner(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Org/AddOrgPartner', data);
    }

    removeOrgPartner(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Org/RemoveOrgPartner', data);
    }

    create(partner: any): Observable<any> {
        partner.id = BusinessService.items.length;
        BusinessService.items.push(partner);
        return Observable.create(observer => {
            setTimeout(() => {
                observer.next({});
                observer.complete();
            }, 0);
        });
    }

    update(partner: any): Observable<any> {
        const item =  BusinessService.items[BusinessService.items.map(it => it.id).indexOf(partner.id)];
        item.businessName = partner.businessName;
        item.line1 = partner.line1;
        item.line2 = partner.line2;
        item.country = partner.country;
        item.city = partner.city;
        item.region = partner.region;
        item.phone = partner.phone;
        item.hotline = partner.hotline;
        item.email = partner.email;
        item.about = partner.about;
        item.logo = partner.logo;
        return Observable.create(observer => {
            setTimeout(() => {
                observer.next({});
                observer.complete();
            }, 0);
        });
    }

    delete(partnerId: string): Observable<any> {
        const indx = BusinessService.items.map(it => it.scriptCode).indexOf(partnerId);
        BusinessService.items.splice(indx, 1);
        return Observable.create(observer => {
            setTimeout(() => {
                observer.next({});
                observer.complete();
            }, 0);
        });
    }
    removeUserOrg(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'User/RemoveUserOrg', data);
    }
}
