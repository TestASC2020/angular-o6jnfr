import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UtilsService} from '../../../../services/utils.service';
import {CookieService} from 'ngx-cookie';
import {CoursesService} from '../../../../services/courses.service';
import {ModalDirective} from '../../../../lib/ng-uikit-pro-standard/free/modals';
import {ExcelService} from '../../../../services/excel.service';
import {TranslateService} from '@ngx-translate/core';
import {AppState} from '../../../../app-state.service';

@Component({
  selector: 'app-report-enroll-left-user',
  templateUrl: './report-enroll-left-user.component.html',
  styleUrls: ['./report-enroll-left-user.component.scss']
})
export class ReportEnrollLeftUserComponent implements OnInit {
  items: Array<any> = new Array<any>();
  reportInfo: any;
  itemToView: any;
  reason: string = '';
  message: string = '';
  warning: boolean;
  isBan: boolean = false;
  selectedActiveLogs: Array<any> = new Array<any>();
  usersList: Array<string> = new Array<string>();
  toRouters: Array<any>;
  @ViewChild('notificationModal') notificationModal: ModalDirective;
  @ViewChild('adminModal') adminModal: ModalDirective;
  @ViewChild('confirmBanUnBanModal') confirmBanUnBanModal: ModalDirective;
  constructor(private router: Router,
              private route: ActivatedRoute,
              private utilsService: UtilsService,
              private cookieService: CookieService,
              private translate: TranslateService,
              private excelService: ExcelService,
              private appState: AppState,
              private service: CoursesService) {
  }

  ngOnInit() {
    const _this = this;
    if (this.cookieService.get('toRouters')) {
      this.toRouters = JSON.parse(this.cookieService.get('toRouters'));
    } else {
      this.toRouters = [
        {
          'link': '../../report',
          'display': 'SIDEBAR.COURSES.REPORT.NAME'
        },
        {
          'display': 'Courses.Enroll_Left_Users'
        }
      ];
    }
    if (this.toRouters.length === 4) {
      this.toRouters.splice(this.toRouters.length - 1, 1);
      delete this.toRouters[2]['link'];
    }
    if (this.cookieService.get('reportInfo')) {
      this.reportInfo = JSON.parse(this.cookieService.get('reportInfo'));
      this.service.loadCrsUserLeft({crsSig: _this.reportInfo.signature}).subscribe(resp => {
        _this.items = resp['data'];
        _this.items.forEach(item => {
          if (_this.usersList.indexOf(item.userId) < 0) {
            _this.usersList.push(item.userId);
          }
        });
      });
    }
  }

  generateLocation(item: any): any {
    const result = [];
    const line = [];
    const location = [];
    if (item.line1) {
      line.push(item.line1);
    }
    if (item.line2) {
      line.push(item.line2);
    }
    result.push(line.join(', '));
    if (item.city) {
      location.push(item.city);
    }
    if (item.region) {
      location.push(item.region);
    }
    if (item.country) {
      location.push(item.country);
    }
    result.push(location.join(', '));
    return {address: result[0], location: result[1]};
  }

  get getCreateDateInfo() {
    return this.utilsService.getCreateDateInfo;
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

  exportAsXLSX(): void {
    const _this = this;
    this.translate.get('MESSAGE.EnrollLeftUsersFileExport').subscribe(result => {
      const fieldName: Array<string> = result.split(',');
      const data = [];
      let i = 1;
      this.items.forEach(item => {
        const object = {
          name1: (i) ? ('0000000' + i).slice(-((_this.items.toString()).length)) : 0,
          name2: item.name,
          name3: _this.generateLocation(item).address +
            ((_this.generateLocation(item).location) ? (', ' + _this.generateLocation(item).location) : ''),
          name4: (item.enrollOn) ? this.utilsService.getNormalDateString(item.enrollOn) : '',
          name5: (item.lastActive) ? this.utilsService.getNormalDateString(item.lastActive) : '',
          name6: (item.progress) ? item.progress : 0
        };
        let fnI = 1;
        fieldName.forEach(fn => {
          const temp = 'name' + fnI;
          _this.utilsService.renameObjectKey(object, temp, fn);
          fnI++;
        });
        data.push(object);
        i++;
      });
      const displayName = this.toRouters[1].display.replace('Courses.', '');
      const fileName = displayName + '_' + this.utilsService.getNormalDateString2(new Date().toISOString()) +
        '_' + _this.utilsService.getLocale(_this.appState.locale.lang);
      this.excelService.exportAsExcelFile(data, fileName);
    });
  }
}
