import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';

import { map, catchError, tap, mapTo, filter, first } from 'rxjs/operators';
import { Observable, throwError, of, Subject } from 'rxjs';
import { UserService } from '../services/user.service';
import { UserLoginModel } from '../models/user-login';
import { ServerResponseModel } from '../models/server-response';
import { UserResponseModel } from '../models/user-response';

@Injectable()
export class AuthService {

  private _userInfo: UserResponseModel;
  requestUserInfoInProgress: boolean;
  pendingUserInfoSubject: Subject<any> = new Subject();

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private userService: UserService
  ) {
    this._parseInfoCookie();
  }

  get user(): UserResponseModel {
    if (!this._userInfo) {
      this._parseInfoCookie();
    }
    return this._userInfo || null;
  }

  get token(): string {
    return this.user && this.user.token;
  }

  set token(token: string) {
    if (this.user) {
      this.user.token = token
      this.cookieService.put('auth', (JSON.stringify(this._userInfo)));
    }
  }

  get refreshToken(): string {
    return this.user && this.user.refreshToken;
  }

  loginUser(user: UserLoginModel, remember: boolean): Observable<UserResponseModel> {
      const _this = this;
    return this.userService.signinUser(user)
      .pipe(
        map((resp: ServerResponseModel<UserResponseModel>) => {
          this._userInfo = resp.data;
          const opt = remember ? { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) } : {};
          this.cookieService.put('auth', JSON.stringify(_this._userInfo), opt);
          this.cookieService.putObject('authOpt', opt, opt);
          console.log(opt);
          return resp.data;
        })
      );
  }

  loginGGUser(remember: boolean, token: string): Observable<UserResponseModel> {
    return this.userService.signinGGUser(token).pipe(
      map(
        (resp: ServerResponseModel<UserResponseModel>) => {
          this._userInfo = resp.data;
          const opt = remember ? { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) } : {};
          this.cookieService.put('auth', JSON.stringify(this._userInfo), opt);
          this.cookieService.putObject('authOpt', opt, opt);
          return resp.data;
        }
      )
    );
  }

  loginFBUser(remember: boolean, token: string): Observable<UserResponseModel> {
    return this.userService.signinFBUser(token).pipe(
      map(
        (resp: ServerResponseModel<UserResponseModel>) => {
          this._userInfo = resp.data;
          const opt = remember ? { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) } : {};
          this.cookieService.put('auth', JSON.stringify(this._userInfo), opt);
          return resp.data;
        }
      )
    );
  }

  changeOrg(orgId: string): Observable<UserResponseModel> {
    return this.userService.changeOrg(orgId).pipe(
      map(
        (resp: ServerResponseModel<UserResponseModel>) => {
          this._userInfo = resp.data;
          const opt = this.cookieService.getObject('authOpt');
          this.cookieService.put('auth', JSON.stringify(this._userInfo), opt);
          return resp.data;
        }
      )
    );
  }

  refreshTokenLogin() {
    if (!this.user) {
      this._parseInfoCookie();
    }
    return this.userService.refreshToken(this.refreshToken)
      .pipe(
        map((resp: ServerResponseModel<string>) => {
          if (resp.success) {
            this.token = resp.data;
          }

          return resp.data;
        })
      );
  }

  logout() {
    this._userInfo = null;
    this.cookieService.remove('auth');
    this.cookieService.remove('authOpt');
    this.router.navigate(['login']);
  }

  getUsername() {
    return this.user && this.user.userName;
  }

  hasRole(role: number): boolean {
    if (!this._userInfo) {
      this._parseInfoCookie();
    }
    return (this._userInfo && this._userInfo.role === role);
  }

  isAuthenticated(): boolean {
    return this.token ? true : false;
  }

  private _parseInfoCookie(): boolean {
    // this._currentToken = this.cookieService.get('auth');
    // this.username = this.cookieService.get('username');
    const tokenStr = this.cookieService.get('auth');

    if (tokenStr) {
      // Decode token
      const jsonToken = JSON.parse(tokenStr);
      this._userInfo = jsonToken;
      return true;
    } else {
      return false;
    }
  }
}
