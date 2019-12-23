import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {ContractListComponent} from './contract/contract-list.component';
import {AccountingRoutingModule} from './accounting-routing.module';
import {ContractViewComponent} from './contract/contract-view/contract-view.component';
import {AccountingJournalComponent} from './accounting-journal/accounting-journal.component';
import {CourseBalanceComponent} from './course-balance/course-balance.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {MDBBootstrapModulesPro} from '../../lib/ng-uikit-pro-standard';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {PopoverModule} from 'ngx-popover';
import {PagerService} from '../../services/pager.service';
import {ContractActionMenuComponent} from './contract/action-menu/contract-action-menu.component';
import {AccountingService} from '../../services/accounting.service';
import {UtilsService} from '../../services/utils.service';
import {ExcelService} from '../../services/excel.service';
import {PdfService} from '../../services/pdf.service';
import {NgxSpinnerModule} from 'ngx-spinner';

@NgModule({
    declarations: [
        ContractActionMenuComponent,
        ContractListComponent,
        ContractViewComponent,
        AccountingJournalComponent,
        CourseBalanceComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        ReactiveFormsModule,
        MDBBootstrapModulesPro.forRoot(),
        CKEditorModule,
        PopoverModule,
        AccountingRoutingModule,
        NgxSpinnerModule
    ],
    providers: [
        AccountingService,
        PagerService,
        DatePipe,
        UtilsService,
        ExcelService,
        PdfService
    ]
})
export class AccountingModule { }
