import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';

@Component({
    selector: 'app-action-menu-employees',
    templateUrl: './action-menu.component.html',
    styleUrls: ['./action-menu.component.scss']
})
export class ActionMenuComponent implements OnInit, OnDestroy {
    @Input() item: any;
    @Output() delete: EventEmitter<any> = new EventEmitter<any>();
    @Output() status: EventEmitter<any> = new EventEmitter<any>();
    @Output() role: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('popContent') popContent: any;
    userProfile: any;

    constructor(private router: Router,
                private cookieService: CookieService) { }

    ngOnInit() {
        if (this.cookieService.get('auth')) {
            this.userProfile = JSON.parse(this.cookieService.get('auth'));
        }
    }

    viewFeedback(item) {
        const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
        this.cookieService.put('employee', JSON.stringify(item), opt);
        this.router.navigate(['business-profile/employees/employees-feedback']);
    }

    chat(item) {
        const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
        this.cookieService.put('chatWith', JSON.stringify({userId: item.id}), opt);
        this.router.navigate(['message']);
    }
    listcourse(item) {
        const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
        this.cookieService.put('employeeProfile', JSON.stringify(item), opt);
        this.router.navigate(['business-profile/employees/employees-list-courses']);
    }
    viewProfile(item) {
        const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
        this.cookieService.put('employeeProfile', JSON.stringify(item), opt);
        this.router.navigate(['business-profile/employees/employees-profile']);
    }
    viewRole(item) {
        this.role.emit(item);
        this.popContent.hide();
    }
    setStatus(item) {
        this.status.emit(item);
        this.popContent.hide();
    }

    ngOnDestroy() {
        this.delete.complete();
        this.status.complete();
    }

    remove(item) {
        this.delete.emit(item);
        this.popContent.hide();
    }
}
