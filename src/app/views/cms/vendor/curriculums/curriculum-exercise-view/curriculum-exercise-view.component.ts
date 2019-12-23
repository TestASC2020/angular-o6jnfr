import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {CurriculumsService} from '../../../../../services/curriculums.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';
import {AppState} from '../../../../../app-state.service';
import {AppSharedService} from '../../../../../app-shared.service';
import {DomSanitizer} from '@angular/platform-browser';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {UtilsService} from '../../../../../services/utils.service';

@Component({
  selector: 'app-cms-vendor-curriculum-exercise-view',
  templateUrl: './curriculum-exercise-view.component.html',
  styleUrls: ['./curriculum-exercise-view.component.scss']
})
export class CurriculumExerciseViewComponent implements OnInit, OnDestroy {
  isEdit: boolean = false;
  isContentEdit: boolean = false;
  exercise: any;
  exerciseList: Array<any> = new Array<any>();
  selectedExercise: any;
  selectedDuration = 0;
  selectedNo = 0;
  selectedName = '';
  selectedPoint = 0;
  canSubmit: boolean = true;
  selectedQuestion = '';
  selectedSolution = '';
  lastQuestion = '';
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
  }

  ngOnDestroy() {
    this.solutionEmit.complete();
  }

  doInit() {
    if (!this.toRouters) {
      this.toRouters = [
        {
          'link': '../../../',
          'display': 'MESSAGE.NameList.Curriculums'
        },
        {
          'link': '../',
          'display': 'MESSAGE.NameList.Units'
        },
        {
          'display': 'MESSAGE.Exercise'
        },
      ];
    }
  }

  ngOnInit() {
    if (this.editable === null && this.cookieService.get('editable')) {
        this.editable = JSON.parse(this.cookieService.get('editable')).editable;
    }
    if (this.cookieService.get('exerciseInfo')) {
      this.exercise = JSON.parse(this.cookieService.get('exerciseInfo'));
      if ((!this.toRouters || this.toRouters === null) && this.cookieService.get('routLinks')) {
        this.toRouters = JSON.parse(this.cookieService.get('routLinks'));
        if (this.toRouters.length > 0 &&
          this.toRouters[this.toRouters.length - 1].display === 'CREATOR.CURRICULUMS.QUESTION.EditSolution') {
          this.toRouters.forEach(lk => {
            lk.link = (lk.link) ? lk.link.replace('../', '') : null;
          });
          const len = this.toRouters.length;
          this.toRouters[len - 2].link = null;
          this.toRouters.splice(len - 1, 1);
        }
      }
      this.service.loadExerciseByGroup({lang: this.appState.locale.lang,
        grpSig: this.exercise.signature, subLang: 1}).subscribe(res => {
        this.exerciseList = res['data'];
        this.processExerciseNoList(this.exerciseList);
        if (this.exerciseList.length > 0) {
          this.selectedExercise = this.exerciseList[0].signature;
          this.service.loadExercise({
            lang: this.appState.locale.lang,
            exerciseSig: this.exerciseList[0].signature
          }).subscribe(res2 => {
            this.selectedDuration = (res2['data'][0].doneSecs) ? res2['data'][0].doneSecs : 0;
            this.selectedNo = (res2['data'][0].no) ? res2['data'][0].no : 0;
            this.selectedName = (res2['data'][0].name) ? res2['data'][0].name : '';
            this.selectedPoint = (res2['data'][0].point) ? res2['data'][0].point : 0;
            this.doInit();
            this.loadFile(res2['data'][0].url, res2['data'][0].solURL);
          });
        } else {
          this.selectedExercise = -1;
          this.selectedDuration = -1;
          this.selectedNo = 0;
          this.selectedName = '';
          this.exerciseList = [{
            signature: -1,
            name: 'VENDOR.No_Question'
          }];
          this.canSubmit = false;
          this.doInit();
        }
      });
    }
  }

  updateExercise($event) {
    this.selectedExercise = $event.target.value;
    this.resetFromSelected();
  }

  resetFromSelected() {
    this.selectedQuestion = '';
    this.lastQuestion = '';
    this.selectedSolution = '';
    this.selectedDuration = 0;
    this.selectedPoint = 0;
    this.selectedNo = 0;
    this.selectedName = '';
    this.isEdit = false;
    if (this.selectedExercise.toString() === '-1') {
      this.selectedDuration = 0;
      this.selectedPoint = 0;
      this.selectedNo = 0;
      this.selectedName = '';
      this.selectedQuestion = '';
      this.lastQuestion = '';
      this.canSubmit = false;
    } else {
      this.canSubmit = true;
      const index = this.exerciseList.map(item => item.signature).indexOf(this.selectedExercise.toString());
      this.service.loadExercise({
        lang: this.appState.locale.lang,
        exerciseSig: this.selectedExercise
      }).subscribe(res2 => {
        this.selectedDuration = (res2['data'][0].doneSecs) ? res2['data'][0].doneSecs : 0;
        this.selectedNo = (res2['data'][0].no) ? res2['data'][0].no : 0;
        this.selectedName = (res2['data'][0].name) ? res2['data'][0].name : '';
        this.selectedPoint = (res2['data'][0].point) ? res2['data'][0].point : 0;
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

  createNewPractice() {
    const data = {
      no: (this.exerciseList.length > 0) ? this.exerciseList.length : 0,
      name: '',
      point: 0,
      doneSecs: 0,
      fileExt: '.html',
      data: '',
      grpSig: this.exercise.signature
    };
    this.service.addExercise(data).subscribe(res => {
      const index = this.exerciseList.map(item => item.signature).indexOf('-1');
      if (index > -1) {
        this.exerciseList.splice(index, 1);
      }
      const exer = {
        signature: res['data'].signature,
        name: res['data'].name
      };
      this.exerciseList.push(exer);
      this.isEdit = false;
      this.isContentEdit = false;
      this.canSubmit = true;
      this.selectedExercise = this.exerciseList[this.exerciseList.length - 1].signature;;
      this.resetFromSelected();
    });
  }

  processExerciseNoList(exerciseList: Array<any>) {
    exerciseList.sort((a, b) => a.no - b.no);
    for (let i = 0; i < exerciseList.length; i++) {
      exerciseList[i].no = i;
    }
  }

  deleteExercise() {
    if (this.selectedExercise.toString() === '-1') {
      return;
    }
    const data = {
      exerciseSig: this.selectedExercise
    };
    this.service.removeExercise(data).subscribe(res => {
      const index = this.exerciseList.map(item => item.signature).indexOf(this.selectedExercise.toString());
      this.exerciseList.splice(index, 1);
      if (this.exerciseList.length > 0) {
        this.selectedExercise = this.exerciseList[0].signature;
        if (this.selectedExercise === -1) {
          this.canSubmit = false;
        } else {
          this.canSubmit = true;
        }
      } else {
        this.selectedExercise = -1;
        this.exerciseList = [{
          signature: -1,
          name: 'No exercise'
        }];
        this.canSubmit = false;
      }
      this.isEdit = false;
      this.isContentEdit = false;
      this.resetFromSelected();
    });
  }

  saveExercise() {
    const no = ((document.getElementById('no') as HTMLInputElement).value) ?
      JSON.parse((document.getElementById('no') as HTMLInputElement).value) : 0;
    const name = ((document.getElementById('name') as HTMLInputElement).value) ?
      (document.getElementById('name') as HTMLInputElement).value : '';
    const point = ((document.getElementById('point') as HTMLInputElement).value) ?
      JSON.parse((document.getElementById('point') as HTMLInputElement).value) : 0;
    const doneSecs = ((document.getElementById('duration') as HTMLInputElement).value) ?
      JSON.parse((document.getElementById('duration') as HTMLInputElement).value) : 0;
    const data = {
      no: no,
      name: name,
      point: Number.parseFloat(point.toString()),
      doneSecs: Number.parseInt(doneSecs.toString(), 10),
      exerciseSig: this.selectedExercise.toString()
    };
    this.service.updateExercise(data).subscribe(res => {
      const index = this.exerciseList.map(item => item.signature).indexOf(this.selectedExercise.toString());
      this.exerciseList[index].name = name;
      this.isEdit = false;
      this.resetFromSelected();
    });
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
            exerciseSig: temp.selectedExercise
          };
          temp.service.addExerciseAttachment(image).subscribe(res => {
            temp.selectedQuestion = '<img src=\"' + res['data'] + '\">';
          });
        }
      };
      reader.readAsDataURL(file);
    }
  }

  saveExerciseQuestion() {
    this.convertHTMLContentToFile(this.selectedQuestion);
  }

  restoreQuestion() {
    this.selectedQuestion = this.lastQuestion;
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
          exerciseSig: temp.selectedExercise
        };
        temp.service.updateExerciseFile(data).subscribe(resp => {
          temp.isContentEdit = false;
          temp.resetFromSelected();
        });
      }
    };
    reader.readAsDataURL(blob);
  }

  viewSolution() {
    const sendExercise = {
      signature: this.selectedExercise,
      name: this.exercise.name,
      grpSig: this.exercise.signature,
      unitSig: this.exercise.unitSig,
      unitName: this.exercise.unitName,
      cvName: this.exercise.cvName
    };
    const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
    this.cookieService.put('exerciseDetailInfo', JSON.stringify(sendExercise), opt);
    const displays =  this.toRouters.map(it => it.display);
    if (this.toRouters.length === 3 && displays.indexOf('SIDEBAR.QUOTATIONS.ORDER_PROCESSING.NAME') < 0) {
      this.cookieService.remove('routLinks');
    } else {
      if (this.toRouters.length > 0) {
        for (let i = 0; i < this.toRouters.length - 1; i++) {
          this.toRouters[i].link = '../' + this.toRouters[i].link;
        }
        this.toRouters[this.toRouters.length - 1].link = '../';
        this.toRouters.push({display: 'CREATOR.CURRICULUMS.QUESTION.EditSolution'});
      }
      this.cookieService.put('routLinks', JSON.stringify(this.toRouters), opt);
    }
    this.router.navigate(['cms/vendor/curriculums/curriculum-view/curriculum-unit-list-edit/curriculum-exercise-view/edit-solution']);
  }

  viewSolutionEmit() {
    const sendExercise = {
      signature: this.selectedExercise,
      name: this.exercise.name,
      grpSig: this.exercise.signature,
      unitSig: this.exercise.unitSig,
      unitName: this.exercise.unitName,
      cvName: this.exercise.cvName
    };
    const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
    this.cookieService.put('exerciseDetailInfo', JSON.stringify(sendExercise), opt);
    const displays =  this.toRouters.map(it => it.display);
    if (this.toRouters.length === 3 && displays.indexOf('SIDEBAR.QUOTATIONS.ORDER_PROCESSING.NAME') < 0) {
      this.cookieService.remove('routLinks');
    } else {
      if (this.toRouters.length > 0) {
        for (let i = 0; i < this.toRouters.length - 1; i++) {
          this.toRouters[i].link = '../' + this.toRouters[i].link;
        }
        this.toRouters[this.toRouters.length - 1].link = '../';
        this.toRouters.push({display: 'CREATOR.CURRICULUMS.QUESTION.EditSolution'});
      }
      this.cookieService.put('routLinks', JSON.stringify(this.toRouters), opt);
    }
    this.solutionEmit.emit({});
  }
}
