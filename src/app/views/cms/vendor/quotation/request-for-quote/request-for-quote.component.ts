import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PagerService } from '../../../../../services/pager.service';
import { CurriculumsService } from '../../../../../services/curriculums.service';
import { ModalDirective } from '../../../../../lib/ng-uikit-pro-standard/free/modals';
import { QUOTATIONSTATUS } from '../../../../../models/quotation-status';
import { UtilsService } from '../../../../../services/utils.service';
import { QuotationService } from '../../../../../services/quotation.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { AppState } from '../../../../../app-state.service';
import { HttpHeaders } from '@angular/common/http';
import { PreloaderService } from 'src/app/shared/pre-loader/service/pre-loader.service';

@Component({
    selector: 'app-request-for-quote',
    templateUrl: './request-for-quote.component.html',
    styleUrls: ['./request-for-quote.component.scss']
})
export class RequestForQuoteComponent implements OnInit {
    quote: any;
    items: Array<any>;
    currentPage: number = 0;
    enableMore: boolean = true;
    searchText: string = '';
    selectedStatus: string = '-1';
    selectedRequestQuotation: any;
    selectedDecide: any = 0;
    selectedDecideMessage: string = '';
    error: any;
    @ViewChild('send') send: ModalDirective;
    @ViewChild('confirmModal') confirmModal: ModalDirective;
    @ViewChild('errorModal') errorModal: ModalDirective;
    pageSizes: Array<number> = [5, 10, 15, 20, 25];
    rowsPerPage: number;

    constructor(
        private translate: TranslateService,
        private pagerService: PagerService,
        private utilsService: UtilsService,
        private quotationService: QuotationService,
        private appState: AppState,
        private service: CurriculumsService,
        private preloaderService: PreloaderService) {
        this.items = [];
    }



    ngOnInit() {
        this.rowsPerPage = this.pageSizes[0];
        const _this = this;
        setTimeout(function () {
            _this.reloadRecords();
        }, 0);
    }

    get QUOTATIONSTATUS() {
        return QUOTATIONSTATUS;
    }

    updateSelectedStatus() {
        if (this.selectedStatus.toString() !== '-1') {
            this.searchText = this.selectedStatus.toString();
        } else {
            this.searchText = '';
        }
    }

    sendRqtQuote(item) {
        this.quote = item;
        (document.getElementById('quotePrice') as HTMLInputElement).value = '0';
        (document.getElementById('quoteMessage') as HTMLInputElement).value = '';
        this.send.show();
    }

    sendQuote() {
        const price = ((document.getElementById('quotePrice') as HTMLInputElement).value) ?
            JSON.parse((document.getElementById('quotePrice') as HTMLInputElement).value) : 0;
        const quoteMsg = ((document.getElementById('quoteMessage') as HTMLInputElement).value) ?
            (document.getElementById('quoteMessage') as HTMLInputElement).value : '';
        const data = {
            quoteRqtSig: this.quote.signature,
            quoteMsg: quoteMsg,
            price: price
        };
        this.service.sendCvQuote(data).subscribe(resp => {
        });
    }

    ignoreRequestQuotation(item) {
        this.selectedRequestQuotation = item;
        this.selectedDecide = 0;
        const _this = this;
        this.getDecideMessage(this.selectedDecide).subscribe(result => {
            _this.selectedDecideMessage = result;
            _this.confirmModal.show();
        });
    }

    interestRequestQuotation(item) {
        this.selectedRequestQuotation = item;
        this.selectedDecide = 1;
        const _this = this;
        this.getDecideMessage(this.selectedDecide).subscribe(result => {
            _this.selectedDecideMessage = result;
            _this.confirmModal.show();
        });
    }

    changeRequesQuotationDecide() {
        const _this = this;
        const headers = new HttpHeaders();
        headers.append('lang', this.appState.locale.lang);
        this.quotationService.QuoteRqtReaction(
            { quoteSig: this.selectedRequestQuotation.signature, interest: this.selectedDecide }, headers
        ).subscribe(
            resp => {
                _this.confirmModal.hide();
                if (resp['interest'] !== undefined && resp['interest']) {
                    _this.error = {
                        text: resp['interest'][0]
                    };
                    _this.errorModal.show();
                } else {
                    if (resp['success'] === false) {
                        _this.error = resp;
                        _this.errorModal.show();
                    }
                }
            },
            err => {
                _this.confirmModal.hide();
                if (err['interest'] !== undefined && err['interest']) {
                    _this.error = {
                        text: err['interest'][0]
                    };
                    _this.errorModal.show();
                } else {
                    _this.error = err;
                    _this.errorModal.show();
                }
            }
        );
    }

    getDecideMessage(decide: any): Observable<any> {
        let message = '';
        if (decide === 1) {
            message = 'VENDOR.QUOTATION.LIST.ACTION_MENU.INTEREST';
        } else {
            message = 'VENDOR.QUOTATION.LIST.ACTION_MENU.IGNORE';
        }
        return this.translate.get(message);
    }

    loadRecords() {
        const _this = this;
        if (this.currentPage !== -1) {
            this.currentPage++;
            this.preloaderService.enableLoading();
            this.service.loadOrgRqtQuoteList({ pageSz: Number.parseInt(this.rowsPerPage.toString(), 10), pageNo: this.currentPage })
                .subscribe(
                    result => {
                        this.preloaderService.disableLoading();
                        const temp = (result['data'] && result['data'].length > 0) ? result['data'] : [];
                        if (temp.length === 0) {
                            _this.enableMore = false;
                            _this.currentPage = -1;
                        } else {
                            if (temp.length < _this.rowsPerPage) {
                                _this.enableMore = false;
                            } else {
                                _this.enableMore = true;
                            }
                            temp.forEach(te => {
                                _this.items.push(te);
                            });
                        }
                    },
                    err => {
                        this.preloaderService.disableLoading();
                    });
        } else {
            this.enableMore = false;
        }
    }

    reloadRecords() {
        this.currentPage = 0;
        this.items = [];
        this.loadRecords();
    }

    loadMoreRecords() {
        this.loadRecords();
    }

    checkSearch(item, p1, p2, p3, p4) {
        const _this = this;
        if (this.searchText === '') {
            return true;
        } else {
            return (item.description && item.description.toLowerCase().indexOf(_this.searchText.toLowerCase()) >= 0) ||
                (item.buyer && item.buyer.toLowerCase().indexOf(_this.searchText.toLowerCase()) >= 0) ||
                p1.toLowerCase().indexOf(_this.searchText.toLowerCase()) >= 0 ||
                p2.toLowerCase().indexOf(_this.searchText.toLowerCase()) >= 0 ||
                p3.toLowerCase().indexOf(_this.searchText.toLowerCase()) >= 0 ||
                p4.toLowerCase().indexOf(_this.searchText.toLowerCase()) >= 0;
        }
    }

    get getCreateDateInfo() {
        return this.utilsService.getCreateDateInfo;
    }

    showError(err: any) {
        this.error = err;
        this.errorModal.show();
    }
}
