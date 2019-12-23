import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CURRICULUMSTATUS} from '../../../../models/curriculum-status';
import {CurriculumsService} from '../../../../services/curriculums.service';
import {PagerService} from '../../../../services/pager.service';
import {FormBuilder} from '@angular/forms';
import {ModalDirective} from '../../../../lib/ng-uikit-pro-standard/free/modals';
import {DatePipe} from '@angular/common';
import {AppState} from '../../../../app-state.service';
import {TranslateService} from '@ngx-translate/core';
import {UtilsService} from '../../../../services/utils.service';

@Component({
    selector: 'app-cms-vendor-curriculums',
    templateUrl: './curriculums.component.html',
    styleUrls: ['./curriculums.component.scss']
})
export class CurriculumsComponent implements OnInit {
    cv: any;
    items: Array<any>;
    view_items: Array<any>;
    searchText: string = '';
    step: number = 1;
    // pager object
    pager: any = {};
    pageSize: Array<number> = [5, 10, 15, 20, 25, 50, 75, 100, 150, 200];
    // paged items
    pagedItems: any[];
    @ViewChild('confirmDeleteCV') confirmDeleteCV: ModalDirective;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private service: CurriculumsService,
        private datePipe: DatePipe,
        private translate: TranslateService,
        private pagerService: PagerService,
        private utilsService: UtilsService,
        private appState: AppState) {
    }

    ngOnInit() {
        this.reloadCVList();
    }

    reloadCVList(page?: number) {
        this.items = [];
        this.service.loadCvList({}).subscribe(result => {
            this.items = (result['data']) ? result['data'] : [];
            this.view_items = [];
            this.items.forEach(item => {
                item.units = [];
                this.view_items.push(item);
            });
            if (page) {
                this.setPage(page);
            } else {
                this.setPage(1);
            }
        });
    }

    get CURRICULUMSTATUS() {
        return CURRICULUMSTATUS;
    }

    get getCreateDateInfo() {
        return this.utilsService.getCreateDateInfo;
    }

    updateSearch() {
        const _this = this;
        if (this.searchText === '') {
            this.view_items = this.items;
            _this.setPage(1);
        } else {
            this.view_items = [];
            let run = 0;
            this.items.forEach(item => {
                _this.translate.get(CURRICULUMSTATUS.valueOf(item.status).getDisplay()).subscribe((text: string) => {
                    const check = item.name.toLowerCase().indexOf(_this.searchText.toLowerCase()) >= 0 ||
                        (item.authors.main && item.authors.main.name.toLowerCase().indexOf(_this.searchText.toLowerCase()) >= 0) ||
                        (item.authors.co &&
                            item.authors.co.length > 0 &&
                            item.authors.co.map(c => c.name).join(', ').toLowerCase().indexOf(_this.searchText.toLowerCase()) >= 0) ||
                        item.createdOn.toString().toLowerCase().indexOf(_this.searchText.toLowerCase()) >= 0 ||
                        text.toLowerCase().indexOf(_this.searchText.toLowerCase()) >= 0;
                    if (check) {
                        _this.view_items.push(item);
                    }
                    run++;
                    if (run === _this.items.length) {
                        _this.setPage(1);
                    }
                });
            });
        }
    }

    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }

        if (this.view_items.length < 1) {
            this.pagedItems = [];
            this.pager =  {
                totalItems: 0,
                currentPage: 1,
                pageSize: 10,
                totalPages: 1,
                startPage: 1,
                endPage: 1,
                startIndex: 0,
                endIndex: 0,
                pages: [1]
            };
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(this.view_items.length, page, this.pageSize[0]);

        // get current page of items
        this.pagedItems = this.view_items.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    getCoAuthorsNameList(co) {
        if (co && co.length > 0) {
            return co.map(item => item.name).join(', ');
        }
        return '';
    }

    remove(item) {
        this.cv = item;
        this.confirmDeleteCV.show();
    }

    deleteCV() {
        const item = this.cv;
        this.service.removeCurriculum({cvSig: item.signature}).subscribe(res => {
            if (this.pagedItems.length < 2) {
                this.reloadCVList(this.pager.currentPage - 1);
            } else {
                this.reloadCVList(this.pager.currentPage);
            }
        });
    }
}
