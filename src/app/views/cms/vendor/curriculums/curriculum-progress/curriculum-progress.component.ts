import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {PagerService} from '../../../../../services/pager.service';
import {CurriculumsService} from '../../../../../services/curriculums.service';
import {CookieService} from 'ngx-cookie';
import {AppState} from '../../../../../app-state.service';
import {TASKSTATUS} from '../../../../../models/task-status';

@Component({
    selector: 'app-cms-vendor-curriculum-progress',
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
        this.service.LoadCvQuoteProgress({cvSig: this.cv.signature, lang: this.appState.locale.lang}).subscribe(result => {
            this.progress = result['data'];
        });
    }

    get TASKSTATUS() {
        return TASKSTATUS;
    }

    save() {}
}
