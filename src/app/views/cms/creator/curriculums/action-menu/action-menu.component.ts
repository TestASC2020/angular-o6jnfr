import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';
import {ModalDirective} from '../../../../../lib/ng-uikit-pro-standard/free/modals';
import {QUOTATIONSTATUS} from '../../../../../models/quotation-status';
import {CurriculumsService} from '../../../../../services/curriculums.service';

@Component({
    selector: 'app-cms-creator-action-menu',
    templateUrl: './action-menu.component.html',
    styleUrls: ['./action-menu.component.scss']
})
export class ActionMenuComponent implements OnInit, OnDestroy {
    @Input() item: any;
    @Output() delete: EventEmitter<any> = new EventEmitter<any>();
    @Output() complete: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('popContent') popContent: ModalDirective;

    constructor(private router: Router,
                private cookieService: CookieService,
                private service: CurriculumsService) { }

    ngOnInit() {
    }

    view(item) {
        const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
        this.cookieService.put('cvInfo', JSON.stringify( {signature: item.signature}), opt);
        const routLinks = [
            {
                link: '../',
                display: 'CREATOR.CURRICULUMS.LIST.Curriculums'
            },
            {
                display: item.name
            }
        ];
        this.cookieService.put('routLinks', JSON.stringify(routLinks), opt);
        this.cookieService.put('editable', JSON.stringify({editable: true}), opt);
        this.popContent.hide();
        this.router.navigate(['cms/creator/curriculums/curriculum-view/']);
    }

    quotations(item) {
        const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
        this.cookieService.put('cvInfo', JSON.stringify( {signature: item.signature}), opt);
        this.popContent.hide();
        this.router.navigate(['cms/creator/curriculums/curriculum-quotes/']);
    }

    createQuotation(item) {
        const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
        this.cookieService.put('cvInfo', JSON.stringify( {signature: item.signature}), opt);
        this.popContent.hide();
        this.router.navigate(['cms/creator/curriculums/curriculum-create-quote/']);
    }

    tasksProgress(item) {
        const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
        this.cookieService.put('cvInfo', JSON.stringify( {signature: item.signature}), opt);
        this.popContent.hide();
        this.router.navigate(['cms/creator/curriculums/progress']);
    }

    proofOfContent(item) {
        const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
        this.cookieService.put('cvInfo', JSON.stringify( {signature: item.signature}), opt);
        this.popContent.hide();
        this.router.navigate(['cms/creator/curriculums/curriculum-proof']);
    }

    ngOnDestroy() {
        this.delete.complete();
        this.complete.complete();
    }

    remove(item) {
        this.delete.emit(item);
        this.popContent.hide();
    }

    completeItem(item) {
        this.complete.emit(item);
        this.popContent.hide();
    }

    get QUOTATIONSTATUS() {
        return QUOTATIONSTATUS;
    }
}
