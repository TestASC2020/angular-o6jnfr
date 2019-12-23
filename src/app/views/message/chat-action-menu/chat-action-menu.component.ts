import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';

@Component({
    selector: 'app-message-chat-action-menu',
    templateUrl: './chat-action-menu.component.html',
    styleUrls: ['./chat-action-menu.component.scss']
})
export class ChatActionMenuComponent implements OnInit, OnDestroy {
    @Input() item: any;
    @Output() seenEmitter: EventEmitter<any> = new EventEmitter<any>();
    @Output() editEmitter: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('popContent') popContent: any;
    constructor() { }

    ngOnInit() {
    }

    edit() {
        this.editEmitter.emit(this.item);
        this.popContent.hide();
    }
    seenList() {
        this.seenEmitter.emit(this.item);
        this.popContent.hide();
    }
    ngOnDestroy() {
        this.seenEmitter.complete();
        this.editEmitter.complete();
    }
}
