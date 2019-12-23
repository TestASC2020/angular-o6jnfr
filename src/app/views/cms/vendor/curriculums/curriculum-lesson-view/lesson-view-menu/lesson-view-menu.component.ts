import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from '../../../../../../lib/ng-uikit-pro-standard/free/modals';

@Component({
    selector: 'app-cms-vendor-curriculum-lesson-view-action-menu',
    templateUrl: './lesson-view-menu.component.html',
    styleUrls: ['./lesson-view-menu.component.scss']
})
export class LessonViewMenuComponent implements OnInit, OnDestroy {
    @Input() item: any;
    @Input() isOpen: boolean;
    @Output() deleteItem: EventEmitter<number> = new EventEmitter<number>();
    @Output() playItem: EventEmitter<number> = new EventEmitter<number>();
    @ViewChild('popContent') pop: ModalDirective;

    constructor() { }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.deleteItem.complete();
        this.playItem.complete();
    }

    play() {
        this.playItem.emit(this.item.id);
        this.pop.hide();
    }

    removed() {
        this.deleteItem.emit(this.item.id);
        this.pop.hide();
    }
}