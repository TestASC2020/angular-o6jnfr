import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CurriculumsService} from '../../../../../../services/curriculums.service';
import {AppState} from '../../../../../../app-state.service';
import {CookieService} from 'ngx-cookie';
import {ActivatedRoute, Router} from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
    selector: 'app-cms-creator-curriculum-edit-info',
    templateUrl: './curriculum-edit-info.component.html',
    styleUrls: ['./curriculum-edit-info.component.scss']
})
export class CurriculumEditInfoComponent implements OnInit {
    cv: any;
    infoForm: FormGroup;
    types: any;
    subtitlesLanguages: Array<any> = new Array<any>();
    @Input() toRouters: Array<any>;
    editable: boolean = true;
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
            'undo',
            'redo'
        ]
    };

    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private route: ActivatedRoute,
                private service: CurriculumsService,
                private cookieService: CookieService,
                private appState: AppState) {
        this.infoForm = new FormGroup({
            type: new FormControl('', [Validators.required]),
            title: new FormControl('', [Validators.required]),
            objectives: new FormControl('', [Validators.required]),
            expectations: new FormControl('', [Validators.required]),
            requirements: new FormControl(''),
            materials: new FormControl(''),
            description: new FormControl(''),
            subtitles: this.formBuilder.group({})
        });
    }

    ngOnInit() {
        if (!this.toRouters || (this.toRouters && this.toRouters.length > 0)) {
            if (this.cookieService.get('toRouters')) {
                this.toRouters = JSON.parse(this.cookieService.get('toRouters'));
            }
            if (!this.toRouters) {
                this.toRouters = [
                    {
                        link: '../../curriculums',
                        display: 'CREATOR.CURRICULUMS.LIST.Curriculums'
                    },
                    {
                        link: '../',
                        display: 'CREATOR.CURRICULUMS.LIST.View'
                    },
                    {
                        display: 'CREATOR.CURRICULUMS.General_Information'
                    }
                ];
            }
        }
        if (this.cookieService.get('cvInfo')) {
            this.service.loadCv({cvSig: JSON.parse(this.cookieService.get('cvInfo'))['signature']} ).subscribe(result => {
                this.service.loadCategoryList().subscribe(res => {
                    this.service.loadSubtitleLang({lang: this.appState.locale.lang}).subscribe(res2 => {
                        this.cv = result['data'];
                        this.types = res['data'];
                        if (this.types.filter(it => it.name === this.cv.category).length > 0) {
                            this.infoForm.get('type').setValue(this.types.filter(it => it.name === this.cv.category)[0].id);
                        } else {
                            this.infoForm.get('type').setValue(this.types[0].id);
                        }
                        this.infoForm.get('title').setValue((this.cv.name) ? this.cv.name : '');
                        this.infoForm.get('objectives').setValue((this.cv.objectives) ? this.cv.objectives : '');
                        this.infoForm.get('expectations').setValue((this.cv.expectations) ? this.cv.expectations : '');
                        this.infoForm.get('requirements').setValue((this.cv.requirements) ? this.cv.requirements : '');
                        this.infoForm.get('description').setValue((this.cv.description) ? this.cv.description : '');
                        this.infoForm.get('materials').setValue((this.cv.material) ? this.cv.material : '');
                        this.subtitlesLanguages = res2['data'];
                        this.subtitlesLanguages.forEach((option: any) => {
                            const subtitles = <FormGroup>this.infoForm.get('subtitles');
                            let check = false;
                            if (this.cv.subtitles && this.cv.subtitles.length > 0) {
                                check = !(this.cv.subtitles.indexOf(option.tag) < 0);
                            }
                            subtitles.addControl(option.text, new FormControl(check));
                        });
                    });
                });
            });
        }
    }

    updateCvInfo() {
        if (!this.infoForm.invalid) {
            // save info
            const typeId = this.infoForm.get('type').value;
            const type = this.types.filter(item => item.id === typeId)[0].name;
            const subtitles = this.infoForm.get('subtitles').value;
            const sub: Array<number> = new Array<number>();
            Object.keys(subtitles).forEach(key => {
                if (subtitles[key]) {
                    sub.push(this.subtitlesLanguages[this.subtitlesLanguages.map(item => item.text).indexOf(key)].tag);
                }
            });
            const data = {
                cvSig: this.cv.signature,
                category: type,
                name: this.infoForm.get('title').value,
                material: this.infoForm.get('materials').value,
                description: this.infoForm.get('description').value,
                objectives: this.infoForm.get('objectives').value,
                expectations: this.infoForm.get('expectations').value,
                requirements: this.infoForm.get('requirements').value,
                subtitles: sub
            };
            this.service.updateCvInfo(data).subscribe(res => {
                this.goBack();
            });
        }
    }

    get subtitles(): FormArray {
        return this.infoForm.get('subtitles') as FormArray;
    }

    goBack() {
        this.cookieService.remove('cvInfo');
        const cv = {
            signature: this.cv.signature
        };
        const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
        this.cookieService.put('cvInfo', JSON.stringify(cv), opt);
        this.cookieService.put('editable', JSON.stringify({editable: true}), opt);
        const toRouters = [
            {
                link: '../../curriculums',
                display: 'CREATOR.CURRICULUMS.LIST.Curriculums'
            },
            {
                display: 'CREATOR.CURRICULUMS.LIST.View'
            }
        ];
        this.cookieService.put('toRouters', JSON.stringify(toRouters), opt);
        this.router.navigate(['cms/creator/curriculums/curriculum-view']);
    }
}