import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {IntroService} from '../../services/intro.service';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  @ViewChild('sidenav') sidenav: any;
  data: any

  clicked: boolean;

  constructor(private introService: IntroService) {
    this.clicked = this.clicked === undefined ? false : true;
  }

  ngOnInit() {
    this.introService.getIntroBoarding().subscribe( result => {
      this.data = result.data;
    });
  }

  setClicked(val: boolean): void {
    this.clicked = val;
  }

  // toggleSidebar() {
  //   this.sidenav.hide();
  // }

}
