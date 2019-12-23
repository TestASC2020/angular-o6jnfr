import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';
import {ModalDirective} from '../../../../../lib/ng-uikit-pro-standard/free/modals';
import {CurriculumsService} from '../../../../../services/curriculums.service';
import {QUOTATIONSTATUS} from '../../../../../models/quotation-status';

@Component({
    selector: 'app-cms-vendor-action-menu',
    templateUrl: './action-menu.component.html',
    styleUrls: ['./action-menu.component.scss']
})
export class ActionMenuComponent implements OnInit, OnDestroy {
    @Input() item: any;
    @Output() delete: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('popContent') popContent: ModalDirective;

    constructor(private router: Router,
                private cookieService: CookieService,
                private service: CurriculumsService) { }

    ngOnInit() {
    }

    view(item) {
        const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
        this.cookieService.put('cvInfo', JSON.stringify( {signature: item.signature}), opt);
        this.cookieService.remove('routLinks');
        this.popContent.hide();
        this.router.navigate(['cms/vendor/curriculums/curriculum-view/']);
    }

    quotations(item) {
        const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
        this.cookieService.put('cvInfo', JSON.stringify(item), opt);
        this.popContent.hide();
        this.router.navigate(['cms/vendor/curriculums/curriculum-quotes/']);
    }

    createQuotation(item) {
        const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
        this.cookieService.put('cvInfo', JSON.stringify(item), opt);
        this.popContent.hide();
        this.router.navigate(['cms/vendor/curriculums/curriculum-create-quote/']);
    }

    tasksProgress(item) {
        const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
        this.cookieService.put('cvInfo', JSON.stringify(item), opt);
        this.popContent.hide();
        this.router.navigate(['cms/vendor/curriculums/progress']);
    }

    proofOfContent(item) {
        const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
        this.cookieService.put('cvInfo', JSON.stringify(item), opt);
        this.popContent.hide();
        this.router.navigate(['cms/vendor/curriculums/curriculum-proof']);
    }

    ngOnDestroy() {
        this.delete.complete();
    }

    remove(item) {
        this.delete.emit(item);
        this.popContent.hide();
    }

    get QUOTATIONSTATUS() {
        return QUOTATIONSTATUS;
    }
}
