import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PagerService} from '../../../../services/pager.service';
import {ModalDirective} from '../../../../lib/ng-uikit-pro-standard/free/modals';

@Component({
  selector: 'app-courses-user-messages',
  templateUrl: './user-messages.component.html',
  styleUrls: ['./user-messages.component.scss']
})
export class UserMessagesComponent implements OnInit {
    @ViewChild('exportModal') exportModal: ModalDirective;
    items: Array<any> = new Array<any>();
    totalUsers: number = 0;
    totalAmount: number = 0;
    totalReceivedAMT: number = 0;
    // pager object
    pager: any = {};
    pageSize: Array<number> = [5, 10, 15, 20];
    // paged items
    pagedItems: any[];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private pagerService: PagerService) {
      this.items = [
          {
              id: 0,
              name: 'Critical Thinking for Consumer Decisions',
              reg_users: '50,968',
              opened_on: '10-Sep-2018',
              closed_on: 'N/A',
          },
          {
              id: 1,
              name: 'Marketing Foundations',
              reg_users: '90,123,456',
              opened_on: '10-Sep-2018',
              closed_on: 'N/A',
          },
          {
              id: 2,
              name: 'Accounting and Financial Reporting',
              reg_users: '1,500',
              opened_on: '10-Sep-2018',
              closed_on: 'N/A',
          },
          {
              id: 3,
              name: 'Blockchain technology',
              reg_users: '50,968',
              opened_on: '10-Sep-2018',
              closed_on: 'N/A',
          },
          {
              id: 4,
              name: 'Technical Analysis of Stock Trends',
              reg_users: '90,123,456',
              opened_on: '10-Sep-2018',
              closed_on: 'N/A',
          },
          {
              id: 5,
              name: 'Forex Trading',
              reg_users: '4,500',
              opened_on: '10-Sep-2018',
              closed_on: 'N/A',
          },
          {
              id: 6,
              name: 'Blockchain technology',
              reg_users: '50,968',
              opened_on: '10-Sep-2018',
              closed_on: 'N/A',
          },
          {
              id: 6,
              name: 'Technical Analysis of Stock Trends',
              reg_users: '9,123,456',
              opened_on: '10-Sep-2018',
              closed_on: 'N/A',
          }

      ];
      this.items.forEach(item => {
          this.totalUsers += item.totalUsers;
          this.totalAmount += item.totalAmount;
          this.totalReceivedAMT += item.totalReceivedAMT;
      });
      this.setPage(1);

  }

  ngOnInit() {
  }

    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }

        if (this.items.length < 1) {
            this.pagedItems = [];
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(this.items.length, page, this.pageSize[0]);

        // get current page of items
        this.pagedItems = this.items.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }
}
