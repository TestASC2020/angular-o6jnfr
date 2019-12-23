import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';

@Component({
    selector: 'app-cms-vendor-order-processing-view-action-menu',
    templateUrl: './order-processing-view-action-menu.component.html',
    styleUrls: ['./order-processing-view-action-menu.component.scss']
})
export class OrderProcessingViewActionMenuComponent implements OnInit, OnDestroy {
    @Input() item: any;
    @Output() submitEvent: EventEmitter<any> = new EventEmitter<any>();
    @Output() logsEvent: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('popContent') popContent: any;

    constructor(private router: Router,
                private cookieService: CookieService) { }

    ngOnInit() {
    }

    submitItem(item) {
        this.popContent.hide();
        this.submitEvent.emit(item);
    }

    logsItem(item) {
        this.popContent.hide();
        this.logsEvent.emit(item);
    }

    ngOnDestroy() {
        this.submitEvent.complete();
        this.logsEvent.complete();
    }
}
