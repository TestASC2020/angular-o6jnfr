import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';

@Component({
    selector: 'app-cms-contact-action-menu',
    templateUrl: './contract-action-menu.component.html',
    styleUrls: ['./contract-action-menu.component.scss']
})
export class ContractActionMenuComponent implements OnInit {
    @Input() item: any;
    @ViewChild('popContent') popContent: any;

    constructor(private router: Router,
                private cookieService: CookieService) { }

    ngOnInit() {
    }

    viewDetail() {
        this.popContent.hide();
        const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
        this.cookieService.put('contractInfo', JSON.stringify({contractSig: this.item.signature}), opt);
        const routLinks = [
            {
                link: '../',
                display: 'Accounting.Contract'
            },
            {
                display: 'Accounting.Detail'
            }
        ];
        this.cookieService.put('routLinks', JSON.stringify(routLinks), opt);
        this.router.navigate(['accounting/contract/contract-view']);
    }

    viewChat() {
        this.popContent.hide();
    }

    viewHistory() {
        this.popContent.hide();
    }
}
