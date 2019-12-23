import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-permission-deny',
  templateUrl: './permission-deny.component.html',
  styleUrls: ['./permission-deny.component.scss']
})
export class PermissionDenyComponent implements OnInit {
  errorStr: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
  }

  gotoHome() {
    this.router.navigate(['/']);
  }

  logout() {
    this.authService.logout();
  }
}
