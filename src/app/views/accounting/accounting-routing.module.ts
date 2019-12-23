import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {ContractListComponent} from './contract/contract-list.component';
import {ContractViewComponent} from './contract/contract-view/contract-view.component';
import {AccountingJournalComponent} from './accounting-journal/accounting-journal.component';
import {CourseBalanceComponent} from './course-balance/course-balance.component';

const routes: Routes = [
    { path: 'contract', component: ContractListComponent },
    { path: 'contract/contract-view', component: ContractViewComponent },
    { path: 'accounting-journal', component: AccountingJournalComponent },
    { path: 'course-balance', component: CourseBalanceComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AccountingRoutingModule {
}
