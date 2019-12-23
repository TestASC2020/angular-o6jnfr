import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CURRICULUMSTATUS} from '../../../../models/curriculum-status';
import {CurriculumsService} from '../../../../services/curriculums.service';
import {FormBuilder} from '@angular/forms';
import {ModalDirective} from '../../../../lib/ng-uikit-pro-standard/free/modals';
import {DatePipe} from '@angular/common';
import {UtilsService} from '../../../../services/utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastService} from '../../../../lib/ng-uikit-pro-standard/pro/alerts';
import {PagerService} from '../../../../services/pager.service';

@Component({
    selector: 'app-cms-creator-curriculums',
    templateUrl: './curriculums.component.html',
    styleUrls: ['./curriculums.component.scss']
})
export class CurriculumsComponent implements OnInit {
    cv: any;
    items: Array<any> = new Array<any>();
    searchText: string = '';
    @ViewChild('confirmDeleteCV') confirmDeleteCV: ModalDirective;
    @ViewChild('confirmUpdateCV') confirmUpdateCV: ModalDirective;
    step: number = 1;
    // progress loading
    error: any;
    uploadResponse = { status: '', message: '', filePath: '' };
    sortBy: number = 0;
    // SortOrder : byte { None=0, Desc=1, Asc=2 }
    sortOrder: Array<number> = [0, 0, 0, 0];

    pager: any = {};
    pageSize: Array<number> = [5, 10, 15, 20, 25, 50, 75, 100, 150, 200];
    // paged items
    pagedItems: any[];
    rowsPerPage: number;
    totalItems: number = 0;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private service: CurriculumsService,
        private toastService: ToastService,
        private datePipe: DatePipe,
        private pagerService: PagerService,
        private utilsService: UtilsService,
        private spinner: NgxSpinnerService) {
    }

    getCoAuthorsNameList(co) {
        if (co && co.length > 0) {
            return co.map(item => item.name).join(', ');
        }
        return '';
    }

    ngOnInit() {
        this.rowsPerPage = this.pageSize[0];
        this.reloadCVList();
    }

    get CURRICULUMSTATUS() {
        return CURRICULUMSTATUS;
    }

    get getCreateDateInfo() {
        return this.utilsService.getCreateDateInfo;
    }

    remove(item) {
        this.cv = item;
        this.confirmDeleteCV.show();
    }

    complete(item) {
        this.cv = item;
        this.confirmUpdateCV.show();
    }

    completeCV() {
        this.toastService.clear();
        const item = this.cv;
        this.service.updateCvStatus({cvSig: item.signature, status: 1}).subscribe(
            res => {
                this.toastService.success(res.text);
                this.reloadCVList();
            },
            err => {
                this.toastService.error(err.text);
            }
        );
    }

    deleteCV() {
        const item = this.cv;
        this.toastService.clear();
        const index = this.items.map(it => it.signature).indexOf(item.signature);
        this.service.removeCurriculum({cvSig: item.signature}).subscribe(
            res => {
                this.reloadCVList();
                this.toastService.success(res.text);
            },
            err => {
                this.toastService.error(err.text);
            }
        );
    }

    reloadCVList(page?: number) {
        this.items = [];
        if (page) {
            this.setPage(page);
        } else {
            this.setPage(1);
        }
    }

    checkSearch($event: KeyboardEvent) {
        this.refresh();
    }

    refresh() {
        this.reloadCVList();
    }

    get Number() {
        return Number;
    }

    gotoCreateCV() {
        this.router.navigate(['/cms/creator/new-curriculum']);
    }

    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.spinner.show();
        const sendData = {
            pageSz: Number.parseInt(this.rowsPerPage.toString(), 10),
            pageNo: page,
            sortOrder: this.sortOrder[this.sortBy],
            sortBy: this.sortBy
        };
        const totalSendData = {};
        if (this.searchText) {
            sendData['name'] = this.searchText;
            totalSendData['name'] = this.searchText;
        }
        this.service.getCvTotalItems(totalSendData).subscribe(
          totalData => {
            this.totalItems = totalData['data'];
            this.leechCVList(page, sendData);
          },
          err => {
            this.totalItems = 100;
            this.leechCVList(page, sendData);
          }
        );
    }

    leechCVList(page, sendData) {
      this.service.loadCvList(sendData).subscribe(result => {
        this.items = (result['data']) ? result['data'] : [];
        if (this.items.length > 0) {
          this.items.forEach(item => {
            item.units = [];
          });
        }
        if (this.items.length < 1) {
          this.pagedItems = [];
          this.pager = {
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
        this.pager = this.pagerService.getPager(this.totalItems, page, this.rowsPerPage);

        // get current page of items
        this.pagedItems = this.items;
        this.spinner.hide();
      });
    }
}
