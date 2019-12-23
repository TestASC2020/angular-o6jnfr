import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PagerService} from '../../../../../services/pager.service';
import {CurriculumsService} from '../../../../../services/curriculums.service';
import {CookieService} from 'ngx-cookie';
import {ModalDirective} from '../../../../../lib/ng-uikit-pro-standard/free/modals';
import {QUOTATIONSTATUS} from '../../../../../models/quotation-status';
import {UtilsService} from '../../../../../services/utils.service';

@Component({
    selector: 'app-cms-creator-curriculum-quotes',
    templateUrl: './curriculum-quotes.component.html',
    styleUrls: ['./curriculum-quotes.component.scss']
})
export class CurriculumQuotesComponent implements OnInit {
    quote: any;
    kind: number = 0;
    // kind = 1 : lesson
    // kind = 2 : exercise
    // kind = 3 : quiz
    lesson: any;
    exercise: any;
    quiz: any;
    quoteDetails: any;
    items: Array<any>;
    types: Array<any>;
    quoteApproveForm: FormGroup;
    quoteTerminateForm: FormGroup;
    decideList: Array<any>;
    // pager object
    pager: any = {};
    pageSize: Array<number> = [5, 10, 15, 20];
    // paged items
    pagedItems: any[];
    cv: any;
    stepAcceptDecline: number = 1;
    stepTerminate: number = 1;
    @ViewChild('viewQuoteModal') viewQuoteModal: ModalDirective;
    @ViewChild('terminateQuoteModal') terminateQuoteModal: ModalDirective;
    @ViewChild('acceptDeclineModal') acceptDeclineModal: ModalDirective;
    @ViewChild('quoteWasTerminatedModal') quoteWasTerminatedModal: ModalDirective;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private cookieService: CookieService,
        private service: CurriculumsService,
        private utilsService: UtilsService,
        private pagerService: PagerService) {
        this.types = [
            {
                value: 0,
                name: 'Unit 1 : Introduction to Forex'
            },
            {
                value: 1,
                name: 'Unit 2 : Buying and Selling'
            },
            {
                value: 2,
                name: 'Unit 3 : Chart Analysis'
            },
            {
                value: 3,
                name: 'Unit 4 : Technical Indicators'
            },
            {
                value: 4,
                name: 'Unit 5 : Fundamental Analysis'
            },
            {
                value: 5,
                name: 'Unit 6 : Assessment'
            }
        ];
        this.quoteApproveForm = new FormGroup({
            decide: new FormControl('', [Validators.required]),
            message: new FormControl('', [Validators.required])
        });
        this.quoteTerminateForm = new FormGroup({
            message: new FormControl('', [Validators.required])
        });
    }

    ngOnInit() {
        const _this = this;
        this.acceptDeclineModal.onShown.subscribe(re => {
            _this.quoteApproveForm.get('decide').setValue(_this.decideList[1].value);
           this.quoteApproveForm.markAsTouched();
            (document.getElementById('decide_4') as HTMLInputElement).checked = true;
        });
        this.decideList = [
            {
                value: 3,
                display: 'MESSAGE.ACCEPT',
                message: 'MESSAGE.QuoteAcceptedMessage'
            },
            {
                value: 4,
                display: 'MESSAGE.DECLINE',
                message: 'MESSAGE.QuoteRejectedMessage'
            }
        ];
        const quoteInfo = {
            decide: this.decideList[1].value,
            message: ''
        };
        this.quoteApproveForm.get('decide').setValue(quoteInfo.decide);
        this.quoteApproveForm.get('message').setValue(quoteInfo.message);
        this.cv = JSON.parse(this.cookieService.get('cvInfo'));
        this.service.loadCv({cvSig: this.cv.signature}).subscribe(result => {
            this.cv = result['data'];
            this.service.loadCvQuoteList({cvSig: this.cv.signature}).subscribe(result => {
                this.items = result['data'];
                this.setPage(1);
            });
        });
    }
    get QUOTATIONSTATUS() {
        return QUOTATIONSTATUS;
    }

    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }

        if (this.items.length < 1) {
            this.pagedItems = [];
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(this.items.length, page, this.pageSize[0]);

        // get current page of items
        this.pagedItems = this.items.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    updateCvInfo() {
    }

    viewQuote(item) {
        this.quote = item;
        this.viewQuoteModal.show();
    }

    chatQuote(item) {
        this.quote = item;
        console.log('chat for quote: ' + JSON.stringify(item));
    }

    terminateQuote(item) {
        this.quote = item;
        this.terminateQuoteModal.show();
        this.quoteTerminateForm = new FormGroup({
            message: new FormControl('', [Validators.required])
        });
    }

    terminateConfirmation() {
        const data = {
            quoteSig: this.quote.signature,
            description: this.quoteTerminateForm.get('message').value
        };
        this.service.terminateCvQuote(data).subscribe(resp => {
            this.quote.status = QUOTATIONSTATUS.TERMINATE.getValue();
            const index = this.items.map(it => it.signature).indexOf(this.quote.signature);
            this.items[index].status = QUOTATIONSTATUS.TERMINATE.getValue();
            this.pagedItems = this.items.slice(this.pager.startIndex, this.pager.endIndex + 1);
        });
    }

    acceptDecline(item) {
        this.quote = item;
        if (this.quote.status !== QUOTATIONSTATUS.TERMINATE.getValue() && this.quote.status !== QUOTATIONSTATUS.ACCEPT.getValue()) {
            this.acceptDeclineModal.show();
            const quoteInfo = {
                decide: this.decideList[0].value,
                message: ''
            };
            this.quoteApproveForm.get('decide').setValue(quoteInfo.decide);
            this.quoteApproveForm.get('message').setValue(quoteInfo.message);
        } else {
            this.quoteWasTerminatedModal.show();
        }
    }

    approve() {
        const data = {
            status: JSON.parse(this.quoteApproveForm.get('decide').value.toString()),
            description: this.quoteApproveForm.get('message').value,
            quoteSig: this.quote.signature
        };
        this.service.replyCvQuote(data).subscribe(resp => {
            this.quote.status = data.status;
            const index = this.items.map(it => it.signature).indexOf(this.quote.signature);
            this.items[index].status = data.status;
            this.pagedItems = this.items.slice(this.pager.startIndex, this.pager.endIndex + 1);
        });
    }

    gotoTabAcceptDecline(tabId) {
        this.stepAcceptDecline = tabId;
    }

    gotoTabTerminate(tabId) {
        this.stepTerminate = tabId;
    }

    showUnitsDetailForAcceptDeclineTab() {
        this.stepAcceptDecline++;
    }

    showUnitsDetailForTerminateTab() {
        this.stepTerminate++;
    }

    showUnitsLessonDetailForAcceptDeclineTab() {
        this.stepAcceptDecline++;
        this.kind = 1;
        this.lesson = JSON.parse(this.cookieService.get('lessonInfo'));
    }

    showUnitsLessonDetailForTerminateTab() {
        this.stepTerminate++;
        this.kind = 1;
        this.lesson = JSON.parse(this.cookieService.get('lessonInfo'));
    }

    showUnitsExerciseDetailForAcceptDeclineTab() {
        this.stepAcceptDecline++;
        this.kind = 2;
        this.exercise = JSON.parse(this.cookieService.get('exerciseInfo'));
    }

    showUnitsExerciseDetailForTerminateTab() {
        this.stepTerminate++;
        this.kind = 2;
        this.exercise = JSON.parse(this.cookieService.get('exerciseInfo'));
    }

    showUnitsExerciseDetailFullForAcceptDeclineTab() {
        this.stepAcceptDecline++;
        this.kind = 2;
        this.exercise = JSON.parse(this.cookieService.get('exerciseInfo'));
    }

    showUnitsExerciseDetailFullForTerminateTab() {
        this.stepTerminate++;
        this.kind = 2;
        this.exercise = JSON.parse(this.cookieService.get('exerciseInfo'));
    }

    showUnitsQuizDetailForAcceptDeclineTab() {
        this.stepAcceptDecline++;
        this.kind = 3;
        this.quiz = JSON.parse(this.cookieService.get('questionInfo'));
    }

    showUnitsQuizDetailForTerminateTab() {
        this.stepTerminate++;
        this.kind = 3;
        this.quiz = JSON.parse(this.cookieService.get('questionInfo'));
    }

    showUnitsQuizDetailFullForAcceptDeclineTab() {
        this.stepAcceptDecline++;
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
