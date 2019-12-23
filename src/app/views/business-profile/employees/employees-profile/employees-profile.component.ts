import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PagerService} from '../../../../services/pager.service';
import {BusinessService} from '../../../../services/business.service';
import {CookieService} from 'ngx-cookie';

@Component({
  selector: 'app-business-profile-employees-profile',
  templateUrl: './employees-profile.component.html',
  styleUrls: ['./employees-profile.component.scss']
})
export class EmployeesProfileComponent  implements OnInit {
  employeeProfile: any;
  chatAble: boolean = true;

  constructor(private router: Router,
              private cookieService: CookieService,
              private route: ActivatedRoute,
              private pagerService: PagerService,
              private service: BusinessService) {
  }

  ngOnInit() {
      if (this.cookieService.get('employeeProfile')) {
          const temp = JSON.parse(this.cookieService.get('employeeProfile'));
          this.service.loadOrgStaffProfile({staffSig: (temp.staffSig) ? temp.staffSig : temp.signature}).subscribe(result => {
              this.employeeProfile = result['data'];
              if (this.cookieService.get('auth')) {
                  const user = JSON.parse(this.cookieService.get('auth'));
                  if (user.email === this.employeeProfile.email) {
                      this.chatAble = false;
                  }
              }
          });
      }
  }

  chatWith() {
      const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
      this.cookieService.put('chatWith', JSON.stringify({userId: this.employeeProfile.id}), opt);
      this.router.navigate(['message']);
  }
}
