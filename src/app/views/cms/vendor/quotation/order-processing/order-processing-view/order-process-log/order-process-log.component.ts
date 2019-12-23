import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PagerService} from '../../../../../../../services/pager.service';
import {CurriculumsService} from '../../../../../../../services/curriculums.service';
import {CookieService} from 'ngx-cookie';
import {AppState} from '../../../../../../../app-state.service';
import {TASKSTATUS} from '../../../../../../../models/task-status';
import {UtilsService} from '../../../../../../../services/utils.service';
import {ModalDirective} from '../../../../../../../lib/ng-uikit-pro-standard/free/modals';

@Component({
    selector: 'app-cms-vendor-order-process-log',
    templateUrl: './order-process-log.component.html',
    styleUrls: ['./order-process-log.component.scss']
})
export class OrderProcessLogComponent implements OnInit {
    cv: any;
    selectedUnit: any;
    selectedLog: any;
    unitsList: any;
    progress: any;
    decideList: Array<any> = [];
    toRouters: Array<any>;
    constructor(private router: Router,
                private route: ActivatedRoute,
                private cookieService: CookieService,
                private formBuilder: FormBuilder,
                private appState: AppState,
                private utilsService: UtilsService,
                private pagerService: PagerService,
                private service: CurriculumsService) {
    }
    ngOnInit() {
        this.cv = JSON.parse(this.cookieService.get('cvInfo'));
        this.service.loadCv({cvSig: this.cv.signature}).subscribe(cvData => {
            this.cv = cvData['data'];
            this.toRouters = [
                {
                    'link': '../../',
                    'display': 'SIDEBAR.QUOTATIONS.ORDER_PROCESSING.SalesOrders'
                },
                {
                    'link': '../',
                    'display': 'SIDEBAR.QUOTATIONS.ORDER_PROCESSING.PROGRESS'
                },
                {
                    'display': 'SIDEBAR.QUOTATIONS.ORDER_PROCESSING.LOGS'
                }
            ];
            this.unitsList = JSON.parse(this.cookieService.get('unitsListInfo'));
            if (this.cookieService.get('unitInfo')) {
                this.selectedUnit = JSON.parse(this.cookieService.get('unitInfo'));
            } else {
                this.selectedUnit = this.unitsList[0].signature;
            }
            this.service.loadCvTaskRqtList(
                {
                    cvSig: this.cv.signature,
                    unitSig: this.selectedUnit.signature
                }).subscribe(result => {
                this.selectedLog = result['data'];
            });
        });
    }

    get TASKSTATUS() {
        return TASKSTATUS;
    }

    save() {}

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
}
