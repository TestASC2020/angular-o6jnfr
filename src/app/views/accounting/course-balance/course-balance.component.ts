import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PagerService} from '../../../services/pager.service';
import {ModalDirective} from '../../../lib/ng-uikit-pro-standard/free/modals';
import {AccountingService} from '../../../services/accounting.service';
import {TranslateService} from '@ngx-translate/core';
import {UtilsService} from '../../../services/utils.service';
import {FILE_TYPE} from '../accounting-journal/accounting-journal.component';
import {ExcelService} from '../../../services/excel.service';
import {PdfService} from '../../../services/pdf.service';
import {AppState} from '../../../app-state.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'app-accounting-course-balance',
    templateUrl: './course-balance.component.html',
    styleUrls: ['./course-balance.component.scss']
})
export class CourseBalanceComponent  implements OnInit {
    @ViewChild('exportModal') exportModal: ModalDirective;
    enableMore: boolean = true;
    currentPage: number = 0;
    items: Array<any> = new Array<any>();
    totalUser: number = 0;
    totalAmt: number = 0;
    receivedAmt: number = 0;
    searchText: string = '';
    fromDate: Date;
    toDate: Date;
    pageSizes: Array<number> = [5, 10, 15, 20, 25, 50, 75, 100, 150, 200];
    rowsPerPage: number;
    // sortBy = : byte { None = 0, openedOn = 1}
    sortBy: number = 0;
    // sortOrder : byte { None=0, Desc=1, Asc=2 }
    sortOrder: number = 0;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private translate: TranslateService,
                private excelService: ExcelService,
                private pdfService: PdfService,
                public appState: AppState,
                private spinner: NgxSpinnerService,
                private pagerService: PagerService,
                private utilsService: UtilsService,
                private service: AccountingService) {
        this.items = [];
    }

    checkExists(arr: Array<any>, item: any): boolean {
        if (arr.map(it => it['signature']).indexOf(item['signature']) !== -1) {
            return true;
        }
        return false;
    }

    ngOnInit() {
        const _this = this;
        _this.totalAmt = 0;
        _this.totalUser = 0;
        _this.receivedAmt = 0;
        this.rowsPerPage = this.pageSizes[0];
        setTimeout(function () {
            _this.reloadRecords();
        }, 0);
    }

    doAction() {
        this.exportModal.show();
    }

    get getCreateDateInfo() {
        return this.utilsService.getCreateDateInfo;
    }

    filterOpenedDays(dateInputId, $event) {
        const _this = this;
        if (dateInputId === 'date_from') {
            this.fromDate = new Date($event.target.value);
            if ((document.getElementById('date_to') as HTMLInputElement).value) {
                this.toDate = new Date((document.getElementById('date_to') as HTMLInputElement).value);
            } else {
                this.toDate = null;
            }
        } else {
            this.toDate = new Date($event.target.value);
            if ((document.getElementById('date_from') as HTMLInputElement).value) {
                this.fromDate = new Date((document.getElementById('date_from') as HTMLInputElement).value);
            } else {
                this.fromDate = null;
            }
        }
        if (this.fromDate) {
            if (this.toDate) {
                if (this.fromDate > this.toDate) {
                    this.toDate = null;
                    (document.getElementById('date_to') as HTMLInputElement).value = '';
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

    exportAsType(type: FILE_TYPE): void {
        const _this = this;
        const len = this.items.length;
        this.translate.get('MESSAGE.CourseBalanceFileExport').subscribe(result => {
            let fieldName: Array<string> = result.split(',');
            const displayName = 'Course_Balance';
            const fileName = displayName + '_' + this.utilsService.getNormalDateString2(new Date().toISOString()) +
                '_' + _this.utilsService.getLocale(_this.appState.locale.lang);
            if (type === FILE_TYPE.PDF) {
                fieldName = 'Index,Name,Opened on,Total users,Total amount,Received atm'.split(',');
                const body = [];
                let i = 1;
                _this.items.forEach(item => {
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
                                    item.name,
                                    (item.openedOn) ? dateString : '',
                                    (item.totalUser) ? _this.utilsService.numberWithCommas(item.totalUser) : 0,
                                    (item.totalAmt) ? _this.utilsService.numberWithCommas(item.totalAmt) : 0,
                                    (item.receivedAmt) ? _this.utilsService.numberWithCommas(item.receivedAmt) : 0
                                ];
                                body.push(object);
                                if (i === len) {
                                  body.push([
                                    '',
                                    '',
                                    {content: 'Total', styles: {fontStyle: 'bold'}},
                                    {content: _this.utilsService.numberWithCommas(_this.totalUser), styles: {fontStyle: 'bold'}},
                                    {content: _this.utilsService.numberWithCommas(_this.totalAmt), styles: {fontStyle: 'bold'}},
                                    {content: _this.utilsService.numberWithCommas(_this.receivedAmt), styles: {fontStyle: 'bold'}}
                                  ]);
                                  _this.pdfService.exportAsPDFFile([fieldName], body, fileName);
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
                _this.items.forEach(item => {
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
                                    name2: item.name,
                                    name3: (item.openedOn) ? dateString : '',
                                    name4: (item.totalUser) ? _this.utilsService.numberWithCommas(item.totalUser) : 0,
                                    name5: (item.totalAmt) ? _this.utilsService.numberWithCommas(item.totalAmt) : 0,
                                    name6: (item.receivedAmt) ? _this.utilsService.numberWithCommas(item.receivedAmt) : 0
                                };
                                let fnI = 1;
                                fieldName.forEach(fn => {
                                    const temp = 'name' + fnI;
                                    _this.utilsService.renameObjectKey(object, temp, fn);
                                    fnI++;
                                });
                                data.push(object);
                                if (i === len) {
                                  const temp2 = {
                                    name1: '',
                                    name2: '',
                                    name3: 'Total',
                                    name4: _this.utilsService.numberWithCommas(_this.totalUser),
                                    name5: _this.utilsService.numberWithCommas(_this.totalAmt),
                                    name6: _this.utilsService.numberWithCommas(_this.receivedAmt)
                                  };
                                  let fnI1 = 1;
                                  fieldName.forEach(fn => {
                                    const temp = 'name' + fnI1;
                                    _this.utilsService.renameObjectKey(temp2, temp, fn);
                                    fnI1++;
                                  });
                                  data.push(temp2);
                                  _this.excelService.exportAsExcelFile(data, fileName);
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
            this.service.loadCrsBalanceAmt(sendData)
                .subscribe(result => {
                const temp = (result['data'] && result['data'].length > 0) ? result['data'] : [];
                setTimeout(function () {
                    _this.spinner.hide();
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
                            _this.totalAmt += item.totalAmt;
                            _this.totalUser += item.totalUser;
                            _this.receivedAmt += item.receivedAmt;
                        });
                    }
                }, 1000);
            });
        } else {
            this.enableMore = false;
            setTimeout(function () {
                _this.spinner.hide();
            }, 1000);
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
