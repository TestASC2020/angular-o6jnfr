import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';

@Component({
    selector: 'app-emoji-action-menu',
    templateUrl: './emoji-action-menu.component.html',
    styleUrls: ['./emoji-action-menu.component.scss']
})
export class EmojiActionMenuComponent implements OnInit, OnDestroy {
    @Input() item: any;
    @Output() seen: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('popContent') popContent: any;
    constructor(private router: Router,
                private cookieService: CookieService) { }

    ngOnInit() {
    }

    edit(item) {

    }
    seenList(item) {
        this.seen.emit(item);
        this.popContent.hide();
    }
    ngOnDestroy() {
        this.seen.complete();
    }
}
