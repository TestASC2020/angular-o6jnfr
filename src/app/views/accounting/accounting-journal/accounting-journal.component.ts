import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PagerService} from '../../../services/pager.service';
import {ModalDirective} from '../../../lib/ng-uikit-pro-standard/free/modals';
import {AccountingService} from '../../../services/accounting.service';
import {TranslateService} from '@ngx-translate/core';
import {UtilsService} from '../../../services/utils.service';
import * as moment from 'moment';
import {AppState} from '../../../app-state.service';
import {ExcelService} from '../../../services/excel.service';
import {PdfService} from '../../../services/pdf.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'app-accounting-accounting-journal',
    templateUrl: './accounting-journal.component.html',
    styleUrls: ['./accounting-journal.component.scss']
})
export class AccountingJournalComponent implements OnInit {
    @ViewChild('exportModal') exportModal: ModalDirective;
    items: Array<any> = new Array<any>();
    currentPage: number = 0;
    enableMore: boolean = true;
    grandTotalCredit: number = 0;
    grandTotalDebit: number = 0;
    searchText: string = '';
    fromDate: Date;
    toDate: Date;
    test: string = '';
    error: any;
    pageSizes: Array<number> = [10, 15, 20, 25, 50, 75, 100, 150, 200];
    rowsPerPage: number;
    today: string = new Date().toISOString();
    // sortBy = : byte { None = 0, onDate = 1}
    sortBy: number = 0;
    // sortOrder : byte { None=0, Desc=1, Asc=2 }
    sortOrder: number = 0;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private pagerService: PagerService,
                private utilsService: UtilsService,
                public appState: AppState,
                private translate: TranslateService,
                private excelService: ExcelService,
                private pdfService: PdfService,
                private spinner: NgxSpinnerService,
                private service: AccountingService) {
        setInterval(() => {
            this.languageChange();
        }, 1);
        this.items = [];
    }

    get getCreateDateInfo() {
        return this.utilsService.getCreateDateInfo;
    }

    ngOnInit() {
        this.rowsPerPage = this.pageSizes[0];
        const _this = this;
        setTimeout(function () {
            _this.reloadRecords();
        }, 0);
    }

    doAction() {
        this.exportModal.show();
    }

    filterOpenedDays(dateInputId, $event) {
        moment.locale(this.utilsService.getLocale(this.appState.locale.lang));
        $event.target.setAttribute(
            'data-date',
            moment($event.target.value, 'YYYY-MM-DD')
                .format( $event.target.getAttribute('data-date-format'))
        );
        const _this = this;
        if (dateInputId === 'date_from') {
            if ($event.target.value) {
                this.fromDate = new Date($event.target.value);
                this.fromDate.setHours(0, 0, 0, 0);
            } else {
                this.fromDate = null;
            }
            if ((document.getElementById('date_to') as HTMLInputElement).value) {
                this.toDate = new Date((document.getElementById('date_to') as HTMLInputElement).value);
                this.toDate.setHours(23, 59, 59, 99);
            } else {
                this.toDate = null;
            }
        } else {
            if ($event.target.value) {
                this.toDate = new Date($event.target.value);
                this.toDate.setHours(23, 59, 59, 99);
            } else {
                this.toDate = null;
            }
            if ((document.getElementById('date_from') as HTMLInputElement).value) {
                this.fromDate = new Date((document.getElementById('date_from') as HTMLInputElement).value);
                this.fromDate.setHours(0, 0, 0, 0);
            } else {
                this.fromDate = null;
            }
        }
        if (this.fromDate) {
            if (this.toDate) {
                if (this.fromDate > this.toDate) {
                    this.toDate = null;
                    (document.getElementById('date_to') as HTMLInputElement).value = '';
                    (document.getElementById('date_to') as HTMLInputElement).setAttribute( 'data-date', 'dd MMMM yyyy');
                }
            }
        }
        this.reloadRecords();
    }

    getFromDate() {
        return (document.getElementById('date_from') as HTMLInputElement).value;
    }

    getToDate() {
      return (document.getElementById('date_to') as HTMLInputElement).value;
    }

    languageChange() {
        moment.locale(this.utilsService.getLocale(this.appState.locale.lang));
        const com1 = document.getElementById('date_from') as HTMLInputElement;
        const com2 = document.getElementById('date_to') as HTMLInputElement;
        if (com1 && com2) {
            if (com1.value) {
                com1.setAttribute(
                    'data-date',
                    moment(com1.value, 'YYYY-MM-DD')
                        .format(com1.getAttribute('data-date-format'))
                );
            } else {
                com1.setAttribute('data-date', 'dd MMMM yyyy');
            }
            if (com2.value) {
                com2.setAttribute(
                    'data-date',
                    moment(com2.value, 'YYYY-MM-DD')
                        .format(com2.getAttribute('data-date-format'))
                );
            } else {
                com2.setAttribute('data-date', 'dd MMMM yyyy');
            }
        }
    }

    exportAsType(type: FILE_TYPE): void {
        const _this = this;
        const len = this.items.length;
        this.translate.get('MESSAGE.AccountingJournalFileExport').subscribe(result => {
            let fieldName: Array<string> = result.split(',');
            const displayName = 'Accounting_Journal';
            const fileName = displayName + '_' + this.utilsService.getNormalDateString2(new Date().toISOString()) +
                '_' + _this.utilsService.getLocale(_this.appState.locale.lang);
            if (type === FILE_TYPE.PDF) {
                fieldName = 'Index,Trans code,Date/Time,Description,Debit,Credit'.split(',');
                const body = [];
                let i = 1;
                this.items.forEach(item => {
                    this.translate.get(
                        'DATEFORMAT.DayString',
                        {
                            'st': _this.getCreateDateInfo(item.onDate).st,
                            'day': _this.getCreateDateInfo(item.onDate).day
                        }).subscribe(text1 => {
                        this.translate.get(
                            'DATEFORMAT.' + _this.getCreateDateInfo(item.onDate).month).subscribe(text2 => {
                            this.translate.get(
                                'DATEFORMAT.YearString',
                                {
                                    'year': _this.getCreateDateInfo(item.onDate).year
                                }).subscribe(text3 => {
                                const dateString = text1 + ', ' + text2 + ', ' + text3;
                                const object = [
                                    (i) ? ('0000000' + i).slice(-((_this.items.length.toString()).length)) : 0,
                                    item.transCode,
                                    (item.onDate) ? dateString : '',
                                    item.description,
                                    (item.debit) ? _this.utilsService.numberWithCommas(item.debit) : 0,
                                    (item.credit) ? _this.utilsService.numberWithCommas(item.credit) : 0
                                ];
                                body.push(object);
                                if (i === len) {
                                    body.push([
                                        '',
                                        '',
                                        '',
                                        {content: 'Total', styles: {fontStyle: 'bold'}},
                                        {content: _this.utilsService.numberWithCommas(_this.grandTotalDebit), styles: {fontStyle: 'bold'}},
                                        {content: _this.utilsService.numberWithCommas(_this.grandTotalCredit), styles: {fontStyle: 'bold'}}
                                    ]);
                                    this.pdfService.exportAsPDFFile([fieldName], body, fileName);
                                } else {
                                    i++;
                                }
                            });
                        });
                    });
                });
            } else {
                const data = [];
                let i = 1;
                this.items.forEach(item => {
                    this.translate.get(
                        'DATEFORMAT.DayString',
                        {
                            'st': _this.getCreateDateInfo(item.onDate).st,
                            'day': _this.getCreateDateInfo(item.onDate).day
                        }).subscribe(text1 => {
                        this.translate.get(
                            'DATEFORMAT.' + _this.getCreateDateInfo(item.onDate).month).subscribe(text2 => {
                            this.translate.get(
                                'DATEFORMAT.YearString',
                                {
                                    'year': _this.getCreateDateInfo(item.onDate).year
                                }).subscribe(text3 => {
                                const dateString = text1 + ', ' + text2 + ', ' + text3;
                                const object = {
                                    name1: (i) ? ('0000000' + i).slice(-((_this.items.length.toString()).length)) : 0,
                                    name2: item.transCode,
                                    name3: (item.onDate) ? dateString : '',
                                    name4: item.description,
                                    name5: (item.debit) ? _this.utilsService.numberWithCommas(item.debit) : 0,
                                    name6: (item.credit) ? _this.utilsService.numberWithCommas(item.credit) : 0
                                };
                                let fnI1 = 1;
                                fieldName.forEach(fn => {
                                    const temp = 'name' + fnI1;
                                    _this.utilsService.renameObjectKey(object, temp, fn);
                                    fnI1++;
                                });
                                data.push(object);
                                if (i === len) {
                                    const temp2 = {
                                        name1: '',
                                        name2: '',
                                        name3: '',
                                        name4: 'Total',
                                        name5: _this.utilsService.numberWithCommas(_this.grandTotalDebit),
                                        name6: _this.utilsService.numberWithCommas(_this.grandTotalCredit)
                                    };
                                    let fnI = 1;
                                    fieldName.forEach(fn => {
                                        const temp = 'name' + fnI;
                                        _this.utilsService.renameObjectKey(temp2, temp, fn);
                                        fnI++;
                                    });
                                    data.push(temp2);
                                    this.excelService.exportAsExcelFile(data, fileName);
                                } else {
                                    i++;
                                }
                            });
                        });
                    });
                });
            }
        });
    }

    exportAsXLSX() {
        this.exportAsType(FILE_TYPE.Excel);
    }

    exportAsPDF() {
        this.exportAsType(FILE_TYPE.PDF);
    }

    loadRecords() {
        const _this = this;
        if (this.currentPage !== -1) {
            this.currentPage++;
            const sendData = {
                pageSz: Number.parseInt(this.rowsPerPage.toString(), 10),
                pageNo: this.currentPage,
                sortOrder: this.sortOrder,
                sortBy: this.sortBy
            };
            if (this.fromDate) {
                sendData['fromDate'] = this.fromDate;
            }
            if (this.toDate) {
                sendData['toDate'] = this.toDate;
            }
            this.service.loadOrgJournal(sendData)
                .subscribe(result => {
                if (result['data']) {
                    setTimeout(() => {
                        /** spinner ends after 5 seconds */
                        _this.spinner.hide();
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
                            _this.items.forEach(item => {
                                _this.grandTotalCredit += item.credit;
                                _this.grandTotalDebit += item.debit;
                            });
                        }
                    }, 0);
                }
            });
        } else {
            this.enableMore = false;
            setTimeout(function () {
                _this.spinner.hide();
            }, 0);
        }
    }

    reloadRecords() {
        this.spinner.show();
        this.currentPage = 0;
        this.items = [];
        this.loadRecords();
    }

    loadMoreRecords() {
        this.spinner.show();
        this.loadRecords();
    }
}
export enum FILE_TYPE {
    PDF,
    Excel
}
