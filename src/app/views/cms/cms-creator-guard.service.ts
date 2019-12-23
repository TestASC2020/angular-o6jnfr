import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie';
import { AuthService } from 'src/app/auth/auth.service';
import { ORG_TYPE } from 'src/app/models/org-type.enum';

@Injectable()
export class CmsCreatorGuard implements CanActivate {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService,
    private authService: AuthService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const canActive = this.authService.user && this.authService.user.orgType === ORG_TYPE.BUSINESS;
    if (!canActive) {
      this.router.navigate(['./']);
    }
    return canActive;
  }
}
