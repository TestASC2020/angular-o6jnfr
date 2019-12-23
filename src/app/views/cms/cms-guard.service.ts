import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie';

@Injectable()
export class CmsGuard implements CanActivate {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const orgId = this.cookieService.get('org');
    if (orgId) {
      return true;
    } else {
      this.router.navigate(['./']);
      return false;
    }
  }
}