import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CurriculumsService} from '../../../../../services/curriculums.service';
import {CookieService} from 'ngx-cookie';
import {AppState} from '../../../../../app-state.service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CURRICULUM_GROUP_TYPE} from '../../../../../models/cvgroup-type.enum';

@Component({
    selector: 'app-cms-creator-curriculum-view',
    templateUrl: './curriculum-view.component.html',
    styleUrls: ['./curriculum-view.component.scss']
})
export class CurriculumViewComponent implements OnInit, OnDestroy {
    cv: any;
    isEditInfo: boolean = false;
    types: any;
    subtitlesLanguages: Array<any> = new Array<any>();
    @Input() toRouters: Array<any>;
    @Output() viewUnitsDetail: EventEmitter<any> = new EventEmitter<any>();
    editable: boolean = true;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private service: CurriculumsService,
                private cookieService: CookieService,
                private formBuilder: FormBuilder,
                private appState: AppState) {
    }

    ngOnInit() {
        if (this.cookieService.get('editable')) {
            this.editable = JSON.parse(this.cookieService.get('editable')).editable;
        }
        this.cv = JSON.parse(this.cookieService.get('cvInfo'));
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
                        display: 'CREATOR.CURRICULUMS.LIST.View'
                    }
                ];
            }
        }
        this.service.loadCv({cvSig: this.cv.signature}).subscribe(result => {
            this.service.loadCategoryList().subscribe(res => {
                this.service.loadSubtitleLang({lang: this.appState.locale.lang}).subscribe(res2 => {
                    this.cv = result['data'];
                    this.types = res['data'];
                    this.subtitlesLanguages = res2['data'];
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
            signature: cv.signature
        };
        const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
        this.cookieService.put('cvInfo', JSON.stringify(cv), opt);
        this.cookieService.put('editable', JSON.stringify({editable: this.editable}), opt);
        if (this.toRouters.length === 2) {
            this.cookieService.remove('routLinks');
        } else {
            this.cookieService.put('routLinks', JSON.stringify(this.toRouters), opt);
        }
        this.router.navigate(['cms/creator/curriculums/curriculum-view/curriculum-unit-list-edit']);
    }

    showCurriculumInfo() {
        this.cookieService.remove('cvInfo');
        const cv = {
            signature: this.cv.signature
        };
        const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
        this.cookieService.put('cvInfo', JSON.stringify(cv), opt);
        this.cookieService.put('editable', JSON.stringify({editable: true}), opt);
        const toRouters = [
            {
                link: '../../',
                display: 'CREATOR.CURRICULUMS.LIST.Curriculums'
            },
            {
                link: '../',
                display: 'CREATOR.CURRICULUMS.LIST.View'
            },
            {
                display: 'CREATOR.CURRICULUMS.Information'
            }
        ];
        this.cookieService.put('toRouters', JSON.stringify(toRouters), opt);
        this.router.navigate(['cms/creator/curriculums/curriculum-view/curriculum-edit-info']);
    }
}
