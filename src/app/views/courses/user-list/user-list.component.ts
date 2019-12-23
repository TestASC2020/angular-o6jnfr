import {Component, OnInit, ViewChild} from '@angular/core';
import {PagerService} from '../../../services/pager.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CoursesService} from '../../../services/courses.service';
import {ModalDirective} from '../../../lib/ng-uikit-pro-standard/free/modals';
import {CookieService} from 'ngx-cookie';
import {UtilsService} from '../../../services/utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ExcelService} from '../../../services/excel.service';
import {TranslateService} from '@ngx-translate/core';
import {PdfService} from '../../../services/pdf.service';
import {AppState} from '../../../app-state.service';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
    @ViewChild('notificationModal') notificationModal: ModalDirective;
    @ViewChild('adminModal') adminModal: ModalDirective;
    @ViewChild('confirmBanUnBanModal') confirmBanUnBanModal: ModalDirective;
    items: Array<any> = new Array<any>();
    currentPage: number = 0;
    enableMore: boolean = true;
    reason: string = '';
    message: string = '';
    warning: boolean;
    courseInfo: any;
    pager: any = {};
    pageSizes: Array<number> = [10, 15, 20, 25, 50, 75, 100, 150, 200];
    selectedActiveLogs: Array<any> = new Array<any>();
    rowsPerPage: number;
    itemToView: any;
    isBan: boolean = false;
    searchText: string = '';
    // sortBy = : byte { None = 0, EnrollDate = 1}
    sortBy: number = 0;
    // sortOrder : byte { None=0, Desc=1, Asc=2 }
    sortOrder: number = 0;
    @ViewChild('exportModal') exportModal: ModalDirective;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private cookieService: CookieService,
        public appState: AppState,
        private service: CoursesService,
        private utilsService: UtilsService,
        private translate: TranslateService,
        private excelService: ExcelService,
        private pdfService: PdfService,
        private pagerService: PagerService,
        private spinner: NgxSpinnerService,
    ) {
        this.items = [];
    }

    ngOnInit() {
        this.rowsPerPage = this.pageSizes[0];
        if (this.cookieService.get('courseInfo')) {
            this.courseInfo = JSON.parse(this.cookieService.get('courseInfo'));
        }
        this.loadRecords();
    }

    doAction() {
      this.exportModal.show();
    }

    loadRecords() {
        const _this = this;
        if (this.currentPage !== -1) {
            this.currentPage++;
            const sendData = {
                pageSz: Number.parseInt(this.rowsPerPage.toString(), 10),
                pageNo: this.currentPage,
                sortOrder: this.sortOrder,
                sortBy: this.sortBy,
                crsSig: (this.courseInfo.crsSig) ? this.courseInfo.crsSig : ((this.courseInfo.signature) ? this.courseInfo.signature : '')
            };
            if (this.searchText) {
                sendData['userName'] = this.searchText;
            }
            this.service.loadCrsUserList(sendData).subscribe(result => {
                    if (result['data']) {
                        setTimeout(function () {
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
                                    te.crsSig = _this.courseInfo.crsSig;
                                    te.crsName = _this.courseInfo.crsName;
                                    _this.items.push(te);
                                });
                            }
                        }, 0);
                    }
                });
        } else {
            this.enableMore = false;
        }
    }

    openNotifiModal(item) {
        this.itemToView = item;
        if (this.itemToView) {
            this.notificationModal.show();
        }
    }
    sendNotification() {
        const data = {
            message: this.message,
            warning: this.warning,
            userCrsSig: this.itemToView.signature
        };
        this.service.SendNotiUserCrs(data).subscribe(result => {
            console.log(result);
        });
    }
    openadminModal(item) {
        this.itemToView = item;
        const _this = this;
        if (this.itemToView) {
            const data = {
                userCrsSig: this.itemToView.signature
            };
            this.service.GetActivityLog(data).subscribe(result => {
                _this.selectedActiveLogs = result['data'];
                _this.adminModal.show();
            });
        }
    }
    openConfirmBan_Unban(item, isBan) {
        this.isBan = isBan;
        this.itemToView = item;
        this.confirmBanUnBanModal.show();
    }

    ConfirmBan() {
        const data = {
            reason: this.reason,
            userCrsSig: this.itemToView.signature
        };
        this.service.BanCrsUser(data).subscribe(result => {
            const arr = this.items.filter(it => it.userId === this.itemToView.userId);
            if (arr.length > 0) {
                arr.forEach(arItem => {
                    arItem.settings = 1;
                });
            }
            this.confirmBanUnBanModal.hide();
        });
    }

    ConfirmUnBan() {
        const data = {
            reason: this.reason,
            userCrsSig: this.itemToView.signature
        };
        this.service.UnBanCrsUser(data).subscribe(result => {
            const arr = this.items.filter(it => it.userId === this.itemToView.userId);
            if (arr.length > 0) {
                arr.forEach(arItem => {
                    arItem.settings = 0;
                });
            }
            this.confirmBanUnBanModal.hide();
        });
    }

    getLogTypeIconClass(logType: number): string {
        const logIconsClass = [
            {logType: 1, class: 'pe-7s-bell'},
            {logType: 2, class: 'pe-7s-lock'},
            {logType: 3, class: 'pe-7s-angle-down-circle'}
        ];
        return logIconsClass[logType % 3].class;
    }

    get getCreateDateInfo() {
        return this.utilsService.getCreateDateInfo;
    }

    generateAddress(item): any {
        const address = {
           line: '',
           details: ''
        };
        const line = [];
        const adds = [];
        if (item.line1) {
            line.push(item.line1);
        }
        if (item.line2) {
            line.push(item.line2);
        }
        address.line = line.join(', ');
        if (item.city) {
            adds.push(item.city);
        }
        if (item.region) {
            adds.push(item.region);
        }
        if (item.country) {
            adds.push(item.country);
        }
        address.details = adds.join(', ');
        return address;
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

    checkSearch($event: KeyboardEvent) {
        if ($event.which === 13) {
            this.refresh();
            $event.preventDefault();
        }
    }

    refresh() {
        this.currentPage = 0;
        this.enableMore = true;
        this.items = new Array<any>();
        this.loadRecords();
    }

  exportAsType(type: FILE_TYPE): void {
    const _this = this;
    const len = this.items.length;
    this.translate.get('MESSAGE.CourseUsersListFileExport').subscribe(result => {
      let fieldName: Array<string> = result.split(',');
      const displayName = 'Users_List';
      const fileName = displayName + '_' + this.utilsService.getNormalDateString2(new Date().toISOString()) +
        '_' + _this.utilsService.getLocale(_this.appState.locale.lang);
      if (type === FILE_TYPE.PDF) {
        fieldName = 'Name,Location,Enrolled,Last Active,Progress'.split(',');
        const body = [];
        let i = 1;
        this.items.forEach(item => {
          const te = [];
          if (this.generateAddress(item).line) {
            te.push(this.generateAddress(item).line);
          }
          if (this.generateAddress(item).details) {
            te.push(this.generateAddress(item).details);
          }
          const object = [
            (item.name) ? item.name : '',
            te.join(', '),
            (item.enrollOn) ? this.utilsService.getNormalDateString(item.enrollOn) : '',
            (item.lastActive) ? this.utilsService.getNormalDateString(item.lastActive) : '',
            (item.progress) ? (Number.parseFloat(item.progress.toString()) * 100).toFixed(2) : 0
          ];
          body.push(object);
          if (i === len) {
            this.pdfService.exportAsPDFFile([fieldName], body, fileName, true);
          } else {
            i++;
          }
        });
      } else {
        const data = [];
        let i = 1;
        this.items.forEach(item => {
          const te = [];
          if (this.generateAddress(item).line) {
            te.push(this.generateAddress(item).line);
          }
          if (this.generateAddress(item).details) {
            te.push(this.generateAddress(item).details);
          }
          const object = {
            name1: (item.name) ? item.name : '',
            name2: te.join(', '),
            name3: (item.enrollOn) ? this.utilsService.getNormalDateString(item.enrollOn) : '',
            name4: (item.lastActive) ? this.utilsService.getNormalDateString(item.lastActive) : '',
            name5: (item.progress) ? (Number.parseFloat(item.progress.toString()) * 100).toFixed(2) : 0,
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
export enum FILE_TYPE {
  PDF,
  Excel
}
