import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CurriculumsService} from '../../../../../services/curriculums.service';
import {CookieService} from 'ngx-cookie';
import {AppState} from '../../../../../app-state.service';
import {ModalDirective} from '../../../../../lib/ng-uikit-pro-standard/free/modals';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CURRICULUM_GROUP_TYPE} from '../../../../../models/cvgroup-type.enum';

@Component({
    selector: 'app-cms-vendor-curriculum-view',
    templateUrl: './curriculum-view.component.html',
    styleUrls: ['./curriculum-view.component.scss']
})
export class CurriculumViewComponent implements OnInit, OnDestroy {
    cv: any;
    isEditInfo: boolean = false;
    infoForm: FormGroup;
    types: any;
    subtitlesLanguages: Array<any> = new Array<any>();
    @Input() toRouters: Array<any>;
    @Output() viewUnitsDetail: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('curriculumInfo') curriculumInfo: ModalDirective;
    @Input() editable: boolean = null;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private service: CurriculumsService,
                private cookieService: CookieService,
                private formBuilder: FormBuilder,
                private appState: AppState) {
        this.infoForm = new FormGroup({
            type: new FormControl('', [Validators.required]),
            title: new FormControl('', [Validators.required]),
            learning_objective: new FormControl('', [Validators.required]),
            goals_and_expectations: new FormControl('', [Validators.required]),
            materials: new FormControl(''),
            subtitles: this.formBuilder.group({})
        });
    }

    ngOnInit() {
        this.cv = JSON.parse(this.cookieService.get('cvInfo'));
        this.service.loadCv({cvSig: this.cv.signature}).subscribe(result => {
            this.service.loadCategoryList().subscribe(res => {
                this.service.loadSubtitleLang({lang: this.appState.locale.lang}).subscribe(res2 => {
                    this.cv = result['data'];
                    if (this.editable === null && this.cookieService.get('editable')) {
                        this.editable = JSON.parse(this.cookieService.get('editable')).editable;
                    }
                    if (!this.toRouters || (this.toRouters && this.toRouters.length > 0)) {
                        if (this.cookieService.get('routLinks')) {
                            this.toRouters = JSON.parse(this.cookieService.get('routLinks'));
                            if (this.toRouters.length > 0 && this.toRouters[0]['display'].toString().indexOf('REQUEST_FOR_QUOTE') >= 0) {
                                this.toRouters = [
                                    {
                                        'link': '../../quotation/request-for-quote',
                                        'display': 'SIDEBAR.QUOTATIONS.REQUEST_FOR_QUOTE.NAME'
                                    },
                                    {
                                        'display': this.cv.name
                                    }
                                ];
                            }
                        }
                      if (!this.toRouters || this.toRouters === null) {
                            this.toRouters = [
                                {
                                    link: '../../curriculums',
                                    display: 'CREATOR.CURRICULUMS.LIST.Curriculums'
                                },
                                {
                                    display: this.cv.name
                                }
                            ];
                        }
                    }
                    this.types = res['data'];
                    if (this.types.filter(it => it.name === this.cv.category).length > 0) {
                        this.infoForm.get('type').setValue(this.types.filter(it => it.name === this.cv.category)[0].id);
                    } else {
                        this.infoForm.get('type').setValue(this.types[0].id);
                    }
                    this.infoForm.get('title').setValue(this.cv.name);
                    this.infoForm.get('learning_objective').setValue(this.cv.objectives);
                    this.infoForm.get('goals_and_expectations').setValue(this.cv.requirements);
                    this.infoForm.get('materials').setValue(this.cv.material);
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

    ngOnDestroy(): void {
        this.viewUnitsDetail.complete();
    }

    openUnitsList(cv) {
        this.cookieService.remove('cvInfo');
        cv = {
            name: cv.name,
            signature: cv.signature
        };
        const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
        this.cookieService.put('cvInfo', JSON.stringify(cv), opt);
        this.cookieService.put('editable', JSON.stringify({editable: this.editable}), opt);
        if (this.toRouters.length === 2) {
            if (this.toRouters.length > 0 && this.toRouters[0]['display'].toString().indexOf('REQUEST_FOR_QUOTE') >= 0) {
                this.toRouters = [
                    {
                        'link': '../../../vendor/quotation/request-for-quote',
                        'display': 'SIDEBAR.QUOTATIONS.REQUEST_FOR_QUOTE.NAME'
                    },
                    {
                        'link': '../../../vendor/curriculums/curriculum-view',
                        'display': 'CREATOR.CURRICULUMS.Details'
                    },
                    {
                        'display': 'LAYOUT.EDIT'
                    }
                ];
                this.cookieService.put('routLinks', JSON.stringify(this.toRouters), opt);
            } else {
                this.cookieService.remove('routLinks');
            }
        } else {
            this.cookieService.put('routLinks', JSON.stringify(this.toRouters), opt);
        }
        this.router.navigate(['cms/vendor/curriculums/curriculum-view/curriculum-unit-list-edit']);
    }

    get CURRICULUM_GROUP_TYPE() {
        return CURRICULUM_GROUP_TYPE;
    }

    get console() {
        return console;
    }

    get subtitles(): FormArray {
        return this.infoForm.get('subtitles') as FormArray;
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
                objectives: this.infoForm.get('learning_objective').value,
                requirements: this.infoForm.get('goals_and_expectations').value,
                subtitles: sub
            };
            this.service.updateCvInfo(data).subscribe(res => {
                this.cv.name = data.name;
                this.cv.category = data.category;
                this.cv.material = data.material;
                this.cv.objectives = data.objectives;
                this.cv.requirements = data.requirements;
            });
        }
    }
}
