import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PagerService} from '../../../../../services/pager.service';
import {CurriculumsService} from '../../../../../services/curriculums.service';
import {CookieService} from 'ngx-cookie';
import {AppState} from '../../../../../app-state.service';
import {TASKSTATUS} from '../../../../../models/task-status';

@Component({
    selector: 'app-cms-creator-curriculum-progress',
    templateUrl: './curriculum-progress.component.html',
    styleUrls: ['./curriculum-progress.component.scss']
})
export class CurriculumProgressComponent implements OnInit {
    cv: any;
    progress: any;
    decideList: Array<any> = [];
    constructor(private router: Router,
                private route: ActivatedRoute,
                private cookieService: CookieService,
                private formBuilder: FormBuilder,
                private appState: AppState,
                private pagerService: PagerService,
                private service: CurriculumsService) {
    }
    ngOnInit() {
        this.cv = JSON.parse(this.cookieService.get('cvInfo'));
        this.service.loadCv({cvSig: this.cv.signature}).subscribe(result => {
            this.cv = result['data'];
            this.service.LoadCvQuoteProgress({cvSig: this.cv.signature, lang: this.appState.locale.lang}).subscribe(result1 => {
                this.progress = result1['data'];
            });
        });
    }

    get TASKSTATUS() {
        return TASKSTATUS;
    }

    save() {}

    openProgressLog(selectedUnit) {
        const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
        this.cookieService.put('cvInfo', JSON.stringify(this.cv), opt);
        const unit = {
            name: selectedUnit.name,
            signature: selectedUnit.signature
        };
        const unitsList = [];
        this.progress.units.forEach(un => {
           const uni = {
               name: un.name,
               signature: un.signature
           };
           unitsList.push(uni);
        });
        this.cookieService.put('unitInfo', JSON.stringify(unit), opt);
        this.cookieService.put('unitsListInfo', JSON.stringify(unitsList), opt);
        this.router.navigate(['cms/creator/curriculums/progress/progress-log']);
    }
}
