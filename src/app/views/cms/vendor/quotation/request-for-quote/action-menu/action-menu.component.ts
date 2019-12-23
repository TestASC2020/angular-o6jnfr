import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';
import {QuotationService} from '../../../../../../services/quotation.service';
import {CurriculumsService} from '../../../../../../services/curriculums.service';
import {QUOTATIONSTATUS} from '../../../../../../models/quotation-status';

@Component({
    selector: 'app-cms-vendor-request-for-quote-action-menu',
    templateUrl: './action-menu.component.html',
    styleUrls: ['./action-menu.component.scss']
})
export class QuotationActionMenuComponent implements OnInit, OnDestroy {
    @Input() item: any;
    @Output() sendQuoteRqt: EventEmitter<number> = new EventEmitter<number>();
    @Output() interestEmitter: EventEmitter<number> = new EventEmitter<number>();
    @Output() ignoreEmitter: EventEmitter<number> = new EventEmitter<number>();
    @Output() error: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('popContent') popContent: any;

    constructor(private router: Router,
                private cookieService: CookieService,
                private service: QuotationService,
                private cvService: CurriculumsService) { }

    ngOnInit() {
    }

    view(item) {
        this.cvService.loadOrgRqtQuote({quoteSig: item.signature}).subscribe(resp => {
            const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
            this.cookieService.put('quoteDetails', JSON.stringify(resp['data']), opt);
            this.router.navigate(['cms/vendor/quotation/request-for-quote/request-quote-view/']);
        });
    }

    chat(item) {
        if (item.createBySig) {
            // createBySig
            const opt = {expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate())};
            this.cookieService.put('chatWithOrg', JSON.stringify({orgSig: item.createBySig}), opt);
            this.router.navigate(['message']);
        }
    }

    interest(item) {
        this.interestEmitter.emit(item);
    }

    ignore(item) {
        this.ignoreEmitter.emit(item);
    }

    sendQuote(item) {
        this.sendQuoteRqt.emit(item);
    }

    curriculum(item) {
        this.service.loadCurriculumQuote({quoteSig: item.signature}).subscribe(
            resp => {
                item = (resp['data']) ? resp['data'] : null;
                if (item) {
                    const opt = {expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate())};
                    const routLinks = [
                        {
                            'link': '../../../vendor/quotation/request-for-quote',
                            'display': 'SIDEBAR.QUOTATIONS.REQUEST_FOR_QUOTE.NAME'
                        },
                        {
                            'display': item.name
                        },
                    ];
                    const cvInfo = {
                        signature: item.signature,
                        name: item.name
                    };
                    this.cookieService.put('cvInfo', JSON.stringify(cvInfo), opt);
                    this.cookieService.put('editable', JSON.stringify({editable: false}), opt);
                    this.cookieService.put('routLinks', JSON.stringify(routLinks), opt);
                    this.router.navigate(['cms/vendor/curriculums/curriculum-view']);
                } else {
                    this.error.emit({'text': 'Not found'});
                }
            },
            err => {
                this.error.emit(err);
            }
        );
        this.popContent.hide();
    }

    ngOnDestroy() {
        this.sendQuoteRqt.complete();
        this.interestEmitter.complete();
        this.ignoreEmitter.complete();
        this.error.complete();
    }

    get QUOTATIONSTATUS() {
        return QUOTATIONSTATUS;
    }
}
