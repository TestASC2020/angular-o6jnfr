import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CurriculumsComponent} from './curriculums/curriculums.component';
import {CurriculumQuotesComponent} from './curriculums/curriculum-quotes/curriculum-quotes.component';
import {CurriculumViewComponent} from './curriculums/curriculum-view/curriculum-view.component';
import {CurriculumEditInfoComponent} from './curriculums/curriculum-view/curriculum-edit-info/curriculum-edit-info.component';
import {CurriculumUnitListEditComponent} from './curriculums/curriculum-view/curriculum-unit-list-edit/curriculum-unit-list-edit.component';
import {CurriculumEditComponent} from './curriculums/curriculum-edit/curriculum-edit.component';
import {CurriculumQuoteLogComponent} from './curriculums/curriculum-quotes/curriculum-quote-log/curriculum-quote-log.component';
import {CurriculumProofComponent} from './curriculums/curriculum-proof/curriculum-proof.component';
import {CurriculumLessonViewComponent} from './curriculums/curriculum-lesson-view/curriculum-lesson-view.component';
import {CurriculumExerciseViewComponent} from './curriculums/curriculum-exercise-view/curriculum-exercise-view.component';
import {CurriculumQuizTfViewComponent} from './curriculums/curriculum-quiz-tf-view/curriculum-quiz-tf-view.component';
import {CurriculumProgressComponent} from './curriculums/curriculum-progress/curriculum-progress.component';
import {ExerciseSolutionViewComponent} from './curriculums/curriculum-exercise-view/exercise-solution-view/exercise-solution-view.component';
import {QuestionSolutionViewComponent} from './curriculums/curriculum-quiz-tf-view/question-solution-view/question-solution-view.component';
import {CurriculumCreateQuoteComponent} from './curriculums/curriculum-create-quote/curriculum-create-quote.component';
import {CurriculumProgressLogComponent} from './curriculums/curriculum-progress/curriculum-progress-log/curriculum-progress-log.component';
import {CreateCurriculumComponent} from './curriculums/create-curriculum/create-curriculum.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'curriculums'
    },
    {
        path: 'curriculums',
        component: CurriculumsComponent
    },
    {
        path: 'new-curriculum',
        component: CreateCurriculumComponent
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
        path: 'curriculums/progress/progress-log',
        component: CurriculumProgressLogComponent
    },
    {
        path: 'curriculums/curriculum-quote-log',
        component: CurriculumQuoteLogComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CmsCreatorRoutingModule {
}
