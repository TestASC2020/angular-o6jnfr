import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpService} from 'src/app/shared/http/service/http.service';
import {environment} from '../../environments/environment';
import {HttpClient, HttpEventType, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable()
export class CurriculumsService {

    /*
    * @constructor
    */
    constructor(private http: HttpService, private _http: HttpClient) { }

    /**
     * --------------------------------------
     * Begin - Curriculums
     * Contents:
     * 1 - Load curriculum list of an orginazation.
     * 2 - Get template list for Curriculum
     * 3 - Get Authors list of curriculum
     * 4 - Get curriculum information
     * 5 - Update curriculum information
     * 6 - Add new curriculum
     * 7 - Delete a curriculum
     * 8 - Update curriculum status
     * 9 - Get Vendor list
     * --------------------------------------
     */
    /**
    * 1 - Load curriculum list of an orginazation
    */
    loadCvList(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/LoadCvList', data,
            {
                reportProgress: true,
                observe: 'events'
            }
        ).pipe(map((event) => {
                switch (event.type) {
                    case HttpEventType.UploadProgress:
                        const progress = Math.round(100 * event.loaded / event.total);
                        return { status: 'progress', message: progress };

                    case HttpEventType.Response:
                        return event.body;
                    default:
                        return `Unhandled event: ${event.type}`;
                }
            })
        );
    }

    /**
     * 2 - Get template list for Curriculum
     */
    loadCvTemplate(data): Observable<any>  {
        return this.http.post(environment.serverUrl + 'Cms/LoadCvTemplate', data);
    }

    loadCvTemplateList(): Observable<any> {
        return this.http.get(environment.serverUrl + 'Cms/LoadCvTemplateList');
    }
    LoadCvQuoteProgress(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/LoadCvQuoteProgress', data);
    }

    loadCvTaskRqtList(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/LoadCvTaskRqtList', data);
    }

    /**
     * 3 - Get Authors list of curriculum
     */
    loadCvAuthors(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/LoadCvAuthors', data);
    }

    /**
     * 4 - Get curriculum information
     */
    loadCv(data): Observable<any> {
      return this.http.post(environment.serverUrl + 'Cms/LoadCv', data);
    }

    loadCvProgess(): Observable<any> {
        return this.http.post(environment.serverUrl + 'Master/LoadCvProgess', {});
    }

    loadCvSaveType(): Observable<any> {
        return this.http.post(environment.serverUrl + 'Master/LoadCvSaveType', {});
    }

    loadCategoryList(): Observable<any> {
        return this.http.post(environment.serverUrl + 'Master/LoadCategoryList', {});
    }

    loadCvGroupType(): Observable<any> {
        return this.http.post(environment.serverUrl + 'Master/LoadCvGroupType', {});
    }

    /**
     * 5 - Update curriculum information
     */
    updateCvInfo(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/UpdateCvInfo', data);
    }

    /**
    * 6 - Add new curriculum
    */
    addCurriculum(data): Observable<any> {
      return this.http.post(environment.serverUrl + 'Cms/AddCurriculum', data);
    }

    /**
    * 7 - Remove curriculum
    */
    removeCurriculum(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/RemoveCv', data);
    }

    removeCvUnit(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/RemoveCvUnit', data);
    }

    addCvUnit(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/AddCvUnit', data);
    }

    updateCvUnit(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/UpdateCvUnit', data);
    }

    addCvLessonGroup(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/AddCvLessonGroup', data);
    }

    addCvQuizGroup(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/AddCvQuizGroup', data);
    }

    addCvExerciseGroup(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/AddCvExerciseGroup', data);
    }

    updateCvLessonGroup(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/UpdateCvLessonGroup', data);
    }

    updateCvExerciseGroup(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/UpdateCvExerciseGroup', data);
    }

    updateCvQuizGroup(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/UpdateCvQuizGroup', data);
    }

    removeUnitGroup(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/RemoveUnitGroup', data);
    }

    /**
     * 8 - Update curriculum status
     * Data params:
     * lang: number [0, 1, 2]
     * sig: string
     * status: number [1, 2, 3, 4]
     */
    updateCvStatus(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/UpdateCvStatus', data);
    }

    /**
     * 9 - Get Vendor list
     */
    loadOrgVendorList(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/LoadOrgVendorList', data);
    }

    /**
    * ----------------------------------------------
    * Begin - Curriculum quotes
    * Contents:
    *  1 - Load Quotes list of a curriculum
     * 2 - Get report of Quote
     * 3 - Get Feedback report of Quote
     * 4 - Attach file into request quote
     * 5 - Cancel attach file into request quote
     * 6 - Request for quote
     *
    * ----------------------------------------------
    */

    /**
     * 1 - Load Quotes list of a curriculum
     */
    loadOrgRqtQuoteList(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/LoadOrgRqtQuoteList', data);
    }

    loadApproveRqtQuote(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/LoadApproveRqtQuote', data);
    }

    loadOrgRqtQuote(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/LoadOrgRqtQuote', data);
    }

    /**
     * 2 - Get report of Quote
     */
    loadCvQuoteRqt(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/LoadCvQuoteRqt', data);
    }

    addVendor(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/AddVendor', data);
    }

    removeVendor(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/RemoveVendor', data);
    }

    updateCvQuoteRqt(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/UpdateCvQuoteRqt', data);
    }

    removeCvRqtCategory(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/RemoveCvRqtCategory', data);
    }

    addCvRqtCategory(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/AddCvRqtCategory', data);
    }

    loadCvTaskRptList(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/LoadCvTaskRptList', data);
    }

    /**
     * 3 - Get Feedback report of Quote
     */
    // addTaskFeedback(data): Observable<any> {
    //     return this.http.post(environment.serverUrl + 'Cms/AddTaskFeedback', data);
    // }

    /**
     * 4 - Attach file into request quote
     */
    addCvRqtQuoteFile(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/AddCvRqtQuoteFile', data);
    }

    /**
     * 5 - Cancel attach file into request quote
     */
    removeCvRqtQuoteFile(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/RemoveCvRqtQuoteFile', data);
    }


    /**
     * 6 - Add a request quote
     */
    addCvQuoteRqt(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/AddCvQuoteRqt', data);
    }
    // Get Category list
    loadCrsCategory(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Master/LoadCrsCategory', data);
    }

    // Lấy danh sách nhân viên của org
    loadOrgStaffList(data): Observable<any> {
      return this.http.post(environment.serverUrl + 'Org/LoadOrgStaffList', data);
    }

    /**
     * begin - curriculum lession
     * */
    // Lấy danh sách tên lesson group
    loadLessonGrpList(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/LoadLessonGrpList', data);
    }

    loadLesson(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/LoadLesson', data);
    }

    updateLesson(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/UpdateLesson', data);
    }

    removeLessonSub(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/RemoveLessonSub', data);
    }

    addLessonSub(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/AddLessonSub', data);
    }

    uploadVideoThumbnail(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/UploadVideoThumbnail', data);
    }

    loadLessonByGrp(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/LoadLessonByGrp', data);
    }
    removeLesson(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/RemoveLesson', data);
    }

    loadSubtitleLang(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Master/LoadSubtitleLang', data);
    }

    addLesson(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/AddLesson', data);
    }

    /**
     * --------------------------
     * end - curriculum lession
     * ----------------------------
     * */
    /**
     * --------------------------
     * Begin - Quotes
     * --------------------------
     * */
    // Load Curriculum Quotes list
    loadCvQuoteList(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/LoadCvQuoteList', data);
    }

    // Load Curriculum Quote from provided curriculum
    loadCvQuote(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/LoadCvQuote', data);
    }
    loadCvUnitNameList(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/loadCvUnitNameList', data);
    }
    AddTaskFeedback(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/AddTaskFeedback', data);
    }

    /** Terminate quote
     * Data params:
     * description: string
     * lang: number [0, 1, 2]
     * quoteSig: string
    */
    terminateCvQuote(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/TerminateCvQuote', data);
    }

    /** Set Main Author
     * @param data
     * cvSig: string
     * id: string - email of main author
     * lang: number [0, 1, 2]
     * signature: string
     */
    setMainAuthor(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/SetMainAuthor', data);
    }

    removeMainAuthor(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/RemoveMainAuthor', data);
    }

    /** Add Co-Authors
     * @param data
     * coAuthor: Array[string] - Array of co-authors email
     * cvSig: string - id of cv
     * lang: number [0, 1, 2]
     */
    addCoAuthors(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/AddCoAuthors', data);
    }

    /** Remove Co-Authors
     * @param data
     * coAuthor: Array[string] - Array of co-authors email
     * cvSig: string - id of cv
     * lang: number [0, 1, 2]
     */
    removeCoAuthors(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/RemoveCoAuthors', data);
    }
    /**
     * --------------------------
     * End - Quotes
     * --------------------------
     * */

    /** load Exercise **/
    loadExercise(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/LoadExercise', data);
    }

    removeExercise(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/RemoveExercise', data);
    }

    loadExerciseByGroup(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/LoadExerciseByGroup', data);
    }

    addExerciseAttachment(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/AddExerciseAttachment', data);
    }

    addExercise(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/AddExercise', data);
    }

    updateExercise(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/UpdateExercise', data);
    }

    updateExerciseFile(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/UpdateExerciseFile', data);
    }

    addExerciseSolution(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/AddExerciseSolution', data);
    }

    loadQuiz(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/LoadQuiz', data);
    }

    removeQuiz(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/RemoveQuiz', data);
    }

    loadQuizType(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Master/LoadQuizType', data);
    }

    loadQuizByGroup(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/LoadQuizByGroup', data);
    }

    addQuizAttachment(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/AddQuizAttachment', data);
    }

    addQuiz(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/AddQuiz', data);
    }

    updateQuiz(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/UpdateQuiz', data);
    }

    updateQuizFile(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/UpdateQuizFile', data);
    }

    addQuizSolution(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/AddQuizSolution', data);
    }

    loadWishDayEndOn(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Master/LoadWishDayEndOn', data);
    }

    sendCvQuote(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/SendCvQuote', data);
    }

    replyCvQuote(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/ReplyCvQuote', data);
    }

    replyTaskFeedback(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/ReplyTaskFeedback', data);
    }

    getCvTotalItems(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/GetCvTotalItems', data);
    }

    addVideo(data: any): Observable<any> {
        return this.http.post<any>(
            environment.serverUrl + 'Cms/AddVideo', data
        );
    }

    uploadFile(file: any, url: string, fileExt?: string): Observable<any> {
        let mime = file.type;
        if (fileExt) {
            switch (fileExt) {
                case '.flv': mime = 'video/x-flv'; break;
                case '.mp4': mime = 'video/mp4'; break;
                case '.m3u8': mime = 'application/x-mpegURL'; break;
                case '.ts': mime = 'video/MP2T'; break;
                case '.3gp': mime = 'video/3gp'; break;
                case '.mov': mime = 'video/quicktime'; break;
                case '.avi': mime = 'video/x-msvideo'; break;
                case '.wmv': mime = 'video/x-ms-wmv'; break;
                default: mime = file.type; break;
            }
        }
        return (this._http.put(
            url, file,
            {
                reportProgress: true,
                observe: 'events',
                headers: new HttpHeaders({
                    'Content-Type': mime
                })
            }
        ).pipe(map((events) => {
                switch (events.type) {
                    case HttpEventType.UploadProgress:
                        const progress = Math.round(100 * events.loaded / events.total);
                        return { status: 'progress', message: progress };
                    case HttpEventType.Response:
                        return { status: 200 };
                    default:
                        return `Unhandled event: ${event.type}`;
                }
            })
        ));
    }
}