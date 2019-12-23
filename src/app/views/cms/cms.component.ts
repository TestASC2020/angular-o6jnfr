import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { ORG_TYPE } from 'src/app/models/org-type.enum';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-cms',
  templateUrl: './cms.component.html',
  styleUrls: ['./cms.component.scss']
})
export class CmsComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private translate: TranslateService,
    private cookieService: CookieService) {
    const userLogin = this.authService.user;
      switch (userLogin.orgType) {
      case ORG_TYPE.BUSINESS:
        this.router.navigate(['creator'], { relativeTo: this.route });
        break;
      case ORG_TYPE.VENDOR:
        this.router.navigate(['vendor'], { relativeTo: this.route });
        break;
      default:
        this.router.navigate(['/']);
    }
  }

  ngOnInit() {
  }

}
