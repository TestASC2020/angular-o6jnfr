import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {HttpService} from 'src/app/shared/http/service/http.service';
import {UserLoginModel} from '../models/user-login';
import 'rxjs/add/operator/map';
import {HttpHeaders} from '@angular/common/http';

@Injectable()
export class UserService {

    constructor(private http: HttpService) { }

    signinUser(user: UserLoginModel): Observable<any> {
        return this.http.post(environment.serverUrl + 'User/Login', user);
    }

    signinGGUser(token: string): Observable<any> {
        return this.http.post(environment.serverUrl + 'User/LoginByGP', { token });
    }

    signinFBUser(token: string) {
        return this.http.post(environment.serverUrl + 'User/LoginByFB', { token });
    }

    refreshToken(refreshToken: string) {
        return this.http.post(environment.serverUrl + 'User/RefreshTokenLogin', {
            'refreshToken': refreshToken
        });
    }

    getUserOrgByAuth(user: UserLoginModel): Observable<any> {
        return this.http.post(environment.serverUrl + 'User/GetUserOrgByAuth', user);
    }

    loadUserOrgList(lang?: number) {
        lang = lang || 0;
        return this.http.post(environment.serverUrl + 'User/LoadUserOrgList', { lang });
    }

    changeOrg(orgId: string): Observable<any> {
        return this.http.post(environment.serverUrl + 'User/ChangeOrg', { orgId });
    }


    changePassword(data, headers?: HttpHeaders): Observable<any> {
        if (headers) {
            return this.http.post(environment.serverUrl + 'User/ChangePassword', data, {headers: headers});
        }
        return this.http.post(environment.serverUrl + 'User/ChangePassword', data);
    }

    forgotPassword(data, headers?: HttpHeaders): Observable<any> {
        return this.http.post(environment.serverUrl + 'User/ForgotPassword', data, {headers: headers});
    }

    recoverPwd(data): Observable<any> {
        const query = [];
        Object.keys(data).forEach(key => {
           query.push(key + '=' + data[key]);
        });
        return this.http.get(environment.serverUrl + 'User/RecoverPwd?' + query.join('&'));
    }

    checkRecoverPwd(data, headers?: HttpHeaders): Observable<any> {
        return this.http.post(environment.serverUrl + 'User/CheckRecoverPwd', data, {headers: headers});
    }

    resendMail(data, headers?: HttpHeaders): Observable<any> {
        return this.http.post(environment.serverUrl + 'User/ResendMail', data, {headers: headers});
    }

    signUp(data, headers?: HttpHeaders) {
        return this.http.post(environment.serverUrl + 'User/SignUp', data, {headers: headers});
    }

    getServiceTermUrl(data) {
        return this.http.get(environment.serverUrl + 'Master/GetServiceTermUrl');
    }

    // verify password recovery
    verifyPwdRecoveryCode(email: string): Observable<any> {
        return this.http.post(environment.serverUrl + 'User/VerifyPwdRecoveryCode', { email });
    }

    loadUserProfile(): Observable<any> {
        return this.http.post(environment.serverUrl + 'User/LoadUserProfile', { });
    }

    // Update User basic information
    updateUser(data) {
        return this.http.post(environment.serverUrl + 'User/UpdateUser', data);
    }

    // add User Experience with id
    addUserExperience(data) {
        return this.http.post(environment.serverUrl + 'User/AddUserExperience', data);
    }

    // update User Experience with id
    updateUserExperience(data) {
        return this.http.post(environment.serverUrl + 'User/UpdateUserExperience', data);
    }

    // remove User Experience with id
    removeUserExperience(data) {
        return this.http.post(environment.serverUrl + 'User/RemoveUserExperience', data);
    }

    // add User Specialty with id
    addUserSpecialty(data) {
        return this.http.post(environment.serverUrl + 'User/AddUserSpecialty', data);
    }

    // update User Specialty with id
    updateUserSpecialty(data) {
        return this.http.post(environment.serverUrl + 'User/UpdateUserSpecialty', data);
    }

    // remove User Specialty with id
    removeUserSpecialty(data) {
        return this.http.post(environment.serverUrl + 'User/RemoveUserSpecialty', data);
    }

    uploadAvatar(data: any, lang?: number) {
        lang = lang || 0;
        return this.http.post(environment.serverUrl + 'User/UploadAvatar', { data, lang });
    }

    uploadOrgLogo(data) {
        return this.http.post(environment.serverUrl + 'Org/UploadOrgLogo', data);
    }

    loadListOrg() {
        return this.http.post(environment.serverUrl + 'User/AddUserOrg', {});
    }

    // load list of countries
    loadCountriesList(): Observable<any> {
        return this.http.post(environment.serverUrl + 'Master/LoadListCountries', {pageSz: 1000});
    }

    // LoadCountryRegion
    loadCountryRegion(countryCode: string): Observable<any> {
        return this.http.post(environment.serverUrl + 'Master/LoadCountryRegion', {pageSz: 1000, countries: [countryCode]});
    }

    // load list of city of country
    loadCitiesList(countryCode: string, regionCode: string): Observable<any> {
        return this.http.post(environment.serverUrl + 'Master/LoadCity', {pageSz: 1000, countries: [countryCode], regions: [regionCode]});
    }

    refreshTokenLogin(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'User/RefreshTokenLogin', data);
    }

    loadStaffType(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'User/LoadStaffType', data);
    }

    sendOrgInvite(data, headers: HttpHeaders): Observable<any> {
        return this.http.post(environment.serverUrl + 'Org/SendOrgInvite', data, {headers: headers});
    }

    loadUserList(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'User/LoadUserList', data);
    }
}
