import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-business-profile-partner-action-menu',
    templateUrl: './partner-action-menu.component.html',
    styleUrls: ['./partner-action-menu.component.scss']
})
export class PartnerActionMenuComponent implements OnInit, OnDestroy {
    @Input() item: any;
    @Output() removeItem: EventEmitter<number> = new EventEmitter<number>();
    @Output() editItem: EventEmitter<number> = new EventEmitter<number>();

    constructor() { }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.editItem.complete();
        this.removeItem.complete();
    }

    edit() {
        this.editItem.emit(this.item.signature);
    }

    remove() {
        this.removeItem.emit(this.item.signature);
    }
}