import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalDirective} from '../../../lib/ng-uikit-pro-standard/free/modals';
import {CoursesService} from '../../../services/courses.service';
import {CookieService} from 'ngx-cookie';
import {UtilsService} from '../../../services/utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {PagerService} from '../../../services/pager.service';
import {ToastService} from '../../../lib/ng-uikit-pro-standard/pro/alerts';

@Component({
  selector: 'app-courses-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {
  @ViewChild('exportModal') exportModal: ModalDirective;
  items: Array<any> = new Array<any>();
  searchText = '';
  cs: any;
  @ViewChild('confirmDeleteCourseList') confirmDeleteCourseList: ModalDirective;
  // sortBy = : byte { None=0, OpenDate=1, Price=2, EnrollCount=3, Rank=4 }
  sortBy: number = 0;
  // SortOrder : byte { None=0, Desc=1, Asc=2 }
  sortOrder: Array<number> = [0, 0, 0, 0, 0];
  pager: any = {};
  pageSize: Array<number> = [5, 10, 15, 20, 25, 50, 75, 100, 150, 200];
  // paged items
  pagedItems: any[];
  rowsPerPage: number;
  totalItems: number = 0;

  constructor(private router: Router,
              private cookieService: CookieService,
              private route: ActivatedRoute,
              private service: CoursesService,
              private toastService: ToastService,
              private pagerService: PagerService,
              private spinner: NgxSpinnerService,
              private utilsService: UtilsService) {
  }

  get getCreateDateInfo() {
    return this.utilsService.getCreateDateInfo;
  }

  ngOnInit() {
    this.rowsPerPage = this.pageSize[0];
    this.reloadList();
  }

  reloadList(page?: number) {
    this.items = [];
    if (page) {
      this.setPage(page);
    } else {
      this.setPage(1);
    }
  }

  removeCourse(item) {
    this.cs = item;
    this.confirmDeleteCourseList.show();
  }
  deleteCourseList() {
    const item = this.cs;
    this.toastService.clear();
    this.service.removeCourse({crsSig: item.signature}).subscribe(
      result => {
        this.reloadList();
        this.toastService.success(result.text);
      },
      err => {
        this.toastService.error(err.text);
      });
  }
  create() {
    const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
    const routLinks = [
      {
        'link': '../',
        'display': 'Courses.Course'
      },
      {
        'display': 'Courses.NewCourse'
      }
    ];
    this.cookieService.remove('courseInfo');
    this.cookieService.put('routLinks', JSON.stringify(routLinks), opt);
    this.router.navigate(['courses/course-list/course-edit']);
  }

  courseinfo(item) {
    const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
    this.cookieService.put('courseInfo', JSON.stringify(item), opt);
    this.router.navigate(['courses/course-list/course-info']);
  }

  checkSearch($event: KeyboardEvent) {
      this.refresh();
  }

  refresh() {
    this.reloadList();
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
    this.service.getCrsTotalItems(totalSendData).subscribe(
      totalData => {
        this.totalItems = totalData['data'];
        this.leechList(page, sendData);
      },
      err => {
        this.totalItems = 100;
        this.leechList(page, sendData);
      }
    );
  }

  leechList(page, sendData) {
    this.service.loadCrsList(sendData).subscribe(result => {
      if (result['data']) {
        this.items = (result['data']) ? result['data'] : [];
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
      }
    });
  }
}
