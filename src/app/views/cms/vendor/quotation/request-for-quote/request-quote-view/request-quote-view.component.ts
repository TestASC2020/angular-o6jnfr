import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';
import {QUOTATIONSTATUS} from '../../../../../../models/quotation-status';
import {CurriculumsService} from '../../../../../../services/curriculums.service';

@Component({
    selector: 'app-request-quote-view',
    templateUrl: './request-quote-view.component.html',
    styleUrls: ['./request-quote-view.component.scss']
})
export class RequestQuoteViewComponent implements OnInit {
    quoteDetails: any;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private cookieService: CookieService,
        private service: CurriculumsService) {
    }

    ngOnInit() {
        if (this.cookieService.get('quoteDetails')) {
            this.quoteDetails = JSON.parse(this.cookieService.get('quoteDetails'));
        }
    }

    get QUOTATIONSTATUS() {
        return QUOTATIONSTATUS;
    }

    sendQuote() {
        const _this = this;
        const price = ((document.getElementById('quotePrice') as HTMLInputElement).value) ?
            JSON.parse((document.getElementById('quotePrice') as HTMLInputElement).value) : 0;
        const quoteMsg = ((document.getElementById('quoteMessage') as HTMLInputElement).value) ?
            (document.getElementById('quoteMessage') as HTMLInputElement).value : '';
        const data = {
            quoteRqtSig: this.quoteDetails.signature,
            quoteMsg: quoteMsg,
            price: price
        };
        this.service.sendCvQuote(data).subscribe(resp => {
            _this.service.loadOrgRqtQuote({quoteSig: _this.quoteDetails.signature}).subscribe(resp2 => {
                const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
                this.cookieService.put('quoteDetails', JSON.stringify(resp2['data']), opt);
                _this.quoteDetails = resp2['data'];
            });
        });
    }
}
