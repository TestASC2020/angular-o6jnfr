import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from '../../../lib/ng-uikit-pro-standard/free/modals';

@Component({
    selector: 'app-business-profile-staff-action-menu',
    templateUrl: './staff-action-menu.component.html',
    styleUrls: ['./staff-action-menu.component.scss']
})
export class StaffActionMenuComponent implements OnInit, OnDestroy {
    @Input() item: any;
    @Output() viewItem: EventEmitter<number> = new EventEmitter<number>();
    @Output() removeItem: EventEmitter<number> = new EventEmitter<number>();
    @ViewChild('popContent') pop: ModalDirective;

    constructor() { }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.viewItem.complete();
        this.removeItem.complete();
    }

    view() {
        this.viewItem.emit(this.item.id);
        this.pop.hide();
    }

    remove() {
        this.removeItem.emit(this.item.id);
        this.pop.hide();
    }
}