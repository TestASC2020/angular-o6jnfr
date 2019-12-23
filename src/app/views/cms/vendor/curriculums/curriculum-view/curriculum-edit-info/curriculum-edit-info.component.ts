import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CurriculumsService} from '../../../../../../services/curriculums.service';
import {AppState} from '../../../../../../app-state.service';
import {CookieService} from 'ngx-cookie';

@Component({
    selector: 'app-cms-vendor-curriculum-edit-info',
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

    constructor(private formBuilder: FormBuilder,
                private service: CurriculumsService,
                private cookieService: CookieService,
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
        if (!this.toRouters || (this.toRouters && this.toRouters.length > 0)) {
            if (this.cookieService.get('routLinks')) {
                this.toRouters = JSON.parse(this.cookieService.get('routLinks'));
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

    get subtitles(): FormArray {
        return this.infoForm.get('subtitles') as FormArray;
    }
}