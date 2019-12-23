import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {QUOTATIONSTATUS} from '../../../../../../models/quotation-status';

@Component({
    selector: 'app-cms-vendor-curriculum-quotes-action-menu',
    templateUrl: './quotes-action-menu.component.html',
    styleUrls: ['./quotes-action-menu.component.scss']
})
export class QuotesActionMenuComponent implements OnInit, OnDestroy {
    @Input() item: any;
    @Output() viewQuote: EventEmitter<any> = new EventEmitter<any>();
    @Output() chatQuote: EventEmitter<any> = new EventEmitter<any>();
    @Output() terminateQuote: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('pop') popContent: any;

    constructor() { }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.viewQuote.complete();
        this.chatQuote.complete();
        this.terminateQuote.complete();
    }

    view(item) {
        this.viewQuote.emit(item);
    }

    chat(item) {
        this.chatQuote.emit(item);
    }

    terminate(item) {
        this.terminateQuote.emit(item);
    }

    get QUOTATIONSTATUS() {
        return QUOTATIONSTATUS;
    }
}