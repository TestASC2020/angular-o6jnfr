import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CurriculumsService} from '../../../../../../services/curriculums.service';
import {CookieService} from 'ngx-cookie';
import {AppState} from '../../../../../../app-state.service';
import {ModalDirective} from '../../../../../../lib/ng-uikit-pro-standard/free/modals';

@Component({
  selector: 'app-cms-vendor-curriculum-unit-list-edit',
  templateUrl: './curriculum-unit-list-edit.component.html',
  styleUrls: ['./curriculum-unit-list-edit.component.scss']
})
export class CurriculumUnitListEditComponent implements OnInit, OnDestroy {
  unitInfoForm: FormGroup;
  unitInfoEditForm: FormGroup;
  groupForm: FormGroup;
  selectedItem: string = '';
  selectedUnitIndex: number = 0;
  selectedGroupItem: any;
  emptyPrerequisites: boolean = true;
  deleteWhat: string = '';

  @Input() toRouters: Array<any>;
  @Input() cv: any;
  @Input() thirdFormGroup: FormGroup;
  @Output() lessonEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() exerciseEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() quizEmit: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('curriculumUnitInfo') curriculumUnitInfo: ModalDirective;
  @ViewChild('curriculumUnitInfoEdit') curriculumUnitInfoEdit: ModalDirective;
  @ViewChild('groupItemDescription') groupItemDescription: ModalDirective;
  @ViewChild('confirmDeleteDialog') confirmDeleteDialog: ModalDirective;
  @ViewChild('groupCreate') groupCreate: ModalDirective;
  @Input() editable: boolean = null;

  constructor(private router: Router,
              private route: ActivatedRoute,
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
  }

  ngOnInit() {
    if (this.editable === null && this.cookieService.get('editable')) {
      this.editable = JSON.parse(this.cookieService.get('editable')).editable;
    }
    this.cv = JSON.parse(this.cookieService.get('cvInfo'));
    if (this.cookieService.get('routLinks')) {
      this.toRouters = (!this.toRouters || this.toRouters === null) ?
        JSON.parse(this.cookieService.get('routLinks')) : this.toRouters;
      if (this.toRouters.length > 0 && this.toRouters[0]['display'].toString().indexOf('REQUEST_FOR_QUOTE') >= 0) {
        this.toRouters = [
          {
            'link': '../../../quotation/request-for-quote',
            'display': 'SIDEBAR.QUOTATIONS.REQUEST_FOR_QUOTE.NAME'
          },
          {
            'link': '../../../curriculums/curriculum-view',
            'display': this.cv.name
          },
          {
            'display': 'LAYOUT.EDIT'
          }
        ];
      }
    }
    if (!this.toRouters || this.toRouters === null) {
      this.toRouters = [
        {
          link: '../../',
          display: 'CREATOR.CURRICULUMS.LIST.Curriculums'
        },
        {
          link: '../',
          display: this.cv.name
        },
        {
          display: 'LAYOUT.EDIT'
        },
      ];
    }
    this.service.loadCv({cvSig: this.cv.signature, lang: this.appState.locale.lang}).subscribe(result => {
      this.service.loadCvGroupType().subscribe(res => {
        this.cv = result['data'];
      });
    });
  }

  ngOnDestroy(): void {
    this.lessonEmit.complete();
    this.exerciseEmit.complete();
    this.quizEmit.complete();
  }

  onSubmit() {
    // do something here
  }

    openCreateArea(index) {
        this.selectedUnitIndex = index;
        this.groupCreate.show();
    }

    addType(index) {
        const gName = (document.getElementById('name_' + index) as HTMLInputElement).value;
        const gType = (document.getElementById('type_' + index) as HTMLSelectElement).value;

        const data = {
            name: gName,
            unitSig: this.cv.units[index]['signature']
        };
        switch (gType) {
            case 'Lesson': {
                data['no'] = (this.cv.units[index]['lessonGroup'] && this.cv.units[index]['lessonGroup'].length > 0) ?
                    (this.cv.units[index]['lessonGroup'].length + 1) : 1;
                this.service.addCvLessonGroup(data).subscribe(resLesson => {
                    (document.getElementById('name_' + index) as HTMLInputElement).setAttribute('value', '');
                    if (!this.cv.units[index]['lessonGroup']) {
                        this.cv.units[index]['lessonGroup'] = [];
                    }
                    this.cv.units[index]['lessonGroup'].push(resLesson['data']);
                    this.groupCreate.hide();
                });
                break;
            }
            case 'Exercise': {
                data['no'] = (this.cv.units[index]['exerciseGroup'] && this.cv.units[index]['exerciseGroup'].length > 0) ?
                    (this.cv.units[index]['exerciseGroup'].length + 1) : 1;
                this.service.addCvExerciseGroup(data).subscribe(resExercise => {
                    (document.getElementById('name_' + index) as HTMLInputElement).setAttribute('value', '');
                    if (!this.cv.units[index]['exerciseGroup']) {
                        this.cv.units[index]['exerciseGroup'] = [];
                    }
                    this.cv.units[index]['exerciseGroup'].push(resExercise['data']);
                    this.groupCreate.hide();
                });
                break;
            }
            case 'Quiz': {
                data['no'] = (this.cv.units[index]['quizGroup'] && this.cv.units[index]['quizGroup'].length > 0) ?
                    (this.cv.units[index]['quizGroup'].length + 1) : 1;
                this.service.addCvQuizGroup(data).subscribe(resQuiz => {
                    (document.getElementById('name_' + index) as HTMLInputElement).setAttribute('value', '');
                    if (!this.cv.units[index]['quizGroup']) {
                        this.cv.units[index]['quizGroup'] = [];
                    }
                    this.cv.units[index]['quizGroup'].push(resQuiz['data']);
                    this.groupCreate.hide();
                });
                break;
            }
        }
    }

  removeSelectedItem() {
    if (this.deleteWhat === 'Unit') {
      this.removeSelectedUnit();
    } else if (this.deleteWhat === 'Lesson') {
      this.removeSelectedLesson();
    } else if (this.deleteWhat === 'Exercise') {
      this.removeSelectedExercise();
    } else if (this.deleteWhat === 'Question') {
      this.removeSelectedQuiz();
    }
  }

  removeUnit(unit) {
    this.selectedItem = unit;
    this.deleteWhat = 'Unit';
    this.confirmDeleteDialog.show();
  }

  removeSelectedUnit() {
    const unit = this.selectedItem;
    const index = this.cv.units.map(it => it.signature).indexOf(unit['signature']);
    this.service.removeCvUnit({unitSig: unit['signature']}).subscribe(
      res => {
        (this.cv.units as Array<any>).splice(this.cv.units.indexOf(unit), 1);
        this.confirmDeleteDialog.hide();
        this.deleteWhat = '';
        // update whole next units prerequisites
        this.updateReferencesUnitPrerequisites(index, unit['no']);
      }
    );
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
      cvSig: this.cv.signature,
      description: this.unitInfoForm.get('description').value,
      lang: this.appState.locale.lang,
      name: this.unitInfoForm.get('name').value,
      prerequisites: prerequisitesArr,
      no: (this.cv.units && this.cv.units.length > 0) ? (Math.max(...this.cv.units.map(item => (item.no) ? item.no : 0)) + 1) : 1
    };
    this.service.addCvUnit(data).subscribe(res => {
      this.cv.units.push(res['data']);
      this.unitInfoForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        prerequisites: this.formBuilder.group({})
      });
    });
  }

  updateReferencesUnitPrerequisites(deletedUnitIndex: number, deletedUnitNo: number) {
    if (deletedUnitNo) {
      for (let i = deletedUnitIndex + 1; i < this.cv.units.length; i++) {
        if (this.cv.units[i]['prerequisites'] && this.cv.units[i]['prerequisites'].length > 0) {
          if (this.cv.units[i]['prerequisites'].indexOf(deletedUnitNo) > 0) {
            const index = this.cv.units[i]['prerequisites'].indexOf(deletedUnitNo);
            this.cv.units[i]['prerequisites'].splice(index, 1);
            const data = {
              cvSig: this.cv.signature,
              description: this.unitInfoEditForm.get('description').value,
              name: (this.cv.units[i]['name']) ? this.cv.units[i]['name'] : '',
              prerequisites: this.cv.units[i]['prerequisites'],
              unitSig: this.cv.units[i]['signature']
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

  updateUnit() {
    const prerequisites = this.unitInfoEditForm.get('prerequisites').value;
    const prerequisitesArr: Array<number> = new Array<number>();
    Object.keys(prerequisites).forEach(key => {
      if (prerequisites[key]) {
        prerequisitesArr.push(Number.parseInt(key, 10));
      }
    });
    const data = {
      cvSig: this.cv.signature,
      description: this.unitInfoEditForm.get('description').value,
      lang: this.appState.locale.lang,
      name: this.unitInfoEditForm.get('name').value,
      prerequisites: prerequisitesArr,
      unitSig: this.selectedItem['signature']
    };
    this.service.updateCvUnit(data).subscribe(res => {
      const index = this.cv.units.map(it => it.signature).indexOf(this.selectedItem['signature']);
      this.cv.units[index]['name'] = data.name;
      this.cv.units[index]['description'] = data.description;
      this.cv.units[index]['prerequisites'] = data.prerequisites;
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
    this.selectedItem = unit;
    const unitIndex = this.cv.units.map(u => u.signature).indexOf(unit.signature);
    for (let i = 0; i < unitIndex; i++) {
      const prerequisites = <FormGroup>this.unitInfoEditForm.get('prerequisites');
      let check = false;
      if (unit.prerequisites.length > 0) {
        check = !(unit.prerequisites.indexOf(this.cv.units[i]['no']) < 0);
        prerequisites.addControl((this.cv.units[i]['no']).toString(), new FormControl(check));
      } else {
        prerequisites.addControl((this.cv.units[i]['no']).toString(), new FormControl(false));
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
    for (let i = 0; i < this.cv.units.length; i++) {
      const prerequisites = <FormGroup>this.unitInfoForm.get('prerequisites');
      let check = false;
      if (this.cv.units[i].prerequisites && this.cv.units[i].prerequisites.length > 0) {
        this.emptyPrerequisites = false;
        check = !(this.cv.units[i].prerequisites.indexOf(i + 1) < 0);
        prerequisites.addControl((i + 1).toString(), new FormControl(check));
      } else {
        this.emptyPrerequisites = true;
      }
    }
    this.curriculumUnitInfo.show();
  }

  checkEmpty(obj) {
    if (!obj || Object.entries(obj).length === 0) {
      return true;
    }
    return false;
  }

  editLesson(index, lesson) {
    this.cookieService.remove('exerciseInfo');
    this.cookieService.remove('questionInfo');
    const sendLesson = {
      signature: lesson.signature,
      name: lesson.name,
      unitSig: this.cv.units[index]['signature'],
      unitName: this.cv.units[index]['name'],
      cvName: this.cv.name
    };
    const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
    this.cookieService.put('lessonInfo', JSON.stringify(sendLesson), opt);
    this.cookieService.put('editable', JSON.stringify({editable: this.editable}), opt);
    if (this.toRouters.length === 3) {
      if (this.toRouters.length > 0 && this.toRouters[0]['display'].toString().indexOf('REQUEST_FOR_QUOTE') >= 0) {
        this.toRouters = [
          {
            'link': '../../../../quotation/request-for-quote',
            'display': 'SIDEBAR.QUOTATIONS.REQUEST_FOR_QUOTE.NAME'
          },
          {
            'link': '../../../../curriculums/curriculum-view',
            'display': this.cv.name
          },
          {
            'link': '../../../../curriculums/curriculum-view/curriculum-unit-list-edit',
            'display': sendLesson.unitName
          },
          {
            'display': 'MESSAGE.EditLesson'
          },
        ];
        this.cookieService.put('routLinks', JSON.stringify(this.toRouters), opt);
      } else {
        this.cookieService.remove('routLinks');
      }
    } else {
      this.cookieService.put('routLinks', JSON.stringify(this.toRouters), opt);
    }
    this.router.navigate(['cms/vendor/curriculums/curriculum-view/curriculum-unit-list-edit/lesson-view']);
  }

  lessonEmitEditLesson(index, lesson) {
    this.cookieService.remove('exerciseInfo');
    this.cookieService.remove('questionInfo');
    const sendLesson = {
      signature: lesson.signature,
      name: lesson.name,
      unitSig: this.cv.units[index]['signature'],
      unitName: this.cv.units[index]['name'],
      cvName: this.cv.name
    };
    const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
    this.cookieService.put('editable', JSON.stringify({editable: this.editable}), opt);
    this.cookieService.put('lessonInfo', JSON.stringify(sendLesson), opt);
    if (this.toRouters.length === 3) {
      if (this.toRouters.length > 0 && this.toRouters[0]['display'].toString().indexOf('REQUEST_FOR_QUOTE') >= 0) {
        this.toRouters = [
          {
            'link': '../../../../quotation/request-for-quote',
            'display': 'SIDEBAR.QUOTATIONS.REQUEST_FOR_QUOTE.NAME'
          },
          {
            'link': '../../../../curriculums/curriculum-view',
            'display': this.cv.name
          },
          {
            'link': '../../../../curriculums/curriculum-view/curriculum-unit-list-edit',
            'display': sendLesson.unitName
          },
          {
            'display': 'MESSAGE.EditLesson'
          },
        ];
        this.cookieService.put('routLinks', JSON.stringify(this.toRouters), opt);
      } else {
        this.cookieService.remove('routLinks');
      }
    } else {
      this.cookieService.put('routLinks', JSON.stringify(this.toRouters), opt);
    }
    this.lessonEmit.emit({});
  }

  editExercise(index, exercise) {
    this.cookieService.remove('lessonInfo');
    this.cookieService.remove('questionInfo');
    const sendExercise = {
      signature: exercise.signature,
      name: exercise.name,
      unitSig: this.cv.units[index]['signature'],
      unitName: this.cv.units[index]['name'],
      cvName: this.cv.name
    };
    const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
    this.cookieService.put('editable', JSON.stringify({editable: this.editable}), opt);
    this.cookieService.put('exerciseInfo', JSON.stringify(sendExercise), opt);
    if (this.toRouters.length === 3) {
      if (this.toRouters.length > 0 && this.toRouters[0]['display'].toString().indexOf('REQUEST_FOR_QUOTE') >= 0) {
        this.toRouters = [
          {
            'link': '../../../../quotation/request-for-quote',
            'display': 'SIDEBAR.QUOTATIONS.REQUEST_FOR_QUOTE.NAME'
          },
          {
            'link': '../../../../curriculums/curriculum-view',
            'display': this.cv.name
          },
          {
            'link': '../../../../curriculums/curriculum-view/curriculum-unit-list-edit',
            'display': sendExercise.unitName
          },
          {
            'display': 'MESSAGE.EditExercise'
          },
        ];
        this.cookieService.put('routLinks', JSON.stringify(this.toRouters), opt);
      } else {
        this.cookieService.remove('routLinks');
      }
    } else {
      this.cookieService.put('routLinks', JSON.stringify(this.toRouters), opt);
    }
    this.router.navigate(['cms/vendor/curriculums/curriculum-view/curriculum-unit-list-edit/curriculum-exercise-view']);
  }

  exerciseEmitEditExercise(index, exercise) {
    this.cookieService.remove('lessonInfo');
    this.cookieService.remove('questionInfo');
    const sendExercise = {
      signature: exercise.signature,
      name: exercise.name,
      unitSig: this.cv.units[index]['signature'],
      unitName: this.cv.units[index]['name'],
      cvName: this.cv.name
    };
    const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
    this.cookieService.put('editable', JSON.stringify({editable: this.editable}), opt);
    this.cookieService.put('exerciseInfo', JSON.stringify(sendExercise), opt);
    if (this.toRouters.length === 3) {
      if (this.toRouters.length > 0 && this.toRouters[0]['display'].toString().indexOf('REQUEST_FOR_QUOTE') >= 0) {
        this.toRouters = [
          {
            'link': '../../../../quotation/request-for-quote',
            'display': 'SIDEBAR.QUOTATIONS.REQUEST_FOR_QUOTE.NAME'
          },
          {
            'link': '../../../../curriculums/curriculum-view',
            'display': this.cv.name
          },
          {
            'link': '../../../../curriculums/curriculum-view/curriculum-unit-list-edit',
            'display': sendExercise.unitName
          },
          {
            'display': 'MESSAGE.EditExercise'
          },
        ];
        this.cookieService.put('routLinks', JSON.stringify(this.toRouters), opt);
      } else {
        this.cookieService.remove('routLinks');
      }
    } else {
      this.cookieService.put('routLinks', JSON.stringify(this.toRouters), opt);
    }
    this.exerciseEmit.emit({});
  }

  editQuestion(index, question) {
    this.cookieService.remove('lessonInfo');
    this.cookieService.remove('exerciseInfo');
    const sendQuestion = {
      signature: question.signature,
      name: question.name,
      unitSig: this.cv.units[index]['signature'],
      unitName: this.cv.units[index]['name'],
      cvName: this.cv.name
    };
    const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
    this.cookieService.put('editable', JSON.stringify({editable: this.editable}), opt);
    this.cookieService.put('questionInfo', JSON.stringify(sendQuestion), opt);
    if (this.toRouters.length === 3) {
      if (this.toRouters.length > 0 && this.toRouters[0]['display'].toString().indexOf('REQUEST_FOR_QUOTE') >= 0) {
        this.toRouters = [
          {
            'link': '../../../../quotation/request-for-quote',
            'display': 'SIDEBAR.QUOTATIONS.REQUEST_FOR_QUOTE.NAME'
          },
          {
            'link': '../../../../curriculums/curriculum-view',
            'display': this.cv.name
          },
          {
            'link': '../../../../curriculums/curriculum-view/curriculum-unit-list-edit',
            'display': sendQuestion.unitName
          },
          {
            'display': 'MESSAGE.EditQuestion'
          },
        ];
        this.cookieService.put('routLinks', JSON.stringify(this.toRouters), opt);
      } else {
        this.cookieService.remove('routLinks');
      }
    } else {
      this.cookieService.put('routLinks', JSON.stringify(this.toRouters), opt);
    }
    this.router.navigate(['cms/vendor/curriculums/curriculum-view/curriculum-unit-list-edit/curriculum-question-view']);
  }

  quizEmitEditQuiz(index, question) {
    this.cookieService.remove('lessonInfo');
    this.cookieService.remove('exerciseInfo');
    const sendQuestion = {
      signature: question.signature,
      name: question.name,
      unitSig: this.cv.units[index]['signature'],
      unitName: this.cv.units[index]['name'],
      cvName: this.cv.name
    };
    const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
    this.cookieService.put('editable', JSON.stringify({editable: this.editable}), opt);
    this.cookieService.put('questionInfo', JSON.stringify(sendQuestion), opt);
    if (this.toRouters.length === 3) {
      if (this.toRouters.length > 0 && this.toRouters[0]['display'].toString().indexOf('REQUEST_FOR_QUOTE') >= 0) {
        this.toRouters = [
          {
            'link': '../../../../quotation/request-for-quote',
            'display': 'SIDEBAR.QUOTATIONS.REQUEST_FOR_QUOTE.NAME'
          },
          {
            'link': '../../../../curriculums/curriculum-view',
            'display': this.cv.name
          },
          {
            'link': '../../../../curriculums/curriculum-view/curriculum-unit-list-edit',
            'display': sendQuestion.unitName
          },
          {
            'display': 'MESSAGE.EditQuestion'
          },
        ];
        this.cookieService.put('routLinks', JSON.stringify(this.toRouters), opt);
      } else {
        this.cookieService.remove('routLinks');
      }
    } else {
      this.cookieService.put('routLinks', JSON.stringify(this.toRouters), opt);
    }
    this.quizEmit.emit({});
  }

  removeLesson(index, lesson) {
    this.deleteWhat = 'Lesson';
    this.selectedUnitIndex = index;
    this.selectedItem = lesson;
    this.confirmDeleteDialog.show();
  }

  removeSelectedLesson() {
    const index = this.selectedUnitIndex;
    const lesson = this.selectedItem;
    const data = {
      grpSig: lesson['signature'],
      grpType: 1
    };
    this.service.removeUnitGroup(data).subscribe(res => {
      const lessIndx = this.cv.units[index]['lessonGroup'].indexOf(lesson);
      (this.cv.units[index]['lessonGroup'] as Array<any>).splice(lessIndx, 1);
    });
  }

  removeExercise(index, exercise) {
    this.deleteWhat = 'Exercise';
    this.selectedUnitIndex = index;
    this.selectedItem = exercise;
    this.confirmDeleteDialog.show();
  }

  removeSelectedExercise() {
    const index = this.selectedUnitIndex;
    const exercise = this.selectedItem;
    const data = {
      grpSig: exercise['signature'],
      grpType: 2
    };
    this.service.removeUnitGroup(data).subscribe(res => {
      const exerIndx = this.cv.units[index]['exerciseGroup'].indexOf(exercise);
      (this.cv.units[index]['exerciseGroup'] as Array<any>).splice(exerIndx, 1);
    });
  }

  removeQuiz(index, quiz) {
    this.deleteWhat = 'Question';
    this.selectedUnitIndex = index;
    this.selectedItem = quiz;
    this.confirmDeleteDialog.show();
  }

  removeSelectedQuiz() {
    const index = this.selectedUnitIndex;
    const quiz = this.selectedItem;
    const data = {
      grpSig: quiz['signature'],
      grpType: 3
    };
    this.service.removeUnitGroup(data).subscribe(res => {
      const quizIndx = this.cv.units[index]['quizGroup'].indexOf(quiz);
      (this.cv.units[index]['quizGroup'] as Array<any>).splice(quizIndx, 1);
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
          const idx = this.cv.units[this.selectedGroupItem.index]['lessonGroup']
            .map(it => it.signature).indexOf(this.selectedGroupItem.item.signature);
          this.cv.units[this.selectedGroupItem.index]['lessonGroup'][idx].name = data.name;
        });
        break;
      }
      case 'Exercise': {
        this.service.updateCvExerciseGroup(data).subscribe(resExer => {
          const idx = this.cv.units[this.selectedGroupItem.index]['exerciseGroup']
            .map(it => it.signature).indexOf(this.selectedGroupItem.item.signature);
          this.cv.units[this.selectedGroupItem.index]['exerciseGroup'][idx].name = data.name;
        });
        break;
      }
      case 'Quiz': {
        this.service.updateCvQuizGroup(data).subscribe(resQuiz => {
          const idx = this.cv.units[this.selectedGroupItem.index]['quizGroup']
            .map(it => it.signature).indexOf(this.selectedGroupItem.item.signature);
          this.cv.units[this.selectedGroupItem.index]['quizGroup'][idx].name = data.name;
        });
        break;
      }
    }
    this.groupItemDescription.hide();
  }

  getUnitNameFromPrerequisitesKey(key: any) {
    const index = this.cv.units.map(item => item.no.toString()).indexOf(key.toString());
    if (this.cv && this.cv.units.length > 0 && index >= 0) {
      return this.cv.units[index]['name'];
    }
    return '';
  }

  checkPrerequisites(form) {
    return Object.keys(form.get('prerequisites')['controls']).length > 0;
  }
}
