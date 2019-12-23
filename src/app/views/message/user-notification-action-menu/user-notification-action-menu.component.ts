import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';

@Component({
    selector: 'app-user-notification-chat-action-menu',
    templateUrl: './user-notification-action-menu.component.html',
    styleUrls: ['./user-notification-action-menu.component.scss']
})
export class UserNotificationActionMenuComponent implements OnInit, OnDestroy {
    @Input() item: any;
    @Output() followEmitter: EventEmitter<any> = new EventEmitter<any>();
    @Output() unFollowEmitter: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('popContent') popContent: any;
    constructor() { }

    ngOnInit() {
    }
    follow(item) {
        this.followEmitter.emit(item);
        this.popContent.hide();
    }
    unFollow(item) {
        this.unFollowEmitter.emit(item);
        this.popContent.hide();
    }
    ngOnDestroy() {
        this.followEmitter.complete();
        this.unFollowEmitter.complete();
    }
}
