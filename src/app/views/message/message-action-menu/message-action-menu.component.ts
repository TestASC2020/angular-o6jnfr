import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';

@Component({
    selector: 'app-message-action-menu',
    templateUrl: './message-action-menu.component.html',
    styleUrls: ['./message-action-menu.component.scss']
})
export class MessageActionMenuComponent implements OnInit, OnDestroy {
    @Input() item: any;
    @Output() findContact: EventEmitter<any> = new EventEmitter<any>();
    @Output() createGroup: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('popContent') popContent: any;

    constructor(private router: Router,
                private cookieService: CookieService) { }

    ngOnInit() {
    }

    create(item) {
        this.createGroup.emit(item);
        this.popContent.hide();
    }
    find(item) {
        this.findContact.emit(item);
        this.popContent.hide();
    }

    gotoHomePage() {
        this.router.navigate(['cms']);
    }

    ngOnDestroy() {
        this.createGroup.complete();
        this.findContact.complete();
    }
}
