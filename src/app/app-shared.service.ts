import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { filter, map, first, catchError } from 'rxjs/operators';
import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { UserService } from './services/user.service';
import { UserProfile } from './models/user-profile';
import { ServerResponseModel } from './models/server-response';
import { AuthService } from './auth/auth.service';

@Injectable()
export class AppSharedService implements OnDestroy {

  userProfileChange: Subject<UserProfile> = new Subject();

  private _userProfile: UserProfile;
  private _requestLstProfileInProgress: boolean;
  private _pendingClientsSubject: Subject<any> = new Subject();

  constructor(private userService: UserService, private authService: AuthService) {
    this.requestProfile();
  }

  requestProfile() {
    this._userProfile = null;
    return this.getUserProfile().subscribe();
  }

  getUserProfile(): Observable<UserProfile> {
    if (!this.authService.isAuthenticated()) {
      return of(null);
    }

    if (this._userProfile) {
      return of(this._userProfile);
    }

    if (this._requestLstProfileInProgress) {
      return this._pendingClientsSubject.pipe(
        filter(profile => profile !== null),
        first(),
        map(profile => profile)
      );
    }

    this._requestLstProfileInProgress = true;
    this._pendingClientsSubject.next(null);
    return this.userService.loadUserProfile().pipe(
      map(
        (resp: ServerResponseModel<UserProfile>) => {
          this._userProfile = resp.data;
          this._pendingClientsSubject.next(this._userProfile);
          this._requestLstProfileInProgress = false;
          this.userProfileChange.next(this._userProfile);
          return this._userProfile;
        }),
      catchError(
        err => {
          return of(null);
        })
    );
  }

  reset() {
    this._userProfile = null;
  }

  ngOnDestroy() {
    this.userProfileChange.complete();
  }
}