import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CurriculumLessonViewComponent} from './curriculums/curriculum-lesson-view/curriculum-lesson-view.component';
import {CurriculumQuoteLogComponent} from './curriculums/curriculum-quotes/curriculum-quote-log/curriculum-quote-log.component';
import {CurriculumEditComponent} from './curriculums/curriculum-edit/curriculum-edit.component';
import {CurriculumProofComponent} from './curriculums/curriculum-proof/curriculum-proof.component';
import {CurriculumQuotesComponent} from './curriculums/curriculum-quotes/curriculum-quotes.component';
import {CurriculumExerciseViewComponent} from './curriculums/curriculum-exercise-view/curriculum-exercise-view.component';
import {ExerciseSolutionViewComponent} from './curriculums/curriculum-exercise-view/exercise-solution-view/exercise-solution-view.component';
import {CurriculumViewComponent} from './curriculums/curriculum-view/curriculum-view.component';
import {CurriculumEditInfoComponent} from './curriculums/curriculum-view/curriculum-edit-info/curriculum-edit-info.component';
import {CurriculumUnitListEditComponent} from './curriculums/curriculum-view/curriculum-unit-list-edit/curriculum-unit-list-edit.component';
import {CurriculumQuizTfViewComponent} from './curriculums/curriculum-quiz-tf-view/curriculum-quiz-tf-view.component';
import {QuestionSolutionViewComponent} from './curriculums/curriculum-quiz-tf-view/question-solution-view/question-solution-view.component';
import {CurriculumProgressComponent} from './curriculums/curriculum-progress/curriculum-progress.component';
import {CurriculumsComponent} from './curriculums/curriculums.component';
import {OrderProcessingComponent} from './quotation/order-processing/order-processing.component';
import {OrderProcessingViewComponent} from './quotation/order-processing/order-processing-view/order-processing-view.component';
import {RequestForQuoteComponent} from './quotation/request-for-quote/request-for-quote.component';
import {RequestQuoteViewComponent} from './quotation/request-for-quote/request-quote-view/request-quote-view.component';
import {CurriculumCreateQuoteComponent} from './curriculums/curriculum-create-quote/curriculum-create-quote.component';
import {OrderProcessLogComponent} from './quotation/order-processing/order-processing-view/order-process-log/order-process-log.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'quotation/request-for-quote'
    },
    {
        path: 'curriculums',
        component: CurriculumsComponent
    },
    {
        path: 'curriculum-edit',
        component: CurriculumEditComponent
    },
    {
        path: 'curriculums/curriculum-proof',
        component: CurriculumProofComponent
    },
    {
        path: 'curriculums/curriculum-quotes',
        component: CurriculumQuotesComponent
    },
    {
        path: 'curriculums/curriculum-create-quote',
        component: CurriculumCreateQuoteComponent
    },
    {
        path: 'curriculums/curriculum-lesson-view',
        component: CurriculumLessonViewComponent
    },
    {
        path: 'curriculums/curriculum-view/curriculum-unit-list-edit/lesson-view',
        component: CurriculumLessonViewComponent
    },
    {
        path: 'curriculums/curriculum-view/curriculum-unit-list-edit/curriculum-exercise-view',
        component: CurriculumExerciseViewComponent
    },
    {
        path: 'curriculums/curriculum-view/curriculum-unit-list-edit/curriculum-exercise-view/edit-solution',
        component: ExerciseSolutionViewComponent
    },
    {
        path: 'curriculums/curriculum-quotes/curriculum-quote-log',
        component: CurriculumQuoteLogComponent
    },
    {
        path: 'curriculums/curriculum-view',
        component: CurriculumViewComponent
    },
    {
        path: 'curriculums/curriculum-view/curriculum-edit-info',
        component: CurriculumEditInfoComponent
    },
    {
        path: 'curriculums/curriculum-view/curriculum-unit-list-edit',
        component: CurriculumUnitListEditComponent
    },
    {
        path: 'curriculums/curriculum-view/curriculum-unit-list-edit/curriculum-question-view',
        component: CurriculumQuizTfViewComponent
    },
    {
        path: 'curriculums/curriculum-view/curriculum-unit-list-edit/curriculum-question-view/edit-solution',
        component: QuestionSolutionViewComponent
    },
    {
        path: 'curriculums/progress',
        component: CurriculumProgressComponent
    },
    {
        path: 'curriculums/curriculum-quote-log',
        component: CurriculumQuoteLogComponent
    },
    {
        path: 'quotation/request-for-quote/request-quote-view',
        component: RequestQuoteViewComponent
    },
    {
        path: 'quotation/request-for-quote',
        component: RequestForQuoteComponent
    },
    {
        path: 'quotation',
        component: RequestForQuoteComponent
    },
    {
        path: 'quotation/order-processing',
        component: OrderProcessingComponent
    },
    {
        path: 'quotation/order-processing/order-processing-view',
        component: OrderProcessingViewComponent
    },
    {
        path: 'quotation/order-processing/order-processing-view/logs',
        component: OrderProcessLogComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CmsVendorRoutingModule {
}
