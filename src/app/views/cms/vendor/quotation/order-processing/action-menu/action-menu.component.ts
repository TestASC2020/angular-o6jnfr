import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';

@Component({
    selector: 'app-cms-vendor-order-processing-action-menu',
    templateUrl: './action-menu.component.html',
    styleUrls: ['./action-menu.component.scss']
})
export class OrderProcessingActionMenuComponent implements OnInit, OnDestroy {
    @Input() item: any;
    @Output() terminateEmitter: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('popContent') popContent: any;
    constructor(private router: Router,
                private cookieService: CookieService) { }

    ngOnInit() {
    }

    update(item) {
        const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
        this.cookieService.put('orderInfo', JSON.stringify(item), opt);
        this.popContent.hide();
        this.router.navigate(['cms/vendor/quotation/order-processing/order-processing-view']);
    }

    chat(item) {
        this.popContent.hide();
        if (item.createBySig) {
            // createBySig
            const opt = {expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate())};
            this.cookieService.put('chatWithOrg', JSON.stringify({orgSig: item.createBySig}), opt);
            this.router.navigate(['message']);
        }
    }

    terminate(item) {
        this.popContent.hide();
        this.terminateEmitter.emit(item);
    }

    ngOnDestroy() {
        this.terminateEmitter.complete();
    }

}
