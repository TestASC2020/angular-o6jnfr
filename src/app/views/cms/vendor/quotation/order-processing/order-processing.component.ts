import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QUOTATIONSTATUS } from '../../../../../models/quotation-status';
import { QuotationService } from '../../../../../services/quotation.service';
import { CookieService } from 'ngx-cookie';
import { UtilsService } from '../../../../../services/utils.service';
import { ModalDirective } from '../../../../../lib/ng-uikit-pro-standard/free/modals';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CurriculumsService } from '../../../../../services/curriculums.service';
import { PreloaderService } from 'src/app/shared/pre-loader/service/pre-loader.service';

@Component({
    selector: 'app-order-processing',
    templateUrl: './order-processing.component.html',
    styleUrls: ['./order-processing.component.scss']
})
export class OrderProcessingComponent implements OnInit {
    @ViewChild('terminateQuoteModal') terminateQuoteModal: ModalDirective;
    @ViewChild('cancelModal') cancelModal: ModalDirective;
    items: Array<any> = new Array<any>();
    currentPage: number = 0;
    enableMore: boolean = true;
    selectedStatus: any = '-1';
    searchText: string = '';
    toRouters: Array<any>;
    stepTerminate: number = 1;
    quote: any;
    kind: number = 0;
    // kind = 1 : lesson
    // kind = 2 : exercise
    // kind = 3 : quiz
    lesson: any;
    exercise: any;
    quiz: any;
    quoteTerminateForm: FormGroup;
    pageSizes: Array<number> = [5, 10, 15, 20, 25];
    rowsPerPage: number;

    constructor(
        private service: QuotationService,
        private utilsService: UtilsService,
        private curriculumService: CurriculumsService,
        private cookieService: CookieService,
        private preloaderService: PreloaderService) {
        this.toRouters = [
            {
                'display': 'SIDEBAR.QUOTATIONS.ORDER_PROCESSING.SalesOrders'
            }
        ];
        this.quoteTerminateForm = new FormGroup({
            message: new FormControl('', [Validators.required])
        });
    }

    ngOnInit() {
        this.rowsPerPage = this.pageSizes[0];
        this.reloadRecords();
    }

    get QUOTATIONSTATUS() {
        return QUOTATIONSTATUS;
    }

    updateSelectedStatus() {
        if (this.selectedStatus === '-1') {
            this.searchText = '';
        } else {
            this.searchText = this.selectedStatus.toString();
        }
    }

    terminate(item) {
        this.quote = item;
        this.terminateQuoteModal.show();
        this.quoteTerminateForm = new FormGroup({
            message: new FormControl('', [Validators.required])
        });
    }

    terminateConfirmation() {
        const data = {
            quoteSig: this.quote.quoteSig,
            description: this.quoteTerminateForm.get('message').value
        };
        this.curriculumService.terminateCvQuote(data).subscribe(resp => {
            this.quote.status = QUOTATIONSTATUS.TERMINATE.getValue();
            const index = this.items.map(it => it.quoteSig).indexOf(this.quote.quoteSig);
            this.items[index].status = QUOTATIONSTATUS.TERMINATE.getValue();
        });
    }

    loadRecords() {
        if (this.currentPage !== -1) {
            this.currentPage++;
            this.preloaderService.enableLoading();
            this.service.loadApproveRqtQuote({ pageSz: Number.parseInt(this.rowsPerPage.toString(), 10), pageNo: this.currentPage })
                .subscribe(
                    result => {
                        this.preloaderService.disableLoading();
                        const temp = (result['data'] && result['data'].length > 0) ? result['data'] : [];
                        if (temp.length === 0) {
                            this.enableMore = false;
                            this.currentPage = -1;
                        } else {
                            if (temp.length < this.rowsPerPage) {
                                this.enableMore = false;
                            } else {
                                this.enableMore = true;
                            }
                            temp.forEach(te => {
                                this.items.push(te);
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
        if (this.searchText === '') {
            return true;
        } else {
            return (item.description && item.description.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0) ||
                (item.createBy && item.createBy.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0) ||
                p1.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0 ||
                p2.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0 ||
                p3.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0 ||
                p4.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0;
        }
    }

    get getCreateDateInfo() {
        return this.utilsService.getCreateDateInfo;
    }

    gotoTabTerminate(tabId) {
        this.stepTerminate = tabId;
    }

    showUnitsDetailForTerminateTab() {
        this.stepTerminate++;
    }

    showUnitsLessonDetailForTerminateTab() {
        this.stepTerminate++;
        this.kind = 1;
        this.lesson = JSON.parse(this.cookieService.get('lessonInfo'));
    }

    showUnitsExerciseDetailForTerminateTab() {
        this.stepTerminate++;
        this.kind = 2;
        this.exercise = JSON.parse(this.cookieService.get('exerciseInfo'));
    }

    showUnitsExerciseDetailFullForTerminateTab() {
        this.stepTerminate++;
        this.kind = 2;
        this.exercise = JSON.parse(this.cookieService.get('exerciseInfo'));
    }

    showUnitsQuizDetailForTerminateTab() {
        this.stepTerminate++;
        this.kind = 3;
        this.quiz = JSON.parse(this.cookieService.get('questionInfo'));
    }

    showUnitsQuizDetailFullForTerminateTab() {
        this.stepTerminate++;
        this.kind = 3;
        this.quiz = JSON.parse(this.cookieService.get('questionInfo'));
    }

    get shortString() {
        return this.utilsService.shortString;
    }
}
