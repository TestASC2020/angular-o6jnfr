import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PagerService} from '../../../../services/pager.service';
import {COURSECONTRACTSTATUS} from '../../../../models/course-contract-status';
import {CoursesService} from '../../../../services/courses.service';
import {CookieService} from 'ngx-cookie';
import {UtilsService} from '../../../../services/utils.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ModalDirective} from '../../../../lib/ng-uikit-pro-standard/free/modals';
import {DatePipe} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'app-courses-course-contract',
    templateUrl: './course-contract.component.html',
    styleUrls: ['./course-contract.component.scss']
})
export class CourseContractComponent implements OnInit {
    items: Array<any> = new Array<any>();
    courseInfo: any;
    addContractFormGroup: FormGroup;
    editContractFormGroup: FormGroup;
    selectedContract: any;
    error: any;
    success: any;
    searchText: string = '';
    @ViewChild('contractAddModal') contractAddModal: ModalDirective;
    @ViewChild('contractEditModal') contractEditModal: ModalDirective;
    @ViewChild('confirmModal') confirmModal: ModalDirective;
    @ViewChild('errorModal') errorModal: ModalDirective;
    // pager object
    currentPage: number = 0;
    enableMore: boolean = true;
    pager: any = {};
    pageSize: Array<number> = [5, 10, 15, 20, 25, 50, 75, 100, 150, 200];
    // paged items
    pagedItems: any[];
    rowsPerPage: number;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private cookieService: CookieService,
                private pagerService: PagerService,
                private utilsService: UtilsService,
                private datePipe: DatePipe,
                private formBuilder: FormBuilder,
                private spinner: NgxSpinnerService,
                private translate: TranslateService,
                private service: CoursesService) {
        this.addContractFormGroup = new FormGroup({
            name: new FormControl(''),
            startOn: new FormControl(''),
            endOn: new FormControl(''),
            saleAmt: new FormControl(0),
            discountRatio: new FormControl(0),
            shareRatio: new FormControl(0),
            minUseAmt: new FormControl(0),
            expiredInDays: new FormControl(0)
        });
        this.editContractFormGroup = new FormGroup({
            name: new FormControl(''),
            startOn: new FormControl(''),
            endOn: new FormControl(''),
            saleAmt: new FormControl(0),
            discountRatio: new FormControl(0),
            shareRatio: new FormControl(0),
            minUseAmt: new FormControl(0),
            expiredInDays: new FormControl(0)
        });
    }

    ngOnInit() {
        const _this = this;
        if (this.cookieService.get('courseInfo')) {
            this.courseInfo = JSON.parse(this.cookieService.get('courseInfo'));
            this.rowsPerPage = this.pageSize[0];
            this.loadRecords();
        }
    }

    loadRecords() {
        const _this = this;
        if (this.currentPage !== -1) {
            this.currentPage++;
            const sendData = {
                pageSz: Number.parseInt(this.rowsPerPage.toString(), 10),
                pageNo: this.currentPage,
                crsSig: this.courseInfo.signature
            };
            if (this.searchText) {
                sendData['name'] = this.searchText;
            }
            const len = this.items.length;
            this.service.loadCrsSaleOff(sendData).subscribe(result => {
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
                                if (_this.items.length <= 0 ||
                                    (_this.items.length > 0 && _this.items.map(u => u.no).indexOf(te.no) < 0)) {
                                    _this.items.push(te);
                                }
                            });
                            if (len === _this.items.length) {
                                _this.enableMore = false;
                            }
                        }
                    }, 0);
                }
            });
        } else {
            this.enableMore = false;
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

    get COURSECONTRACTSTATUS() {
        return COURSECONTRACTSTATUS;
    }

    get getCreateDateInfo() {
        return this.utilsService.getCreateDateInfo;
    }

    removeContract(contract: any) {
        this.selectedContract = contract;
        this.confirmModal.show();
    }

    removeSelectedContract() {
        const _this = this;
        const data = {
            contractSig: this.selectedContract.signature
        };
        this.service.removeCrsSaleOff(data).subscribe(
            resp => {
                if (resp['success'] === true) {
                    // update lại list contracts
                    _this.confirmModal.hide();
                    _this.reloadRecords();
                } else {
                    _this.error = resp['text'];
                    _this.confirmModal.hide();
                    _this.errorModal.show();
                }
            },
            err => {
                _this.error = err;
                _this.confirmModal.hide();
                _this.errorModal.show();
            }
        );
    }

    editContract(contract: any) {
        this.selectedContract = contract;
        this.editContractFormGroup.get('name').setValue(contract.name);
        this.editContractFormGroup.get('startOn').setValue((contract.startOn) ?
            this.datePipe.transform(contract.startOn, 'yyyy-MM-dd') : '');
        this.editContractFormGroup.get('endOn').setValue((contract.endOn) ?
            this.datePipe.transform(contract.endOn, 'yyyy-MM-dd') : '');
        this.editContractFormGroup.get('saleAmt').setValue((contract.saleAmt) ? contract.saleAmt : 0);
        this.editContractFormGroup.get('discountRatio').setValue((contract.discountRatio) ? contract.discountRatio : 0);
        this.editContractFormGroup.get('shareRatio').setValue((contract.shareRatio) ? contract.shareRatio : 0);
        this.editContractFormGroup.get('minUseAmt').setValue((contract.minUseAmt) ? contract.minUseAmt : 0);
        this.editContractFormGroup.get('expiredInDays').setValue((contract.expiredInDays) ? contract.expiredInDays : 0);
        this.contractEditModal.show();
    }

    addNewContract() {
        const _this = this;
        const data = {
            crsSig: this.courseInfo.signature,
            name: this.addContractFormGroup.get('name').value,
            startOn: (this.addContractFormGroup.get('startOn').value) ? new Date(this.addContractFormGroup.get('startOn').value) : null,
            endOn: (this.addContractFormGroup.get('endOn').value) ? new Date(this.addContractFormGroup.get('endOn').value) : null,
            saleAmt: (this.addContractFormGroup.get('saleAmt').value) ?
                JSON.parse(this.addContractFormGroup.get('saleAmt').value.toString()) : 0,
            discountRatio: (this.addContractFormGroup.get('discountRatio').value) ?
                JSON.parse(this.addContractFormGroup.get('discountRatio').value.toString()) : 0,
            shareRatio: (this.addContractFormGroup.get('shareRatio').value) ?
                JSON.parse(this.addContractFormGroup.get('shareRatio').value.toString()) : 0,
            minUseAmt: (this.addContractFormGroup.get('minUseAmt').value) ?
                JSON.parse(this.addContractFormGroup.get('minUseAmt').value.toString()) : 0,
            expiredInDays: (this.addContractFormGroup.get('expiredInDays').value) ?
                JSON.parse(this.addContractFormGroup.get('expiredInDays').value.toString()) : 0
        };
        this.service.addCrsSaleOff(data).subscribe(
            resp => {
                if (resp['success'] === true) {
                    _this.contractAddModal.hide();
                    _this.reloadRecords();
                } else {
                    _this.error = resp['text'];
                    _this.contractAddModal.hide();
                    _this.errorModal.show();
                }
                _this.contractAddModal.hide();
            },
            err => {
                _this.error = err;
                _this.contractAddModal.hide();
                _this.errorModal.show();
            }
        );
    }

    editSelectedContract() {
        const _this = this;
        const data = {
            contractSig: this.selectedContract.signature,
            name: this.editContractFormGroup.get('name').value,
            startOn: (this.editContractFormGroup.get('startOn').value) ? new Date(this.editContractFormGroup.get('startOn').value) : null,
            endOn: (this.editContractFormGroup.get('endOn').value) ? new Date(this.editContractFormGroup.get('endOn').value) : null,
            saleAmt: (this.editContractFormGroup.get('saleAmt').value) ?
                JSON.parse(this.editContractFormGroup.get('saleAmt').value.toString()) : 0,
            discountRatio: (this.editContractFormGroup.get('discountRatio').value) ?
                JSON.parse(this.editContractFormGroup.get('discountRatio').value.toString()) : 0,
            shareRatio: (this.editContractFormGroup.get('shareRatio').value) ?
                JSON.parse(this.editContractFormGroup.get('shareRatio').value.toString()) : 0,
            minUseAmt: (this.editContractFormGroup.get('minUseAmt').value) ?
                JSON.parse(this.editContractFormGroup.get('minUseAmt').value.toString()) : 0,
            expiredInDays: (this.editContractFormGroup.get('expiredInDays').value) ?
                JSON.parse(this.editContractFormGroup.get('expiredInDays').value.toString()) : 0
        };
        this.service.updateCrsSaleOff(data).subscribe(
            resp => {
                if (resp['success'] === true) {
                    // update lại list contracts
                    _this.contractEditModal.hide();
                    _this.updateValue(_this.items[_this.items.indexOf(_this.selectedContract)], data);
                } else {
                    _this.error = resp['text'];
                    _this.contractEditModal.hide();
                    _this.errorModal.show();
                }
            },
            err => {
                _this.error = err;
                _this.contractEditModal.hide();
                _this.errorModal.show();
            }
        );
    }

    updateValue(item: any, data: any) {
        item.name = data.name;
        item.startOn = data.startOn;
        item.endOn = data.endOn;
        item.saleAmt = data.saleAmt;
        item.discountRatio = data.discountRatio;
        item.shareRatio = data.shareRatio;
        item.minUseAmt = data.minUseAmt;
        item.expiredInDays = data.expiredInDays;
    }

    updateSearch($event: KeyboardEvent) {
        if ($event.which === 13) {
            this.reloadRecords();
            $event.preventDefault();
        }
    }
}
