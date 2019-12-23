import {NgModule} from '@angular/core';
import {PagerService} from '../../../services/pager.service';
import {CurriculumsService} from '../../../services/curriculums.service';
import {QuotationService} from '../../../services/quotation.service';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {CmsVendorRoutingModule} from './vendor-routing.module';
import {CommonModule, DatePipe} from '@angular/common';
import {QuotationActionMenuComponent} from './quotation/request-for-quote/action-menu/action-menu.component';
import {OrderProcessingComponent} from './quotation/order-processing/order-processing.component';
import {CurriculumUnitListEditComponent} from './curriculums/curriculum-view/curriculum-unit-list-edit/curriculum-unit-list-edit.component';
import {OrderProcessingViewComponent} from './quotation/order-processing/order-processing-view/order-processing-view.component';
import {OrderProcessingActionMenuComponent} from './quotation/order-processing/action-menu/action-menu.component';
import {CurriculumViewComponent} from './curriculums/curriculum-view/curriculum-view.component';
import {CurriculumEditInfoComponent} from './curriculums/curriculum-view/curriculum-edit-info/curriculum-edit-info.component';
import {CurriculumQuotesComponent} from './curriculums/curriculum-quotes/curriculum-quotes.component';
import {QuotesActionMenuComponent} from './curriculums/curriculum-quotes/action-menu/quotes-action-menu.component';
import {QuestionSolutionViewComponent} from './curriculums/curriculum-quiz-tf-view/question-solution-view/question-solution-view.component';
import {CurriculumQuizTfViewComponent} from './curriculums/curriculum-quiz-tf-view/curriculum-quiz-tf-view.component';
import {CurriculumProofComponent} from './curriculums/curriculum-proof/curriculum-proof.component';
import {CurriculumProgressComponent} from './curriculums/curriculum-progress/curriculum-progress.component';
import {ExerciseSolutionViewComponent} from './curriculums/curriculum-exercise-view/exercise-solution-view/exercise-solution-view.component';
import {CurriculumExerciseViewComponent} from './curriculums/curriculum-exercise-view/curriculum-exercise-view.component';
import {CurriculumEditComponent} from './curriculums/curriculum-edit/curriculum-edit.component';
import {ActionMenuComponent} from './curriculums/action-menu/action-menu.component';
import {CurriculumsComponent} from './curriculums/curriculums.component';
import {RequestQuoteViewComponent} from './quotation/request-for-quote/request-quote-view/request-quote-view.component';
import {RequestForQuoteComponent} from './quotation/request-for-quote/request-for-quote.component';
import {CurriculumLessonViewComponent} from './curriculums/curriculum-lesson-view/curriculum-lesson-view.component';
import {CurriculumQuoteLogComponent} from './curriculums/curriculum-quotes/curriculum-quote-log/curriculum-quote-log.component';
import {PopoverModule} from 'ngx-popover';
import {MDBBootstrapModulesPro, ToastService} from '../../../lib/ng-uikit-pro-standard';
import {LessonViewMenuComponent} from './curriculums/curriculum-lesson-view/lesson-view-menu/lesson-view-menu.component';
import {CurriculumCreateQuoteComponent} from './curriculums/curriculum-create-quote/curriculum-create-quote.component';
import {UtilsService} from '../../../services/utils.service';
import {OrderProcessingViewActionMenuComponent} from './quotation/order-processing/order-processing-view/order-processing-view-action-menu/order-processing-view-action-menu.component';
import {OrderProcessLogComponent} from './quotation/order-processing/order-processing-view/order-process-log/order-process-log.component';
import {FileUploadModule} from 'ng2-file-upload';
import {ClientEventService} from '../../../services/client-event.service';

@NgModule({
    declarations: [
        QuotationActionMenuComponent,
        RequestForQuoteComponent,
        CurriculumQuoteLogComponent,
        RequestQuoteViewComponent,
        CurriculumsComponent,
        ActionMenuComponent,
        CurriculumEditComponent,
        CurriculumExerciseViewComponent,
        ExerciseSolutionViewComponent,
        CurriculumProgressComponent,
        CurriculumProofComponent,
        CurriculumQuizTfViewComponent,
        QuestionSolutionViewComponent,
        QuotesActionMenuComponent,
        CurriculumQuotesComponent,
        CurriculumViewComponent,
        CurriculumEditInfoComponent,
        CurriculumUnitListEditComponent,
        OrderProcessingActionMenuComponent,
        OrderProcessingComponent,
        OrderProcessingViewComponent,
        CurriculumLessonViewComponent,
        LessonViewMenuComponent,
        CurriculumCreateQuoteComponent,
        OrderProcessingViewActionMenuComponent,
        OrderProcessLogComponent
    ],
    imports: [
        CommonModule,
        CmsVendorRoutingModule,
        FormsModule,
        TranslateModule,
        ReactiveFormsModule,
        MDBBootstrapModulesPro.forRoot(),
        CKEditorModule,
        PopoverModule,
        FileUploadModule,
    ],
    providers: [
        QuotationService,
        CurriculumsService,
        PagerService,
        DatePipe,
        UtilsService,
        ToastService,
        ClientEventService
    ]
})
export class CmsVendorModule { }
