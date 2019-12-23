import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {CKEditor5} from '@ckeditor/ckeditor5-angular';
import {ActivatedRoute, Router} from '@angular/router';
import {CurriculumsService} from '../../../../../services/curriculums.service';
import {CookieService} from 'ngx-cookie';
import {AppState} from '../../../../../app-state.service';

@Component({
  selector: 'app-courses-course-exercises-view',
  templateUrl: './course-exercises-view.component.html',
  styleUrls: ['./course-exercises-view.component.scss']
})
export class CourseExercisesViewComponent implements OnInit {
  exercise: any;
  exerciseList: Array<any> = new Array<any>();
  selectedExercise: any;
  selectedDuration = 0;
  selectedNo = 0;
  selectedName = '';
  selectedPoint = 0;
  selectedQuestion = '';
  selectedSolution = '';
  lastQuestion = '';
  @Output() solutionEmit: EventEmitter<any> = new EventEmitter<any>();
  @Input() toRouters: Array<any>;
  public Editor = ClassicEditor;
  @ViewChild('question_editor') question_editor: CKEditor5.BaseEditor;
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
              private appState: AppState) {
  }

  ngOnInit() {
    const temp = this;
    if (this.cookieService.get('routLinks')) {
      this.toRouters = JSON.parse(this.cookieService.get('routLinks'));
      if (this.toRouters.length === 6 && this.toRouters[3]['display'] !== 'AUTH.PROFILE') {
        this.toRouters.splice(this.toRouters.length - 1);
        delete this.toRouters[this.toRouters.length - 1].link;
        this.toRouters.forEach(lk => {
          if (lk['link']) {
            lk['link'] = lk['link'].replace('../', '');
          }
        });
      }
    }
    if (this.cookieService.get('exerciseInfo')) {
      this.exercise = JSON.parse(this.cookieService.get('exerciseInfo'));
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
            if (document.getElementById('question_area')) {
              temp.loadFile(res2['data'][0].url, 1);
            }
            if (document.getElementById('solution_area')) {
              temp.loadFile(res2['data'][0].solURL);
            }
            this.selectedDuration = (res2['data'][0].doneSecs) ? res2['data'][0].doneSecs : 0;
            this.selectedNo = (res2['data'][0].no) ? res2['data'][0].no : 0;
            this.selectedName = (res2['data'][0].name) ? res2['data'][0].name : '';
            this.selectedPoint = (res2['data'][0].point) ? res2['data'][0].point : 0;
          });
        } else {
          this.selectedExercise = -1;
          this.selectedDuration = -1;
          this.selectedNo = 0;
          this.selectedName = '';
          this.exerciseList = [{
            signature: -1,
            name: 'No exercise'
          }];
        }
      });
    }
  }

  updateExercise($event) {
    const temp = this;
    this.selectedExercise = $event.target.value;
    if (this.selectedExercise.toString() === '-1') {
      this.selectedDuration = 0;
      this.selectedPoint = 0;
      this.selectedNo = 0;
      this.selectedName = '';
      this.selectedQuestion = '';
      this.lastQuestion = '';
    } else {
      const index = this.exerciseList.map(item => item.signature).indexOf(this.selectedExercise.toString());
      this.service.loadExercise({
        lang: this.appState.locale.lang,
        exerciseSig: this.selectedExercise
      }).subscribe(res2 => {
        if (document.getElementById('question_area')) {
          temp.loadFile(res2['data'][0].url, 1);
        }
        if (document.getElementById('solution_area')) {
          temp.loadFile(res2['data'][0].solURL);
        }
        this.selectedDuration = (res2['data'][0].doneSecs) ? res2['data'][0].doneSecs : 0;
        this.selectedNo = (res2['data'][0].no) ? res2['data'][0].no : 0;
        this.selectedName = (res2['data'][0].name) ? res2['data'][0].name : '';
        this.selectedPoint = (res2['data'][0].point) ? res2['data'][0].point : 0;
      });
    }
  }

  loadFile(filePath, type?) {
    if (filePath) {
      const xmlhttp = new XMLHttpRequest();
      xmlhttp.open('GET', 'https://cors-anywhere.herokuapp.com/' + filePath, false);
      xmlhttp.send();
      if (xmlhttp.status === 200) {
        const result = xmlhttp.responseText;
        if (type === 1) {
          this.selectedQuestion = result;
          this.lastQuestion = this.selectedQuestion;
        } else {
          this.selectedSolution = result;
        }
      }
    } else {
      if (type === 1) {
        this.selectedQuestion = '';
        this.lastQuestion = '';
      } else {
        this.selectedSolution = '';
      }
    }
  }

  processExerciseNoList(exerciseList: Array<any>) {
    exerciseList.sort((a, b) => a.no - b.no);
    for (let i = 0; i < exerciseList.length; i++) {
      exerciseList[i].no = i;
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
            exerciseSig: temp.selectedExercise
          };
          temp.service.addExerciseAttachment(image).subscribe(res => {
            const editor = temp.question_editor.editorInstance;
            const content = '<img src=\"' + res['data'] + '\">';
            const viewFragment = editor.data.processor.toView( content );
            const modelFragment = editor.data.toModel( viewFragment );
            editor.model.insertContent( modelFragment );
          });
        }
      };
      reader.readAsDataURL(file);
    }
  }
}
