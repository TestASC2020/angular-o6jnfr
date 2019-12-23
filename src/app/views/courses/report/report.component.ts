import {Component, OnInit, ViewChild} from '@angular/core';
import {UtilsService} from '../../../services/utils.service';
import {CoursesService} from '../../../services/courses.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalDirective} from '../../../lib/ng-uikit-pro-standard/free/modals';
import {ReportTypes} from '../../../models/report-types';
import {ReportPeriods} from '../../../models/report-periods';
import {CookieService} from 'ngx-cookie';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
    items: Array<any> = new Array<any>();
    reportTypesList: Array<any> = new Array<any>();
    reportPeriodsList: Array<any> = new Array<any>();
    selectedReportType: any;
    selectedReportPeriod: any;
    tutorFormGroup: FormGroup;
    staffs_list: Array<any>;
    const_staffs_list: Array<any>;
    searchText: string = '';
    totalEncrollQty = 0;
    totalLeftQty = 0;
    totalDiscussion = 0;
    totalUsers = 0;
    totalInvolved = 0;
    totalScore = 0;
    totalExcellent = 0;
    totalGood = 0;
    totalAverage = 0;
    totalFair = 0;
    totalPoor = 0;
    toRouters: Array<any>;
    tutorDisplay: string =  'block';
    @ViewChild('tutorsModal') tutorsModal: ModalDirective;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private utilsService: UtilsService,
                private cookieService: CookieService,
                private service: CoursesService) {
        this.items = [];
        this.staffs_list = [];
        this.tutorFormGroup = new FormGroup({
            tutor: new FormControl('', [Validators.required]),
            tutor_email: new FormControl('', [Validators.required])
        });
    }

    ngOnInit() {
        const _this = this;
        this.service.loadReportType({}).subscribe(reportTypeData => {
            _this.reportTypesList = reportTypeData['data'];
            _this.selectedReportType = _this.reportTypesList[0].tag;
            this.service.loadReportPeriod({}).subscribe(reportPeriodData => {
                _this.reportPeriodsList = reportPeriodData['data'];
                _this.selectedReportPeriod = _this.reportPeriodsList[3].tag;
                this.service.loadTutors({}).subscribe(reportTutorData => {
                    _this.const_staffs_list = reportTutorData['data'];
                    _this.const_staffs_list.forEach(item => {
                        _this.staffs_list.push(item);
                    });
                    _this.updateReportType();
                    _this.searchNow();
                });
            });
        });
    }
    get getCreateDateInfo() {
        return this.utilsService.getCreateDateInfo;
    }

    updateAuthor(staff) {
        this.tutorsModal.hide();
        this.tutorFormGroup.get('tutor').setValue(staff.name);
        this.tutorFormGroup.get('tutor_email').setValue(staff.id);
        this.searchText = '';
        this.searchNow();
        this.tutorDisplay = this.checkTutorExistReverse();
    }

    updateReportType() {
        this.toRouters = [
            {
                'link': '/courses/course-list',
                'display': 'Courses.Course'
            },
            {
                'display': 'Courses.Report'
            }
        ];
    }

    searchNow() {
        const _this = this;
        const tutorId = this.tutorFormGroup.get('tutor_email').value;
        let data: any;
        if (tutorId !== '' && tutorId !== undefined) {
            const index = this.const_staffs_list.map(item => item.id).indexOf(tutorId);
            data = {
                tutorSig: this.const_staffs_list[index].signature
            };
        } else {
            data = {};
        }
        if (this.selectedReportType.toString() === '1') { // Encroll/Left
            this.service.getCrsEnrollLeft(data).subscribe(resp => {
                _this.items = (resp['data'].length > 0) ? _this.getValidDataFromPeriod(resp['data'], _this.selectedReportPeriod) : [];
                _this.totalEncrollQty = 0;
                _this.totalLeftQty = 0;
                if (_this.items.length > 0) {
                    _this.items.forEach(it => {
                        _this.totalEncrollQty += it.enrollQty;
                        _this.totalLeftQty += it.leftQty;
                    });
                }
            });
        } else if (this.selectedReportType.toString() === '2') { // Discussion
            this.service.getCrsDiscussion(data).subscribe(resp => {
                _this.items = (resp['data'].length > 0) ? _this.getValidDataFromPeriod(resp['data'], _this.selectedReportPeriod) : [];
                _this.totalDiscussion = 0;
                _this.totalUsers = 0;
                _this.totalInvolved = 0;
                if (_this.items.length > 0) {
                    _this.items.forEach(it => {
                        _this.totalDiscussion += it.discussion;
                        _this.totalUsers += it.totalUser;
                        _this.totalInvolved += it.involved;
                    });
                }
            });
        } else if (this.selectedReportType.toString() === '3') { // Feedback
            this.service.getCrsFeedback(data).subscribe(resp => {
                _this.items = resp['data'];
                _this.totalUsers = 0;
                _this.totalInvolved = 0;
                _this.totalScore = 0;
                _this.totalExcellent = 0;
                _this.totalGood = 0;
                _this.totalAverage = 0;
                _this.totalFair = 0;
                _this.totalPoor = 0;
                if (_this.items.length > 0) {
                    _this.items.forEach(it => {
                        _this.totalUsers += it.totalUser;
                        _this.totalInvolved += it.involved;
                        _this.totalScore += it.rank;
                        _this.totalExcellent += ((it.ranks && it.ranks['5']) ? it.ranks['5'] : 0);
                        _this.totalGood += ((it.ranks && it.ranks['4']) ? it.ranks['4'] : 0);
                        _this.totalAverage += ((it.ranks && it.ranks['3']) ? it.ranks['3'] : 0);
                        _this.totalFair += ((it.ranks && it.ranks['2']) ? it.ranks['2'] : 0);
                        _this.totalPoor += ((it.ranks && it.ranks['1']) ? it.ranks['1'] : 0);
                    });
                }
            });
        }
    }

    getValidDataFromPeriod(items: Array<any>, period: number | string): Array<any> {
        const result = [];
        const _this = this;
        items.forEach(item => {
            if ((period + '') === '1') {
                if (_this.utilsService.checkInThisWeek(item.openOn)) {
                    result.push(item);
                }
            } else if ((period + '') === '2') {
                if (_this.utilsService.checkInThisMonth(item.openOn)) {
                    result.push(item);
                }
            } else if ((period + '') === '3') {
                if (_this.utilsService.checkInThisQuarter(item.openOn)) {
                    result.push(item);
                }
            }  else {
                if (_this.utilsService.checkInThisYear(item.openOn)) {
                    result.push(item);
                }
            }
        });
        return result;
    }

    getItemPercentage(item) {
        if (item.enrollQty === 0 && item.leftQty === 0) {
            return 0;
        }
        const result = (item.enrollQty * 100 / (item.enrollQty + item.leftQty));
        if (result % 1 === 0) {
            return result;
        }
        return result.toFixed(2);
    }

    getTypeTitle() {
        if (this.selectedReportType.toString() === '1') {
            return 'MESSAGE.EnrollLeft';
        } else if (this.selectedReportType.toString() === '2') {
            return 'MESSAGE.Discussion';
        }
        return 'MESSAGE.Feedback';
    }

    get ReportTypes() {
        return ReportTypes;
    }

    get ReportPeriods() {
        return ReportPeriods;
    }

    removeTutor() {
        this.tutorFormGroup.get('tutor').setValue('');
        this.tutorFormGroup.get('tutor_email').setValue('');
        this.searchNow();
        this.tutorDisplay = 'block';
    }

    checkTutorExist() {
        if (this.tutorFormGroup.get('tutor').value) {
            return 'block';
        }
        return 'none';
    }

    checkTutorExistReverse() {
        if (this.tutorFormGroup.get('tutor').value) {
            return 'none';
        }
        return 'block';
    }

    switchToEnrollLeftUser(item) {
      const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
      this.cookieService.put('reportInfo', JSON.stringify({signature: item.signature, name: item.crsName, id: item.id}), opt);
      const toRouters = [
        {
          'link': '../../course-list',
          'display': 'Courses.Course'
        },
        {
          'link': '../',
          'display': 'Courses.Report'
        },
        {
          'display': 'Courses.Enroll_Left_Users'
        },
      ];
      this.cookieService.put('toRouters', JSON.stringify(toRouters), opt);
      this.router.navigate(['courses/report/report-enroll-left-user']);
    }
}
