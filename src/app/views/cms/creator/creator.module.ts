import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {CurriculumsComponent} from './curriculums/curriculums.component';
import {CmsCreatorRoutingModule} from './creator-routing.module';
import {ActionMenuComponent} from './curriculums/action-menu/action-menu.component';
import {MDBBootstrapModulesPro, ToastService} from '../../../lib/ng-uikit-pro-standard';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CurriculumQuotesComponent} from './curriculums/curriculum-quotes/curriculum-quotes.component';
import {QuotesActionMenuComponent} from './curriculums/curriculum-quotes/action-menu/quotes-action-menu.component';
import {CurriculumEditInfoComponent} from './curriculums/curriculum-view/curriculum-edit-info/curriculum-edit-info.component';
import {CurriculumUnitListEditComponent} from './curriculums/curriculum-view/curriculum-unit-list-edit/curriculum-unit-list-edit.component';
import {CurriculumEditComponent} from './curriculums/curriculum-edit/curriculum-edit.component';
import {CurriculumViewComponent} from './curriculums/curriculum-view/curriculum-view.component';
import {CurriculumQuoteLogComponent} from './curriculums/curriculum-quotes/curriculum-quote-log/curriculum-quote-log.component';
import {CurriculumProofComponent} from './curriculums/curriculum-proof/curriculum-proof.component';
import {CurriculumLessonViewComponent} from './curriculums/curriculum-lesson-view/curriculum-lesson-view.component';
import {TranslateModule} from '@ngx-translate/core';
import {CurriculumsService} from '../../../services/curriculums.service';
import {LessonViewMenuComponent} from './curriculums/curriculum-lesson-view/lesson-view-menu/lesson-view-menu.component';
import {CurriculumExerciseViewComponent} from './curriculums/curriculum-exercise-view/curriculum-exercise-view.component';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {CurriculumQuizTfViewComponent} from './curriculums/curriculum-quiz-tf-view/curriculum-quiz-tf-view.component';
import {PagerService} from '../../../services/pager.service';
import {PopoverModule} from 'ngx-popover';
import {NgbTabsetModule} from '@ng-bootstrap/ng-bootstrap';
import {CurriculumProgressComponent} from './curriculums/curriculum-progress/curriculum-progress.component';
import {ExerciseSolutionViewComponent} from './curriculums/curriculum-exercise-view/exercise-solution-view/exercise-solution-view.component';
import {QuestionSolutionViewComponent} from './curriculums/curriculum-quiz-tf-view/question-solution-view/question-solution-view.component';
import {CurriculumCreateQuoteComponent} from './curriculums/curriculum-create-quote/curriculum-create-quote.component';
import {UtilsService} from '../../../services/utils.service';
import {CurriculumProgressLogComponent} from './curriculums/curriculum-progress/curriculum-progress-log/curriculum-progress-log.component';
import {NgxSpinnerModule} from 'ngx-spinner';
import {ClientEventService} from '../../../services/client-event.service';
import {CreateCurriculumComponent} from './curriculums/create-curriculum/create-curriculum.component';
import {AutosizeModule} from 'ngx-autosize';

@NgModule({
    declarations: [
        ActionMenuComponent,
        QuotesActionMenuComponent,
        CurriculumCreateQuoteComponent,
        CurriculumsComponent,
        CurriculumQuotesComponent,
        CurriculumViewComponent,
        CurriculumEditComponent,
        CurriculumEditInfoComponent,
        CurriculumUnitListEditComponent,
        CurriculumQuoteLogComponent,
        CurriculumProofComponent,
        CurriculumLessonViewComponent,
        LessonViewMenuComponent,
        CurriculumExerciseViewComponent,
        CurriculumQuizTfViewComponent,
        CurriculumProgressComponent,
        ExerciseSolutionViewComponent,
        QuestionSolutionViewComponent,
        CurriculumProgressLogComponent,
        CreateCurriculumComponent
    ],
    imports: [
        CommonModule,
        CmsCreatorRoutingModule,
        FormsModule,
        TranslateModule,
        ReactiveFormsModule,
        MDBBootstrapModulesPro.forRoot(),
        CKEditorModule,
        PopoverModule,
        NgbTabsetModule,
        NgbTabsetModule,
        NgxSpinnerModule,
        AutosizeModule
    ],
    providers: [
        CurriculumsService,
        PagerService,
        DatePipe,
        UtilsService,
        ToastService,
        ClientEventService
    ]
})
export class CmsCreatorModule { }