import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PagerService} from '../../../../../../services/pager.service';
import {CurriculumsService} from '../../../../../../services/curriculums.service';
import {CookieService} from 'ngx-cookie';
import {AppState} from '../../../../../../app-state.service';
import {TASKSTATUS} from '../../../../../../models/task-status';
import {UtilsService} from '../../../../../../services/utils.service';
import {ModalDirective} from '../../../../../../lib/ng-uikit-pro-standard/free/modals';

@Component({
    selector: 'app-cms-creator-curriculum-progress-log',
    templateUrl: './curriculum-progress-log.component.html',
    styleUrls: ['./curriculum-progress-log.component.scss']
})
export class CurriculumProgressLogComponent implements OnInit {
    cv: any;
    selectedUnit: any;
    selectedLog: any;
    logToView: any;
    unitsList: any;
    progress: any;
    decideList: Array<any> = [];
    toRouters: Array<any>;
    approveForm: FormGroup;
    @ViewChild('progressLogModal') progressLogModal: ModalDirective;
    constructor(private router: Router,
                private route: ActivatedRoute,
                private cookieService: CookieService,
                private formBuilder: FormBuilder,
                private appState: AppState,
                private utilsService: UtilsService,
                private pagerService: PagerService,
                private service: CurriculumsService) {
        this.decideList = [
            {
                value: 3,
                display: 'MESSAGE.APPROVED',
                message: 'MESSAGE.LogApprovedMessage'
            },
            {
                value: 4,
                display: 'MESSAGE.REJECTED',
                message: 'MESSAGE.LogRejectedMessage'
            }
        ];
        const approveInfo = {
            decide: this.decideList[1].value,
            message: ''
        };
        this.approveForm = new FormGroup({
            decide: new FormControl('', [Validators.required]),
            message: new FormControl('', [Validators.required])
        });
        this.approveForm.get('decide').setValue(approveInfo.decide);
        this.approveForm.get('message').setValue(approveInfo.message);
    }
    ngOnInit() {
        const _this = this;
        this.progressLogModal.onShown.subscribe(re => {
            _this.approveForm.get('decide').setValue(_this.decideList[1].value);
            this.approveForm.markAsTouched();
            (document.getElementById('decide_4') as HTMLInputElement).checked = true;
        });
        _this.cv = JSON.parse(_this.cookieService.get('cvInfo'));
        _this.service.loadCv({cvSig: _this.cv.signature}).subscribe(cvData => {
            _this.cv = cvData['data'];
            _this.toRouters = [
                {
                    'link': '../../',
                    'display': 'CREATOR.CURRICULUMS.LIST.Curriculums'
                },
                {
                    'link': '../',
                    'display': 'CREATOR.CURRICULUMS.progress'
                },
                {
                    'display': 'SIDEBAR.QUOTATIONS.ORDER_PROCESSING.LOGS'
                }
            ];
            _this.unitsList = JSON.parse(_this.cookieService.get('unitsListInfo'));
            if (_this.cookieService.get('unitInfo')) {
                _this.selectedUnit = JSON.parse(_this.cookieService.get('unitInfo'));
            } else {
                _this.selectedUnit = _this.unitsList[0].signature;
            }
            _this.service.loadCvTaskRqtList(
                {
                    cvSig: _this.cv.signature,
                    unitSig: _this.selectedUnit.signature
                }).subscribe(result => {
                _this.selectedLog = result['data'];
            });
        });
    }

    get TASKSTATUS() {
        return TASKSTATUS;
    }

    approveData() {
        const data = {
            status: JSON.parse(this.approveForm.get('decide').value.toString()),
            description: this.approveForm.get('message').value,
            taskSig: this.logToView.signature
        };
        this.service.replyTaskFeedback(data).subscribe(resp => {
            this.logToView.status = data.status;
            const index = this.selectedLog.map(it => it.signature).indexOf(this.logToView.signature);
            this.selectedLog[index].status = data.status;
        });
    }

    changeSelectedUnit($event) {
        this.selectedUnit = $event.target.value;
        this.service.loadCvTaskRqtList(
            {
                cvSig: this.cv.signature,
                unitSig: this.selectedUnit
            }).subscribe(result => {
            this.selectedLog = result['data'];
        });
    }

    get getCreateDateInfo() {
        return this.utilsService.getCreateDateInfo;
    }

    approve(log) {
        if (log.status === 2) {
            this.logToView = log;
            this.progressLogModal.show();
            const approveInfo = {
                decide: this.decideList[0].value,
                message: ''
            };
            this.approveForm.get('decide').setValue(approveInfo.decide);
            this.approveForm.get('message').setValue(approveInfo.message);
        }
    }
}