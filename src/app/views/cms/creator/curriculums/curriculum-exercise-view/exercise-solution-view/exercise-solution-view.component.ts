import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {ActivatedRoute, Router} from '@angular/router';
import {CurriculumsService} from '../../../../../../services/curriculums.service';
import {CookieService} from 'ngx-cookie';
import {AppState} from '../../../../../../app-state.service';
import {UtilsService} from '../../../../../../services/utils.service';

@Component({
    selector: 'app-cms-creator-exercise-solution-view',
    templateUrl: './exercise-solution-view.component.html',
    styleUrls: ['./exercise-solution-view.component.scss']
})
export class ExerciseSolutionViewComponent implements OnInit, OnDestroy {
    exercise: any;
    exerciseDetail: any;
    lastSolution = '';
    @Input() toRouters: Array<any>;
    @Input() editable: boolean = null;
    @Output() emit: EventEmitter<any> = new EventEmitter<any>();
    // File video upload
    error: any;
    selectedIndex: number;
    uploadResponse = { status: '', message: '', filePath: '' };
    public Editor = ClassicEditor;
    solutionContent: string = '';
    configs: any = {
        // plugins: [Image, ImageToolbar, ImageCaption, ImageStyle],
        toolbar: ['heading',
            '|',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            'blockQuote',
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
                private utilsService: UtilsService,
                private appState: AppState) {
    }

    ngOnDestroy() {
        this.emit.complete();
    }

    ngOnInit() {
      if (this.editable === null && this.cookieService.get('editable')) {
        this.editable = JSON.parse(this.cookieService.get('editable')).editable;
      }
        if (this.cookieService.get('routLinks') && !this.toRouters) {
            this.toRouters = JSON.parse(this.cookieService.get('routLinks'));
        }
        if (this.cookieService.get('exerciseDetailInfo')) {
            this.exercise = JSON.parse(this.cookieService.get('exerciseDetailInfo'));
            this.service.loadExercise({lang: this.appState.locale.lang,
                exerciseSig: this.exercise.signature}).subscribe(res => {
                if (res['data'].length > 0) {
                    this.exerciseDetail = res['data'][0];
                    this.utilsService.loadFile(this.exerciseDetail.solURL).then(resp => {
                        this.solutionContent = resp;
                        this.lastSolution = resp;
                    });
                }
                this.doInit();
            });
        }
    }
    doInit() {
        if (!this.toRouters) {
            this.toRouters = [
                {
                    'link': '../../../../',
                    'display': 'Curriculums'
                },
                {
                    'link': '../../',
                    'display': 'Units'
                },
                {
                    'link': '../',
                    'display': 'Exercise'
                },
                {
                    'display': 'Solution'
                },
            ];
        }
    }

    onSubmit() {
        // do something here
    }
    save() {
        // do something here
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
                        exerciseSig: temp.exerciseDetail.signature
                    };
                    temp.service.addExerciseAttachment(image).subscribe(res => {
                        temp.solutionContent = '<img src=\"' + res['data'] + '\">';
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    }

    saveExerciseSolution() {
        this.convertHTMLContentToFile(this.solutionContent, false);
    }

    saveExerciseEmitSolution() {
        this.convertHTMLContentToFile(this.solutionContent, true);
    }

    convertHTMLContentToFile(content: string, emit: boolean) {
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
                    exerciseSig: temp.exerciseDetail.signature
                };
                temp.service.addExerciseSolution(data).subscribe(resp => {
                    temp.lastSolution = temp.solutionContent;
                    if (!emit) {
                        window.history.back();
                    } else {
                        temp.emit.emit({});
                    }
                });
            }
        };
        reader.readAsDataURL(blob);
    }

    restoreContent() {
        this.solutionContent = this.lastSolution;
    }
}
