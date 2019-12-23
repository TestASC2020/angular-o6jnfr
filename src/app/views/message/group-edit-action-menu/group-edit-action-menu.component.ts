import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';

@Component({
    selector: 'app-message-group-edit-action-menu',
    templateUrl: './group-edit-action-menu.component.html',
    styleUrls: ['./group-edit-action-menu.component.scss']
})
export class GroupEditActionMenuComponent implements OnInit, OnDestroy {
    @ViewChild('popContent') popContent: any;
    @Input() item: any;
    @Output() removeAdminEmitter: EventEmitter<any> = new EventEmitter<any>();
    @Output() setAdminEmitter: EventEmitter<any> = new EventEmitter<any>();
    @Output() banEmitter: EventEmitter<any> = new EventEmitter<any>();
    @Output() unBanEmitter: EventEmitter<any> = new EventEmitter<any>();
    @Output() removeMemberEmitter: EventEmitter<any> = new EventEmitter<any>();

    constructor() { }

    ngOnInit() {
    }

    removeAdmin() {
        this.removeAdminEmitter.emit(this.item);
        this.popContent.hide();
    }

    setAdmin() {
        this.setAdminEmitter.emit(this.item);
        this.popContent.hide();
    }

    confirmBan(item) {
        this.banEmitter.emit(item);
        this.popContent.hide();
    }
    confirmUnBan(item) {
        this.unBanEmitter.emit(item);
        this.popContent.hide();
    }

    removeMember() {
        this.removeMemberEmitter.emit(this.item);
        this.popContent.hide();
    }

    ngOnDestroy() {
        this.removeAdminEmitter.complete();
        this.setAdminEmitter.complete();
        this.removeMemberEmitter.complete();
        this.banEmitter.complete();
        this.unBanEmitter.complete();
    }
}