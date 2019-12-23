import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PagerService} from '../../../services/pager.service';
import {ModalDirective} from '../../../lib/ng-uikit-pro-standard/free/modals/index';
@Component({
  selector: 'app-business-star',
  templateUrl: './business-star.component.html',
  styleUrls: ['./business-star.component.scss']
})
export class BusinessStarComponent  implements OnInit {
  @ViewChild('exportModal') exportModal: ModalDirective;
  @Input() rank: number;
  pagedItems: any[];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private pagerService: PagerService) {
  }

  ngOnInit() {
  }

  doAction() {
    this.exportModal.show();
  }

}
