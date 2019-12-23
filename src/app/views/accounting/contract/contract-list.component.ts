import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountingService} from '../../../services/accounting.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {UtilsService} from '../../../services/utils.service';
import {ModalDirective} from '../../../lib/ng-uikit-pro-standard/free/modals';
import {FILE_TYPE} from '../accounting-journal/accounting-journal.component';
import {TranslateService} from '@ngx-translate/core';
import {ExcelService} from '../../../services/excel.service';
import {PdfService} from '../../../services/pdf.service';
import {AppState} from '../../../app-state.service';

@Component({
    selector: 'app-accounting-contract-list',
    templateUrl: './contract-list.component.html',
    styleUrls: ['./contract-list.component.scss']
})
export class ContractListComponent implements OnInit {
    @ViewChild('exportModal') exportModal: ModalDirective;
    items: Array<any> = new Array<any>();
    view_items: Array<any> = new Array<any>();
    currentPage: number = 0;
    enableMore: boolean = true;
    error: any;
    pageSizes: Array<number> = [5, 10, 15, 20, 25, 50, 75, 100, 150, 200];
    rowsPerPage: number;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private spinner: NgxSpinnerService,
                private translate: TranslateService,
                private excelService: ExcelService,
                private pdfService: PdfService,
                public appState: AppState,
                private utilsService: UtilsService,
                private service: AccountingService) {
        this.items = [];
    }

    ngOnInit() {
        this.rowsPerPage = this.pageSizes[0];
        const _this = this;
        setTimeout(function () {
            _this.reloadRecords();
        }, 0);
    }

    get getCreateDateInfo() {
        return this.utilsService.getCreateDateInfo;
    }

    doAction() {
        this.exportModal.show();
    }

    loadRecords() {
        const _this = this;
        if (this.currentPage !== -1) {
            this.currentPage++;
            const len = _this.items.length;
            this.service.loadContractList({pageSz: Number.parseInt(this.rowsPerPage.toString(), 10), pageNo: this.currentPage})
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
                            _this.items.sort((a, b) => {
                                if ((new Date(a.onDate)) > (new Date(b.onDate))) {
                                    return 1;
                                } else {
                                    return -1;
                                }
                            });
                            _this.view_items = [];
                            _this.items.forEach(it => {
                                _this.view_items.push(it);
                            });
                        }
                    }, 0);
                }
            });
        } else {
            setTimeout(() => {
                this.enableMore = false;
                /** spinner ends after 5 seconds */
                _this.spinner.hide();
            }, 0);
        }
    }

    reloadRecords() {
        this.spinner.show();
        this.currentPage = 0;
        this.loadRecords();
    }

    loadMoreRecords() {
        this.spinner.show();
        this.loadRecords();
    }

    checkExists(arr: Array<any>, item: any): boolean {
        if (arr.map(it => it['no']).indexOf(item['no']) !== -1) {
            return true;
        }
        return false;
    }

    exportAsType(type: FILE_TYPE): void {
        const _this = this;
        const len = this.items.length;
        this.translate.get('MESSAGE.AccountingContractFileExport').subscribe(result => {
            let fieldName: Array<string> = result.split(',');
            const displayName = 'Accounting_Contract';
            const fileName = displayName + '_' + this.utilsService.getNormalDateString2(new Date().toISOString()) +
                '_' + _this.utilsService.getLocale(_this.appState.locale.lang);
            if (type === FILE_TYPE.PDF) {
                fieldName = 'No,Name,Start Date,End Date,Share Ratio,Trans Fee,Status'.split(',');
                const body = [];
                let i = 1;
                this.items.forEach(item => {
                    this.translate.get(
                        'DATEFORMAT.DayString',
                        {
                            'st': _this.getCreateDateInfo(item.startOn).st,
                            'day': _this.getCreateDateInfo(item.startOn).day
                        }).subscribe(text1 => {
                        this.translate.get(
                            'DATEFORMAT.' + _this.getCreateDateInfo(item.startOn).month).subscribe(text2 => {
                            this.translate.get(
                                'DATEFORMAT.YearString',
                                {
                                    'year': _this.getCreateDateInfo(item.startOn).year
                                }).subscribe(text3 => {
                                this.translate.get(
                                    'DATEFORMAT.DayString',
                                    {
                                        'st': _this.getCreateDateInfo(item.endOn).st,
                                        'day': _this.getCreateDateInfo(item.endOn).day
                                    }).subscribe(text4 => {
                                    this.translate.get(
                                        'DATEFORMAT.' + _this.getCreateDateInfo(item.endOn).month).subscribe(text5 => {
                                        this.translate.get(
                                            'DATEFORMAT.YearString',
                                            {
                                                'year': _this.getCreateDateInfo(item.endOn).year
                                            }).subscribe(text6 => {
                                            let dateString1 = text1 + ', ' + text2 + ', ' + text3;
                                            if (dateString1.indexOf('9999') !== -1) {
                                                dateString1 = '';
                                            }
                                            let dateString2 = text4 + ', ' + text5 + ', ' + text6;
                                            if (dateString2.indexOf('9999') !== -1) {
                                                dateString2 = '';
                                            }
                                            const object = [
                                                item.no,
                                                item.name,
                                                (item.startOn) ? dateString1 : '',
                                                (item.endOn) ? dateString2 : '',
                                                item.shareRatio,
                                                item.transFee,
                                                item.status
                                            ];
                                            body.push(object);
                                            if (i === len) {
                                                this.pdfService.exportAsPDFFile([fieldName], body, fileName, true);
                                            } else {
                                                i++;
                                            }
                                        });
                                    });
                                });
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
                            'st': _this.getCreateDateInfo(item.startOn).st,
                            'day': _this.getCreateDateInfo(item.startOn).day
                        }).subscribe(text1 => {
                        this.translate.get(
                            'DATEFORMAT.' + _this.getCreateDateInfo(item.startOn).month).subscribe(text2 => {
                            this.translate.get(
                                'DATEFORMAT.YearString',
                                {
                                    'year': _this.getCreateDateInfo(item.startOn).year
                                }).subscribe(text3 => {
                                this.translate.get(
                                    'DATEFORMAT.DayString',
                                    {
                                        'st': _this.getCreateDateInfo(item.endOn).st,
                                        'day': _this.getCreateDateInfo(item.endOn).day
                                    }).subscribe(text4 => {
                                    this.translate.get(
                                        'DATEFORMAT.' + _this.getCreateDateInfo(item.endOn).month).subscribe(text5 => {
                                        this.translate.get(
                                            'DATEFORMAT.YearString',
                                            {
                                                'year': _this.getCreateDateInfo(item.endOn).year
                                            }).subscribe(text6 => {
                                            let dateString1 = text1 + ', ' + text2 + ', ' + text3;
                                            if (dateString1.indexOf('9999') !== -1) {
                                                dateString1 = '';
                                            }
                                            let dateString2 = text4 + ', ' + text5 + ', ' + text6;
                                            if (dateString2.indexOf('9999') !== -1) {
                                                dateString2 = '';
                                            }
                                            const object = {
                                                name1: item.no,
                                                name2: item.name,
                                                name3: (item.startOn) ? dateString1 : '',
                                                name4: (item.endOn) ? dateString2 : '',
                                                name5: item.shareRatio,
                                                name6: item.transFee,
                                                name7: item.status
                                            };
                                            let fnI1 = 1;
                                            fieldName.forEach(fn => {
                                                const temp = 'name' + fnI1;
                                                _this.utilsService.renameObjectKey(object, temp, fn);
                                                fnI1++;
                                            });
                                            data.push(object);
                                            if (i === len) {
                                                this.excelService.exportAsExcelFile(data, fileName);
                                            } else {
                                                i++;
                                            }
                                        });
                                    });
                                });
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
}