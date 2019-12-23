import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-star',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.scss']
})
export class StarComponent  implements OnDestroy {
  @Input() index: number;
  @Input() rank: number;
  @Output() submit: EventEmitter<any> = new EventEmitter();
  constructor() {}

  submitRank(score: number) {
    this.submit.emit({score: score});
  }

  ngOnDestroy(): void {
    this.submit.complete();
  }
}
