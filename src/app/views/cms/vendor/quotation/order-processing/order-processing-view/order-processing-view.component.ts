import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {QuotationService} from '../../../../../../services/quotation.service';
import {CookieService} from 'ngx-cookie';
import {ModalDirective} from '../../../../../../lib/ng-uikit-pro-standard/free/modals';
import {TASKSTATUS} from '../../../../../../models/task-status';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CurriculumsService} from '../../../../../../services/curriculums.service';
import {AppState} from '../../../../../../app-state.service';

@Component({
    selector: 'app-cms-vendor-order-processing-order-processing-view',
    templateUrl: './order-processing-view.component.html',
    styleUrls: ['./order-processing-view.component.scss']
})
export class OrderProcessingViewComponent implements OnInit {
    cvQuote: any;
    quoteSig: string = '';
    message: string = '';
    selectedUnitIndex: number = 0;
    cvQuoteProgress: any;
    toRouters: Array<any>;
    unitInfoForm: FormGroup;
    unitInfoEditForm: FormGroup;
    groupForm: FormGroup;
    selectedUnit: any;
    selectedGroupItem: any;
    removeDataItem: any;
    @ViewChild('send') send: ModalDirective;
    @Input() thirdFormGroup: FormGroup;
    @ViewChild('curriculumUnitInfo') curriculumUnitInfo: ModalDirective;
    @ViewChild('curriculumUnitInfoEdit') curriculumUnitInfoEdit: ModalDirective;
    @ViewChild('confirmDeleteUnitModal') confirmDeleteUnitModal: ModalDirective;
    @ViewChild('removeLessonModal') removeLessonModal: ModalDirective;
    @ViewChild('removeExerciseModal') removeExerciseModal: ModalDirective;
    @ViewChild('removeQuizModal') removeQuizModal: ModalDirective;
    @ViewChild('groupItemDescription') groupItemDescription: ModalDirective;
    @ViewChild('groupCreate') groupCreate: ModalDirective;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private quotationService: QuotationService,
        private formBuilder: FormBuilder,
        private service: CurriculumsService,
        private cookieService: CookieService,
        private appState: AppState) {
        this.thirdFormGroup = new FormGroup({});
        this.unitInfoForm = new FormGroup({
            name: new FormControl('', [Validators.required]),
            description: new FormControl('', [Validators.required]),
            prerequisites: this.formBuilder.group({})
        });
        this.unitInfoEditForm = new FormGroup({
            name: new FormControl('', [Validators.required]),
            description: new FormControl('', [Validators.required]),
            prerequisites: this.formBuilder.group({})
        });
        this.groupForm = new FormGroup({
            name: new FormControl('', [Validators.required])
        });
        this.toRouters = [
            {
                'link': '../',
                'display': 'SIDEBAR.QUOTATIONS.ORDER_PROCESSING.SalesOrders'
            },
            {
                'display': 'SIDEBAR.QUOTATIONS.ORDER_PROCESSING.PROGRESS'
            }
        ];
    }

    ngOnInit() {
        if (this.cookieService.get('orderInfo')) {
            this.cvQuote = JSON.parse(this.cookieService.get('orderInfo'));
            this.quotationService.loadCurriculumQuote({quoteSig: this.cvQuote.signature}).subscribe(resp => {
                this.cvQuoteProgress = resp['data'] ;
                this.quoteSig = this.cvQuoteProgress['quoteSignature'];
            });
        }
    }

    get TASKSTATUS() {
        return TASKSTATUS;
    }

    sendSubmitData() {
        const data = {
            quoteSig: this.quoteSig,
            itemSig: this.selectedUnit.signature,
            description: this.message
        };
        this.quotationService.addTaskFeedback(data).subscribe(resp => {
            const units = this.cvQuoteProgress.units.map(item => item.signature);
            const index = units.indexOf(this.selectedUnit.signature);
            if (index >= 0) {
                this.cvQuoteProgress.units[index]['taskStatus'] = resp['data']['status'];
            }
            this.message = '';
        });
    }

    submitUnit(unit) {
        this.selectedUnit = unit;
        this.send.show();
    }

    logsUnit(unit_) {
        if (unit_.taskStatus !== TASKSTATUS.ACCEPT.getValue() && unit_.taskStatus !== TASKSTATUS.SUBMIT.getValue()) {
            this.selectedUnit = unit_;
            const opt = {expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate())};
            this.cookieService.put('cvInfo', JSON.stringify({signature: this.cvQuoteProgress.signature}), opt);
            const unit = {
                name: unit_.name,
                signature: unit_.signature
            };
            const unitsList = [];
            this.cvQuoteProgress.units.forEach(un => {
                const uni = {
                    name: un.name,
                    signature: un.signature
                };
                unitsList.push(uni);
            });
            this.cookieService.put('unitInfo', JSON.stringify(unit), opt);
            this.cookieService.put('unitsListInfo', JSON.stringify(unitsList), opt);
            this.router.navigate(['cms/vendor/quotation/order-processing/order-processing-view/logs']);
        }
    }

    openCreateArea(index) {
        this.selectedUnitIndex = index;
        this.selectedUnit = this.cvQuoteProgress.units[index];
        this.groupCreate.show();
    }

    addType(index) {
        const gName = (document.getElementById('name_' + index) as HTMLInputElement).value;
        const gType = (document.getElementById('type_' + index) as HTMLSelectElement).value;

        const data = {
            name: gName,
            unitSig: this.cvQuoteProgress.units[index]['signature']
        };
        switch (gType) {
            case 'Lesson': {
                data['no'] = (this.cvQuoteProgress.units[index]['lessonGroup'] &&
                    this.cvQuoteProgress.units[index]['lessonGroup'].length > 0) ?
                    (this.cvQuoteProgress.units[index]['lessonGroup'].length + 1) : 1;
                this.service.addCvLessonGroup(data).subscribe(resLesson => {
                    (document.getElementById('name_' + index) as HTMLInputElement).setAttribute('value', '');
                    if (!this.cvQuoteProgress.units[index]['lessonGroup']) {
                        this.cvQuoteProgress.units[index]['lessonGroup'] = [];
                    }
                    this.cvQuoteProgress.units[index]['lessonGroup'].push(resLesson['data']);
                    this.groupCreate.hide();
                });
                break;
            }
            case 'Exercise': {
                data['no'] = (this.cvQuoteProgress.units[index]['exerciseGroup'] &&
                    this.cvQuoteProgress.units[index]['exerciseGroup'].length > 0) ?
                    (this.cvQuoteProgress.units[index]['exerciseGroup'].length + 1) : 1;
                this.service.addCvExerciseGroup(data).subscribe(resExercise => {
                    (document.getElementById('name_' + index) as HTMLInputElement).setAttribute('value', '');
                    if (!this.cvQuoteProgress.units[index]['exerciseGroup']) {
                        this.cvQuoteProgress.units[index]['exerciseGroup'] = [];
                    }
                    this.cvQuoteProgress.units[index]['exerciseGroup'].push(resExercise['data']);
                    this.groupCreate.hide();
                });
                break;
            }
            case 'Quiz': {
                data['no'] = (this.cvQuoteProgress.units[index]['quizGroup'] && this.cvQuoteProgress.units[index]['quizGroup'].length > 0) ?
                    (this.cvQuoteProgress.units[index]['quizGroup'].length + 1) : 1;
                this.service.addCvQuizGroup(data).subscribe(resQuiz => {
                    (document.getElementById('name_' + index) as HTMLInputElement).setAttribute('value', '');
                    if (!this.cvQuoteProgress.units[index]['quizGroup']) {
                        this.cvQuoteProgress.units[index]['quizGroup'] = [];
                    }
                    this.cvQuoteProgress.units[index]['quizGroup'].push(resQuiz['data']);
                    this.groupCreate.hide();
                });
                break;
            }
        }
    }

    confirmDeleteUnit(unit: any) {
        this.selectedUnit = unit;
        this.confirmDeleteUnitModal.show();
    }

    removeUnit() {
        const unit = this.selectedUnit;
        const index = this.cvQuoteProgress.units.map(it => it.signature).indexOf(unit['signature']);
        this.service.removeCvUnit({unitSig:  unit['signature']}).subscribe(res => {
            const arr = this.cvQuoteProgress.units.map(item => item.signature);
            (this.cvQuoteProgress.units as Array<any>).splice(arr.indexOf(this.selectedUnit.signature), 1);
            this.updateReferencesUnitPrerequisites(index, unit['no']);
        });
    }

    updateReferencesUnitPrerequisites(deletedUnitIndex: number, deletedUnitNo: number) {
        if (deletedUnitNo) {
            for (let i = deletedUnitIndex; i < this.cvQuoteProgress.units.length; i++) {
                if (this.cvQuoteProgress.units[i]['prerequisites'] && this.cvQuoteProgress.units[i]['prerequisites'].length > 0) {
                    if (this.cvQuoteProgress.units[i]['prerequisites'].indexOf(deletedUnitNo) >= 0) {
                        const index = this.cvQuoteProgress.units[i]['prerequisites'].indexOf(deletedUnitNo);
                        this.cvQuoteProgress.units[i]['prerequisites'].splice(index, 1);
                        const data = {
                            cvSig: this.cvQuoteProgress.signature,
                            description: this.unitInfoEditForm.get('description').value,
                            lang: this.appState.locale.lang,
                            name: (this.cvQuoteProgress.units[i]['name']) ? this.cvQuoteProgress.units[i]['name'] : '',
                            prerequisites: this.cvQuoteProgress.units[i]['prerequisites'],
                            unitSig: this.cvQuoteProgress.units[i]['signature']
                        };
                        this.service.updateCvUnit(data).subscribe(res => {
                        });
                    }
                }
            }
            this.unitInfoEditForm = new FormGroup({
                name: new FormControl('', [Validators.required]),
                description: new FormControl('', [Validators.required]),
                prerequisites: this.formBuilder.group({})
            });
        }
    }

    createUnit() {
        const prerequisites = this.unitInfoForm.get('prerequisites').value;
        const prerequisitesArr: Array<number> = new Array<number>();
        Object.keys(prerequisites).forEach(key => {
            if (prerequisites[key]) {
                prerequisitesArr.push(Number.parseInt(key, 10));
            }
        });
        const data = {
            cvSig: this.cvQuoteProgress.signature,
            description: this.unitInfoForm.get('description').value,
            lang: this.appState.locale.lang,
            name: this.unitInfoForm.get('name').value,
            prerequisites: prerequisitesArr,
            no: this.cvQuoteProgress.units.length + 1
        };
        this.service.addCvUnit(data).subscribe(res => {
            this.cvQuoteProgress.units.push(res['data']);
            this.unitInfoForm = new FormGroup({
                name: new FormControl('', [Validators.required]),
                description: new FormControl('', [Validators.required]),
                prerequisites: this.formBuilder.group({})
            });
        });
    }

    updateUnit() {
        const prerequisites = this.unitInfoEditForm.get('prerequisites').value;
        const prerequisitesArr: Array<number> = new Array<number>();
        Object.keys(prerequisites).forEach(key => {
            if (prerequisites[key]) {
                prerequisitesArr.push(Number.parseInt(key, 10));
            }
        });
        const data = {
            cvSig: this.cvQuoteProgress.signature,
            description: this.unitInfoEditForm.get('description').value,
            lang: this.appState.locale.lang,
            name: this.unitInfoEditForm.get('name').value,
            prerequisites: prerequisitesArr,
            unitSig: this.selectedUnit['signature']
        };
        this.service.updateCvUnit(data).subscribe(res => {
            const index = this.cvQuoteProgress.units.map(it => it.signature).indexOf(this.selectedUnit['signature']);
            this.cvQuoteProgress.units[index]['name'] = data.name;
            this.cvQuoteProgress.units[index]['description'] = data.description;
            this.cvQuoteProgress.units[index]['prerequisites'] = data.prerequisites;
            this.unitInfoEditForm = new FormGroup({
                name: new FormControl('', [Validators.required]),
                description: new FormControl('', [Validators.required]),
                prerequisites: this.formBuilder.group({})
            });
        });
    }

    openUnitInfoEditModal(unit) {
        this.unitInfoEditForm = new FormGroup({
            name: new FormControl('', [Validators.required]),
            description: new FormControl('', [Validators.required]),
            prerequisites: this.formBuilder.group({})
        });
        this.selectedUnit = unit;
        const unitIndex = this.cvQuoteProgress.units.map(u => u.signature).indexOf(unit.signature);
        for (let i = 0; i < unitIndex; i++) {
            const prerequisites = <FormGroup>this.unitInfoEditForm.get('prerequisites');
            let check = false;
            if (unit.prerequisites.length > 0) {
                check = !(unit.prerequisites.indexOf(this.cvQuoteProgress.units[i]['no']) < 0);
                prerequisites.addControl((this.cvQuoteProgress.units[i]['no']).toString(), new FormControl(check));
            } else {
                prerequisites.addControl((this.cvQuoteProgress.units[i]['no']).toString(), new FormControl(false));
            }
        }
        this.unitInfoEditForm.get('name').setValue(unit.name);
        this.unitInfoEditForm.get('description').setValue(unit.description);
        this.curriculumUnitInfoEdit.show();
    }

    openUnitInfoModal() {
        this.unitInfoForm = new FormGroup({
            name: new FormControl('', [Validators.required]),
            description: new FormControl('', [Validators.required]),
            prerequisites: this.formBuilder.group({})
        });
        for (let i = 0; i < this.cvQuoteProgress.units.length; i++) {
            const prerequisites = <FormGroup>this.unitInfoForm.get('prerequisites');
            let check = false;
            if (this.cvQuoteProgress.units[i]['prerequisites'] && this.cvQuoteProgress.units[i]['prerequisites'].length > 0) {
                check = !(this.cvQuoteProgress.units[i]['prerequisites'].indexOf(this.cvQuoteProgress.units[i]['no']) < 0);
                prerequisites.addControl((this.cvQuoteProgress.units[i]['no']).toString(), new FormControl(check));
            } else {
                prerequisites.addControl((this.cvQuoteProgress.units[i]['no']).toString(), new FormControl(false));
            }
        }
        this.curriculumUnitInfo.show();
    }

    editLesson(index, lesson) {
        this.cookieService.remove('exerciseInfo');
        this.cookieService.remove('questionInfo');
        const sendLesson = {
            signature: lesson.signature,
            name: lesson.name,
            unitSig: this.cvQuoteProgress.units[index]['signature'],
            unitName: this.cvQuoteProgress.units[index]['name'],
            cvName: this.cvQuoteProgress.name
        };
        const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
        this.cookieService.put('lessonInfo', JSON.stringify(sendLesson), opt);
        this.toRouters = [
            {
                'link': '../../../../quotation/order-processing',
                'display': 'SIDEBAR.QUOTATIONS.ORDER_PROCESSING.NAME'
            },
            {
                'link': '../../../../quotation/order-processing/order-processing-view',
                'display': 'SIDEBAR.QUOTATIONS.ORDER_PROCESSING.PROGRESS'
            },
            {
                'display': 'CREATOR.CURRICULUMS.LIST.EDIT_LESSON'
            },
        ];
        this.cookieService.put('routLinks', JSON.stringify(this.toRouters), opt);
        this.cookieService.put('editable', JSON.stringify({editable: true}), opt);
        this.router.navigate(['cms/vendor/curriculums/curriculum-view/curriculum-unit-list-edit/lesson-view']);
    }

    editExercise(index, exercise) {
        this.cookieService.remove('lessonInfo');
        this.cookieService.remove('questionInfo');
        const sendExercise = {
            signature: exercise.signature,
            name: exercise.name,
            unitSig: this.cvQuoteProgress.units[index]['signature'],
            unitName: this.cvQuoteProgress.units[index]['name'],
            cvName: this.cvQuoteProgress.name
        };
        const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
        this.cookieService.put('exerciseInfo', JSON.stringify(sendExercise), opt);
        this.toRouters = [
            {
                'link': '../../../../quotation/order-processing',
                'display': 'SIDEBAR.QUOTATIONS.ORDER_PROCESSING.NAME'
            },
            {
                'link': '../../../../quotation/order-processing/order-processing-view',
                'display': 'SIDEBAR.QUOTATIONS.ORDER_PROCESSING.PROGRESS'
            },
            {
                'display': 'CREATOR.CURRICULUMS.LIST.EDIT_EXERCISE'
            },
        ];
        this.cookieService.put('routLinks', JSON.stringify(this.toRouters), opt);
        this.cookieService.put('editable', JSON.stringify({editable: true}), opt);
        this.router.navigate(['cms/vendor/curriculums/curriculum-view/curriculum-unit-list-edit/curriculum-exercise-view']);
    }

    editQuestion(index, question) {
        this.cookieService.remove('lessonInfo');
        this.cookieService.remove('exerciseInfo');
        const sendQuestion = {
            signature: question.signature,
            name: question.name,
            unitSig: this.cvQuoteProgress.units[index]['signature'],
            unitName: this.cvQuoteProgress.units[index]['name'],
            cvName: this.cvQuoteProgress.name
        };
        const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
        this.cookieService.put('questionInfo', JSON.stringify(sendQuestion), opt);
        this.toRouters = [
            {
                'link': '../../../../quotation/order-processing',
                'display': 'SIDEBAR.QUOTATIONS.ORDER_PROCESSING.NAME'
            },
            {
                'link': '../../../../quotation/order-processing/order-processing-view',
                'display': 'SIDEBAR.QUOTATIONS.ORDER_PROCESSING.PROGRESS'
            },
            {
                'display': 'CREATOR.CURRICULUMS.LIST.EDIT_QUIZ'
            },
        ];
        this.cookieService.put('routLinks', JSON.stringify(this.toRouters), opt);
        this.cookieService.put('editable', JSON.stringify({editable: true}), opt);
        this.router.navigate(['cms/vendor/curriculums/curriculum-view/curriculum-unit-list-edit/curriculum-question-view']);
    }

    removeLesson(index, lesson) {
        const data = {
            grpSig: lesson.signature,
            grpType: 1
        };
        const arr = this.cvQuoteProgress.units[index]['lessonGroup'].map(item => item.signature);
        const lessIndx = arr.indexOf(lesson.signature);
        this.removeDataItem = {
            data: data,
            unitIndex: index,
            removeIndex: lessIndx
        };
        this.removeLessonModal.show();
    }

    removeSelectedLesson() {
        const data = this.removeDataItem.data;
        const index = this.removeDataItem.removeIndex;
        const unitIndex = this.removeDataItem.unitIndex;
        this.service.removeUnitGroup(data).subscribe(res => {
            (this.cvQuoteProgress.units[unitIndex]['lessonGroup'] as Array<any>).splice(index, 1);
        });
    }

    removeExercise(index, exercise) {
        const data = {
            grpSig: exercise.signature,
            grpType: 2
        };
        const arr = this.cvQuoteProgress.units[index]['exerciseGroup'].map(item => item.signature);
        const exerciseIndx = arr.indexOf(exercise.signature);
        this.removeDataItem = {
            data: data,
            unitIndex: index,
            removeIndex: exerciseIndx
        };
        this.removeExerciseModal.show();
    }

    removeSelectedExercise() {
        const data = this.removeDataItem.data;
        const index = this.removeDataItem.removeIndex;
        const unitIndex = this.removeDataItem.unitIndex;
        this.service.removeUnitGroup(data).subscribe(res => {
            this.cvQuoteProgress.units[unitIndex]['exerciseGroup'].splice(index, 1);
        });
    }

    removeQuiz(index, quiz) {
        const data = {
            grpSig: quiz.signature,
            grpType: 3
        };
        const arr = this.cvQuoteProgress.units[index]['quizGroup'].map(item => item.signature);
        const quizIndx = arr.indexOf(quiz.signature);
        this.removeDataItem = {
            data: data,
            unitIndex: index,
            removeIndex: quizIndx
        };
        this.removeQuizModal.show();
    }

    removeSelectedQuiz() {
        const data = this.removeDataItem.data;
        const index = this.removeDataItem.removeIndex;
        const unitIndex = this.removeDataItem.unitIndex;
        this.service.removeUnitGroup(data).subscribe(res => {
            this.cvQuoteProgress.units[unitIndex]['quizGroup'].splice(index, 1);
        });
    }

    openGroupModal(index, item, type) {
        this.selectedGroupItem = {
            index: index,
            item: item,
            type: type
        };
        this.groupForm.get('name').setValue(item.name);
        this.groupItemDescription.show();
    }

    updateGroupItemName() {
        const data = {
            name: this.groupForm.get('name').value,
            id: this.selectedGroupItem.item.id,
            lang: this.appState.locale.lang,
            grpSig: this.selectedGroupItem.item.signature
        };
        switch (this.selectedGroupItem.type) {
            case 'Lesson': {
                this.service.updateCvLessonGroup(data).subscribe(resLesson => {
                    const idx = this.cvQuoteProgress.units[this.selectedGroupItem.index]['lessonGroup']
                        .map(it => it.signature).indexOf(this.selectedGroupItem.item.signature);
                    this.cvQuoteProgress.units[this.selectedGroupItem.index]['lessonGroup'][idx].name = data.name;
                });
                break;
            }
            case 'Exercise': {
                this.service.updateCvExerciseGroup(data).subscribe(resExer => {
                    const idx = this.cvQuoteProgress.units[this.selectedGroupItem.index]['exerciseGroup']
                        .map(it => it.signature).indexOf(this.selectedGroupItem.item.signature);
                    this.cvQuoteProgress.units[this.selectedGroupItem.index]['exerciseGroup'][idx].name = data.name;
                });
                break;
            }
            case 'Quiz': {
                this.service.updateCvQuizGroup(data).subscribe(resQuiz => {
                    const idx = this.cvQuoteProgress.units[this.selectedGroupItem.index]['quizGroup']
                        .map(it => it.signature).indexOf(this.selectedGroupItem.item.signature);
                    this.cvQuoteProgress.units[this.selectedGroupItem.index]['quizGroup'][idx].name = data.name;
                });
                break;
            }
        }
        this.groupItemDescription.hide();
    }

    getUnitNameFromPrerequisitesKey(key: any) {
        if (this.cvQuoteProgress && this.cvQuoteProgress.units.length > 0) {
            const index = this.cvQuoteProgress.units.map(item => item.no.toString()).indexOf(key.toString());
            if (index >= 0) {
                return this.cvQuoteProgress.units[index]['name'];
            }
        }
        return '';
    }

    checkPrerequisites(form) {
        return Object.keys(form.get('prerequisites')['controls']).length > 0;
    }
}