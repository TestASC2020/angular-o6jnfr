import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AppState } from 'src/app/app-state.service';

@Injectable({
  providedIn: 'root'
})
export class AppHttpInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  // Refresh Token Subject tracks the current token, or is null if no token is currently
  // available (e.g. refresh pending).
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(private authService: AuthService, private router: Router, private appState: AppState) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = null;
    const token = this.authService.token;
    const lang = this.appState.locale ? this.appState.locale.lang : 0;
    if (token) {

      const header = req.headers.set('Authorization', 'bearer ' + token)
        .set('lang', lang);
      authReq = req.clone({ headers: header });
    } else {
      const header = req.headers.set('lang', lang);
      authReq = req.clone({ headers: header });
    }
    // Clone the request to add the new header.
    // send the newly created request
    return next.handle(authReq).pipe(
      catchError(
        err => {
          if (req.url.includes('User/RefreshTokenLogin')) {
            if (this.router.url.includes('/login')) {
              this.handleHttpError(err);
            }

            this.authService.logout();
          }
          // If error status is different than 401 we want to skip refresh token
          // So we check that and throw the error if it's the case
          if ([401, 403].indexOf(err.status) < 0) {
            return this.handleHttpError(err);
          }

          if (this.refreshTokenInProgress) {
            // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
            // – which means the new token is ready and we can retry the request again
            return this.refreshTokenSubject
              .pipe(
                filter(result => result !== null),
                take(1),
                switchMap(() => next.handle(this.addAuthenticationToken(req)))
              )
          } else {
            this.refreshTokenInProgress = true;
            // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
            this.refreshTokenSubject.next(null);

            // Call auth.refreshAccessToken(this is an Observable that will be returned)
            return this.authService.refreshTokenLogin().pipe(
              switchMap((token: any) => {
                //When the call to refreshToken completes we reset the refreshTokenInProgress to false
                // for the next time the token needs to be refreshed
                this.refreshTokenInProgress = false;
                this.refreshTokenSubject.next(token);

                return next.handle(this.addAuthenticationToken(req));
              }),
              catchError((err: any) => {
                this.refreshTokenInProgress = false;

                this.authService.logout();
                return this.handleHttpError(err);
              })
            )
          }

        }
      )
    );
  }

  addAuthenticationToken(request) {
    // Get access token from Local Storage
    const accessToken = this.authService.token;
    const lang = this.appState.locale ? this.appState.locale.lang : 0;

    // If access token is null this means that user is not logged in
    // And we return the original request
    if (!accessToken) {
      return request.clone({
        setHeaders: {
          lang: lang
        }
      });
    }

    // We clone the request, because the original request is immutable
    return request.clone({
      setHeaders: {
        lang: lang,
        Authorization: 'bearer ' + accessToken
      }
    });
  }

  /**
   * Handle http errors
   * `caught`, which is the source observable, in case you'd like to 'retry' that observable by returning it again.
   * Whatever observable
   *  is returned by the `selector` will be used to continue the observable chain.
   *
   * @private
   * @param {(Response | any)} error
   * @param {Observable} caught
   * @returns {Observable<any>}
   * @memberof HttpService
   */
  private handleHttpError(error: HttpErrorResponse | any, caught?: Observable<any>): Observable<any> {
    if (error.status === 401) {
      this.authService.logout();
    }
    if (error instanceof HttpErrorResponse) {
      return throwError(error.error || error);
    } else {
      return throwError(error);
    }
  }
}
