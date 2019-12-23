import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CurriculumsService} from '../../../../../services/curriculums.service';
import {CookieService} from 'ngx-cookie';
import {AppState} from '../../../../../app-state.service';
import {AppSharedService} from '../../../../../app-shared.service';
import {DomSanitizer} from '@angular/platform-browser';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {UtilsService} from '../../../../../services/utils.service';

@Component({
  selector: 'app-cms-creator-curriculum-quiz-tf-view',
  templateUrl: './curriculum-quiz-tf-view.component.html',
  styleUrls: ['./curriculum-quiz-tf-view.component.scss']
})
export class CurriculumQuizTfViewComponent implements OnInit {
  showSelections: Array<any> = new Array<any>();
  answerForm: FormGroup;
  selectedShowPerRow: any;
  firstFormGroup: FormGroup;
  isEdit: boolean = false;
  isContentEdit: boolean = false;
  isSolutionContentEdit: boolean = false;
  question: any;
  questionList: Array<any> = new Array<any>();
  selectedQuiz: any;
  selectedAnsValue: any;
  selectedAnswer: Array<any> = new Array<any>();
  selectedDuration = 0;
  selectedNo = 0;
  selectedName = '';
  selectedPoint = 0;
  selectedQuestion = '';
  selectedSolution = '';
  quizTypeList: Array<any> = new Array<any>();
  selectedQuizType: any;
  lastQuestion = '';
  trueFalseData: any;
  canSubmit: boolean = true;
  lastCheckboxValues: Array<any> = new Array<any>();
  @Input() editable: boolean = null;
  // File video upload
  error: any;
  selectedIndex: number;
  uploadResponse = { status: '', message: '', filePath: '' };
  @Output() solutionEmit: EventEmitter<any> = new EventEmitter<any>();
  @Input() toRouters: Array<any>;
  public Editor = ClassicEditor;
  configs: any = {
    toolbar: ['heading',
      '|',
      'bold',
      'italic',
      'link',
      'bulletedList',
      'numberedList',
      'blockQuote',
      'iamge',
      'undo',
      'redo'
    ],
    image: {
      // You need to configure the image toolbar, too, so it uses the new style buttons.
      toolbar: [
        'imageTextAlternative',
        '|',
        'imageStyle:alignLeft',
        'imageStyle:full',
        'imageStyle:alignCenter',
        'imageStyle:alignRight'
      ],
      styles: [
        // This option is equal to a situation where no style is applied.
        'full',

        'alignCenter',
        // This represents an image aligned to the left.
        'alignLeft',

        // This represents an image aligned to the right.
        'alignRight'
      ]
    }
  };
  constructor(private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private service: CurriculumsService,
              private cookieService: CookieService,
              private appState: AppState,
              private utilsService: UtilsService,
              private appShare: AppSharedService,
              private domSanitizer: DomSanitizer) {
    this.firstFormGroup = new FormGroup({
      question: new FormControl('', [Validators.required]),
      solution: new FormControl('', [Validators.required])
    });
    this.showSelections = [
      {
        value: 1,
        display: '1'
      },
      {
        value: 2,
        display: '2'
      },
      {
        value: 3,
        display: '3'
      },
      {
        value: 4,
        display: '4'
      }
    ];
    this.selectedShowPerRow = this.showSelections[0].value;
    const answers = this.formBuilder.array([]);
    this.answerForm = new FormGroup({
      answers: answers
    });
  }

  createAnswerControl(data): FormGroup {
    if (Object.keys(data).length > 0) {
      return this.formBuilder.group({
        isCorrect: [data.isCorrect, Validators.required],
        id: [data.id],
        text: [data.text, Validators.required],
        isEdit: [false]
      });
    }
    return this.formBuilder.group({
      isCorrect: [false, Validators.required],
      id: [''],
      text: ['', Validators.required],
      isEdit: [true]
    });
  }

  doInit() {
    if (!this.toRouters) {
      this.toRouters = [
        {
          'link': '../../../',
          'display': 'CREATOR.CURRICULUMS.LIST.Curriculums'
        },
        {
          'link': '../',
          'display': 'CREATOR.CURRICULUMS.Units'
        },
        {
          'display': 'CREATOR.CURRICULUMS.Questions'
        },
      ];
    }
  }

  ngOnInit() {
    const temp = this;
    if (this.cookieService.get('routLinks') && this.toRouters === null) {
      this.toRouters = JSON.parse(this.cookieService.get('routLinks'));
    }
    if (this.editable === null && this.cookieService.get('editable')) {
      this.editable = JSON.parse(this.cookieService.get('editable')).editable;
    }
    if (this.cookieService.get('questionInfo')) {
      this.question = JSON.parse(this.cookieService.get('questionInfo'));
      this.service.loadQuizType({}).subscribe(ql => {
        this.quizTypeList = ql['data'];
        this.selectedQuizType = this.quizTypeList[0].value;
        this.service.loadQuizByGroup({lang: this.appState.locale.lang,
          grpSig: this.question.signature, subLang: 1}).subscribe(res => {
          this.questionList = res['data'];
          this.processQuestionNoList(this.questionList);
          if (this.questionList.length > 0) {
            this.selectedQuiz = this.questionList[0].signature;
            this.service.loadQuiz({
              lang: this.appState.locale.lang,
              quizSig: this.questionList[0].signature
            }).subscribe(res2 => {
              temp.selectedDuration = (res2['data'][0].doneSecs) ? res2['data'][0].doneSecs : 0;
              temp.selectedNo = (res2['data'][0].no) ? res2['data'][0].no : 0;
              temp.selectedName = (res2['data'][0].name) ? res2['data'][0].name : '';
              temp.selectedPoint = (res2['data'][0].point) ? res2['data'][0].point : 0;
              temp.selectedAnsValue = (res2['data'][0].ansValue) ? res2['data'][0].ansValue : '';
              temp.selectedAnswer = (res2['data'][0].answer) ? res2['data'][0].answer : [];
              temp.selectedQuizType = (res2['data'][0].qzType) ? res2['data'][0].qzType : 0;
              if (temp.selectedQuizType === 0) {
                temp.trueFalseData = res2['data'][0].answer;
              }
              if (res2['data'][0].answer && res2['data'][0].answer.length > 0) {
                const answers = temp.formBuilder.array([]);
                this.answerForm = new FormGroup({
                  answers: answers
                });
                res2['data'][0].answer.forEach(answer => {
                  const idx = res2['data'][0].answer.indexOf(answer);
                  (<FormArray>temp.answerForm.get('answers')).push(temp.createAnswerControl({
                    id: idx,
                    isCorrect: answer.isCorrect,
                    text: answer.text,
                    isEdit: false
                  }));
                });
              }
              (<FormArray>temp.answerForm.get('answers')).push(temp.createAnswerControl({}));
              this.doInit();
              temp.loadFile(res2['data'][0].url, res2['data'][0].solURL);
            });
          } else {
            this.selectedQuiz = -1;
            this.selectedDuration = -1;
            this.selectedNo = 0;
            this.selectedName = '';
            this.selectedAnsValue = '';
            this.selectedAnswer = [];
            this.questionList = [{
              signature: -1,
              name: 'VENDOR.No_Question'
            }];
            this.canSubmit = false;
            this.doInit();
          }
        });
      });
    }
  }

  updateQuiz($event) {
    this.selectedQuiz = $event.target.value;
    this.resetFromSelected();
  }

  resetFromSelected() {
    this.selectedDuration = 0;
    this.selectedPoint = 0;
    this.selectedNo = 0;
    this.selectedQuizType = 0;
    this.selectedName = '';
    this.selectedAnsValue = '';
    this.selectedAnswer = [];
    this.selectedQuestion = '';
    this.lastQuestion = '';
    this.isEdit = false;
    this.isContentEdit = false;
    this.isSolutionContentEdit = false;
    if (this.selectedQuiz.toString() === '-1') {
      this.selectedDuration = 0;
      this.selectedPoint = 0;
      this.selectedNo = 0;
      this.selectedQuizType = 0;
      this.selectedName = '';
      this.selectedAnsValue = '';
      this.selectedAnswer = [];
      this.selectedQuestion = '';
      this.lastQuestion = '';
      this.canSubmit = false;
    } else {
      this.canSubmit = true;
      const index = this.questionList.map(item => item.signature).indexOf(this.selectedQuiz.toString());
      this.service.loadQuiz({
        lang: this.appState.locale.lang,
        quizSig: this.selectedQuiz
      }).subscribe(res2 => {
        this.selectedDuration = (res2['data'][0].doneSecs) ? res2['data'][0].doneSecs : 0;
        this.selectedNo = (res2['data'][0].no) ? res2['data'][0].no : 0;
        this.selectedName = (res2['data'][0].name) ? res2['data'][0].name : '';
        this.selectedPoint = (res2['data'][0].point) ? res2['data'][0].point : 0;
        this.selectedAnsValue = (res2['data'][0].ansValue) ? res2['data'][0].ansValue : '';
        this.selectedAnswer = (res2['data'][0].answer) ? res2['data'][0].answer : [];
        this.selectedQuizType = (res2['data'][0].qzType) ? res2['data'][0].qzType : 0;
        if (this.selectedQuizType === 0) {
          this.trueFalseData = res2['data'][0].answer;
        }
        if (res2['data'][0].answer && res2['data'][0].answer.length > 0) {
          const answers = this.formBuilder.array([]);
          this.answerForm = new FormGroup({
            answers: answers
          });
          res2['data'][0].answer.forEach(answer => {
            const idx = res2['data'][0].answer.indexOf(answer);
            (<FormArray>this.answerForm.get('answers')).push(this.createAnswerControl({
              id: idx,
              isCorrect: answer.isCorrect,
              text: answer.text,
              isEdit: false
            }));
          });
        }
        (<FormArray>this.answerForm.get('answers')).push(this.createAnswerControl({}));
        this.loadFile(res2['data'][0].url, res2['data'][0].solURL);
      });
    }
  }

  updateContentEdit() {
    this.isContentEdit = !this.isContentEdit;
    if (document.getElementById('question_area')) {
      document.getElementById('question_area').innerHTML = this.selectedQuestion;
    }
  }

  updateSolutionContentEdit() {
    this.isSolutionContentEdit = !this.isSolutionContentEdit;
  }

  loadFile(filePath1, filePath2) {
    if (filePath1) {
      this.utilsService.loadFile(filePath1).then(resp => {
        this.selectedQuestion = resp;
        this.lastQuestion = this.selectedQuestion;
        if (filePath2) {
          this.utilsService.loadFile(filePath2).then(resp2 => {
            this.selectedSolution = resp2;
          });
        } else {
          this.selectedSolution = '';
        }
      });
    } else {
      this.selectedQuestion = '';
      this.lastQuestion = '';
      if (filePath2) {
        this.utilsService.loadFile(filePath2).then(resp2 => {
          this.selectedSolution = resp2;
        });
      } else {
        this.selectedSolution = '';
      }
    }
  }

  createNewQuiz() {
    const data = {
      no: (this.questionList.length > 0) ? this.questionList.length : 0,
      name: '',
      fileExt: '.html',
      data: '',
      qzType: this.selectedQuizType,
      ansValue: 0,
      ansChoice: [
        {isCorrect: true, text: 'True'},
        {isCorrect: false, text: 'False'},
      ],
      grpSig: this.question.signature
    };
    this.service.addQuiz(data).subscribe(res => {
      const index = this.questionList.map(item => item.signature).indexOf('-1');
      if (index > -1) {
        this.questionList.splice(index, 1);
      }
      const quiz = {
        signature: res['data'].signature,
        name: res['data'].name
      };
      this.questionList.push(quiz);
      if (res['data'].answer && res['data'].answer.length > 0) {
        const answers = this.formBuilder.array([]);
        this.answerForm = new FormGroup({
          answers: answers
        });
        res['data'].answer.forEach(answer => {
          const idx = res['data'].answer.indexOf(answer);
          (<FormArray>this.answerForm.get('answers')).push(this.createAnswerControl({
            id: idx,
            isCorrect: answer.isCorrect,
            text: answer.text,
            isEdit: false
          }));
        });
      }
      (<FormArray>this.answerForm.get('answers')).push(this.createAnswerControl({}));
      this.isEdit = false;
      this.isContentEdit = false;
      this.isSolutionContentEdit = false;
      this.canSubmit = true;
      this.selectedQuiz = this.questionList[this.questionList.length - 1].signature;
      this.resetFromSelected();
    });
  }

  deleteQuestion() {
    if (this.selectedQuiz.toString() === '-1') {
      return;
    }
    const data = {
      quizSig: this.selectedQuiz
    };
    this.service.removeQuiz(data).subscribe(res => {
      const index = this.questionList.map(item => item.signature).indexOf(this.selectedQuiz.toString());
      this.questionList.splice(index, 1);
      if (this.questionList.length > 0) {
        this.selectedQuiz = this.questionList[0].signature;
        if (this.selectedQuiz === -1) {
          this.canSubmit = false;
        } else {
          this.canSubmit = true;
        }
      } else {
        this.selectedQuiz = -1;
        this.canSubmit = false;
        this.questionList = [{
          signature: -1,
          name: 'VENDOR.No_Question'
        }];
      }
      this.isEdit = false;
      this.isContentEdit = false;
      this.isSolutionContentEdit = false;
      this.resetFromSelected();
    });
  }

  processQuestionNoList(questionList: Array<any>) {
    questionList.sort((a, b) => a.no - b.no);
    for (let i = 0; i < questionList.length; i++) {
      questionList[i].no = i;
    }
  }

  saveQuestion() {
    const data = {
      no: this.selectedNo,
      name: this.selectedName,
      point: Number.parseFloat(this.selectedPoint.toString()),
      doneSecs: Number.parseInt(this.selectedDuration.toString(), 10),
      quizSig: this.selectedQuiz.toString()
    };
    this.service.updateQuiz(data).subscribe(res => {
      const index = this.questionList.map(item => item.signature).indexOf(this.selectedQuiz.toString());
      this.questionList[index].name = data.name;
      this.isEdit = false;
      this.resetFromSelected();
    });
  }

  saveQuestionAnswerValue() {
    const name = this.selectedName;
    const point = this.selectedPoint;
    const doneSecs = this.selectedDuration;
    let ansValue = 0;
    let data: any;
    if (this.selectedQuizType === 0) {
      data = {
        name: name,
        point: Number.parseFloat(point.toString()),
        doneSecs: Number.parseInt(doneSecs.toString(), 10),
        ansChoice: this.trueFalseData,
        quizSig: this.selectedQuiz.toString()
      };
    } else if (this.selectedQuizType === 1 || this.selectedQuizType === 2) {
      const ansChoice = [];
      const ctrls = (<FormArray>this.answerForm.get('answers')).controls;
      for (let i = 0; i < ctrls.length; i++) {
        if (ctrls[i].get('text').value) {
          ansChoice.push({
            text: ctrls[i].get('text').value,
            isCorrect: JSON.parse(ctrls[i].get('isCorrect').value.toString())
          });
        }
      }
      data = {
        name: name,
        point: Number.parseFloat(point.toString()),
        doneSecs: Number.parseInt(doneSecs.toString(), 10),
        ansChoice: ansChoice,
        quizSig: this.selectedQuiz.toString()
      };
    } else if (this.selectedQuizType === 3) {
      ansValue = JSON.parse((document.getElementById('inp_ansvalue') as HTMLInputElement).value);
      data = {
        name: name,
        point: Number.parseFloat(point.toString()),
        doneSecs: Number.parseInt(doneSecs.toString(), 10),
        ansValue: ansValue,
        quizSig: this.selectedQuiz.toString()
      };
    }
    this.service.updateQuiz(data).subscribe(res => {
      const index = this.questionList.map(item => item.signature).indexOf(this.selectedQuiz.toString());
      this.questionList[index].name = name;
      this.isSolutionContentEdit = false;
      this.resetFromSelected();
    });
  }

  truefalseChange(index) {
    if (index === 0) {
      this.trueFalseData[0].isCorrect = true;
      this.trueFalseData[1].isCorrect = false;
    } else {
      this.trueFalseData[1].isCorrect = true;
      this.trueFalseData[0].isCorrect = false;
    }
  }

  updateCheckbox(index, $event) {
    const ctrls = (<FormArray>this.answerForm.get('answers')).controls;
    if (this.selectedQuizType === 1) {
      for (let i = 0; i < ctrls.length; i++) {
        this.lastCheckboxValues.push(JSON.parse(ctrls[i].get('isCorrect').value.toString()));
        if (i !== index) {
          ctrls[i].get('isCorrect').setValue(false);
        } else {
          ctrls[i].get('isCorrect').setValue(true);
        }
      }
    } else {
      ctrls[index].get('isCorrect').setValue($event.target.checked);
    }
  }

  cancelAnswer(index) {
    if (this.lastCheckboxValues.length > 0 && this.lastCheckboxValues[index]) {
      const ctrls = (<FormArray>this.answerForm.get('answers')).controls;
      ctrls[index].get('isCorrect').setValue(this.lastCheckboxValues[index]);
    }
  }

  openImageChooser() {
    (document.getElementById('file_image') as HTMLInputElement).click();
  }

  insertImage($event) {
    const file: File = $event.target.files[0];
    const temp = this;
    const reader: FileReader = new FileReader();
    if (file) {
      reader.onloadend = function(e) {
        if (e.target && e.target['result']) {
          const ext = file.name.split('.');
          const image = {
            data: reader.result.toString().split(',')[1],
            fileExt: ('.' + ext[ext.length - 1]),
            quizSig: temp.selectedQuiz
          };
          temp.service.addQuizAttachment(image).subscribe(res => {
            temp.selectedQuestion = '<img src=\"' + res['data'] + '\">';
          });
        }
      };
      reader.readAsDataURL(file);
    }
  }

  saveQuizQuestion() {
    this.convertHTMLContentToFile(this.selectedQuestion);
  }

  convertHTMLContentToFile(content: string) {
    const temp = this;
    const config = {
      encoding: 'UTF-8',
      type: 'text/html;charset=UTF-8'
    };
    const blob = new Blob([content], config);
    const reader: FileReader = new FileReader();
    reader.onloadend = function(e) {
      if (e.target && e.target['result']) {
        const dataFile = (reader.result.toString()) ? reader.result.toString().split(',')[1] : '';
        const data = {
          data: dataFile,
          fileExt: '.html',
          quizSig: temp.selectedQuiz
        };
        temp.service.updateQuizFile(data).subscribe(resp => {
          temp.isContentEdit = false;
          temp.resetFromSelected();
        });
      }
    };
    reader.readAsDataURL(blob);
  }

  restoreQuiz() {
    this.selectedQuestion = this.lastQuestion;
  }

  viewSolution() {
    const index = this.questionList.map(item => item.signature).indexOf(this.selectedQuiz);
    const sendQuestion = {
      signature: this.selectedQuiz,
      name: this.question.name,
      grpSig: this.question.signature,
      unitSig: this.question.unitSig,
      unitName: this.question.unitName
    };
    const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
    this.cookieService.put('questionDetailInfo', JSON.stringify(sendQuestion), opt);
    if (this.toRouters.length === 3) {
      this.cookieService.remove('routLinks');
    } else {
      this.cookieService.put('routLinks', JSON.stringify(this.toRouters), opt);
    }
    this.router.navigate(['cms/creator/curriculums/curriculum-view/curriculum-unit-list-edit/curriculum-question-view/edit-solution']);
  }

  viewSolutionEmit() {
    const index = this.questionList.map(item => item.signature).indexOf(this.selectedQuiz);
    const sendQuestion = {
      signature: this.selectedQuiz,
      name: this.question.name,
      grpSig: this.question.signature,
      unitSig: this.question.unitSig,
      unitName: this.question.unitName
    };
    const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
    this.cookieService.put('questionDetailInfo', JSON.stringify(sendQuestion), opt);
    if (this.toRouters.length === 3) {
      this.cookieService.remove('routLinks');
    } else {
      this.cookieService.put('routLinks', JSON.stringify(this.toRouters), opt);
    }
    this.solutionEmit.emit({});
  }

  quizTypeChange($event) {
    this.selectedQuizType = JSON.parse($event.target.value.toString());
  }

  getColMd() {
    return 12 / ((this.selectedShowPerRow) ? JSON.parse(this.selectedShowPerRow.toString()) : 1);
  }

  getAnswerControlValue(index) {
    const control = (<FormArray>this.answerForm.get('answers')).controls[index];
    return {
      id: control['controls']['id'].value,
      isCorrect: JSON.parse(control['controls']['isCorrect'].value.toString()),
      text: control['controls']['text'].value,
      isEdit: JSON.parse(control['controls']['isEdit'].value)
    };
  }

  enableAnswerControl(index, editable) {
    const control = (<FormArray>this.answerForm.get('answers')).controls[index];
    control['controls']['isEdit'].setValue(editable);
  }

  removeAnswerControl(index) {
    const control = (<FormArray>this.answerForm.controls['answers']);
    control.removeAt(index);
  }

  updateAnswerControl(index) {
    const control = (<FormArray>this.answerForm.get('answers')).controls[index];
    control['controls']['isEdit'].setValue(false);
  }

  addAnswerControl(index) {
    const control = (<FormArray>this.answerForm.get('answers')).controls[index];
    control['controls']['isEdit'].setValue(false);
    control['controls']['id'].setValue(this.selectedAnswer.length);
    (<FormArray>this.answerForm.get('answers')).push(this.createAnswerControl({}));
  }

  saveAnswerControl(index) {
    const control = (<FormArray>this.answerForm.get('answers')).controls[index];
    if (control['controls']['id'].value.toString()) {
      this.updateAnswerControl(index);
    } else {
      this.addAnswerControl(index);
    }
  }
}
