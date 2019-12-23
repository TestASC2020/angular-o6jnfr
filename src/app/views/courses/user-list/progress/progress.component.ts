import {Component, OnInit} from '@angular/core';
import {PagerService} from '../../../../services/pager.service';
import {CookieService} from 'ngx-cookie';
import {CoursesService} from '../../../../services/courses.service';

@Component({
    selector: 'app-user-list',
    templateUrl: './progress.component.html',
    styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {
    items: Array<any> = new Array<any>();
    userCrs: any;
    pager: any = {};
    pageSize: Array<number> = [5, 10, 15, 20];
    toRouters: Array<any>;
    // paged items
    pagedItems: any[];
    constructor(
        private cookieService: CookieService,
        private service: CoursesService,
        private pagerService: PagerService
    ) {
        this.items = [
            {
                id: 0,
                name: 'Introduction to Forex ',
                required: '5',
                learned: '5',
                percent: '100%',
            },
            {
                id: 1,
                name: 'Buying and Selling',
                required: '15',
                learned: '10',
                percent: '7%',
            },
            {
                id: 2,
                name: 'Chart Analysis',
                required: '20',
                learned: '0',
                percent: '0',
            },
            {
                id: 3,
                name: 'Technical Indicators',
                required: '25',
                learned: '0',
                percent: '0',
            },
            {
                id: 4,
                name: 'Fundamental Analysis',
                required: '30',
                learned: '15',
                percent: '30%',
            },
        ];
    }

    ngOnInit() {
        if (this.cookieService.get('toRouters')) {
            this.toRouters = JSON.parse(this.cookieService.get('toRouters'));
        } else {
            this.toRouters = [
                {
                    'link': '../../user-list',
                    'display': 'Courses.User_List'
                },
                {
                    'display': 'CREATOR.CURRICULUMS.progress'
                }
            ];
        }
        const _this = this;
        if (this.cookieService.get('userCrs')) {
            this.userCrs = JSON.parse(this.cookieService.get('userCrs'));
            _this.service.LoadCrsProgess({userCrsSig: _this.userCrs.userCrsSig}).subscribe(resp1 => {
               _this.items = resp1['data'];
            });
        }
    }
}
