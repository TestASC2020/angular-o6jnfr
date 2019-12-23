import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import {environment} from '../../environments/environment';
import {HttpService} from 'src/app/shared/http/service/http.service';

@Injectable()
export class CoursesService {
    public static items: Array<any> = new Array<any>();
    constructor(private http: HttpService) {
    }
    loadCrsList(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Lms/LoadCrsList', data);
    }

    loadCrsInfo(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Lms/LoadCrsInfo', data);
    }

    loadCrsWithCv(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Lms/LoadCrsWithCv', data);
    }

    loadCurriculum(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Lms/LoadCurriculum', data);
    }

    getCrsTotalItems(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Lms/GetCrsTotalItems', data);
    }

    loadCrsStaff(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Lms/LoadCrsStaff', data);
    }

    loadCrsSaleOff(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Lms/LoadCrsSaleOff', data);
    }

    addCrsSaleOff(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Lms/AddCrsSaleOff', data);
    }

    updateCrsSaleOff(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Lms/UpdateCrsSaleOff', data);
    }

    removeCrsSaleOff(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Lms/RemoveCrsSaleOff', data);
    }

    removeCourse(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Lms/RemoveCourse', data);
    }

    loadCrsUserList(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Lms/LoadCrsUserList', data);
    }
    addCourse(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Lms/AddCourse', data);
    }
    updateCourse(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Lms/UpdateCourse', data);
    }
    // load report-feedback
    loadCrsFeedback(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Lms/LoadCrsFeedback', data);
    }

    loadOrgStaffProfile(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Org/LoadOrgStaffProfile', data);
    }
    loadUserProfile(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'User/LoadUserProfile', data);
    }

    loadCrsDiscussion(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/LoadCrsDiscussion', data);
    }

    loadThreadLesson(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/LoadThreadLesson', data);
    }

    loadMessage(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/LoadMessage', data);
    }

    addAction(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/AddAction', data);
    }

    addReply(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/AddReply', data);
    }

    loadReply(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/LoadReply', data);
    }

    removeAction(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/RemoveAction', data);
    }

    addFile(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/AddFile', data);
    }

    addFileNew(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/AddFileNew', data);
    }

    addMessage(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/AddMessage', data);
    }

    updateMsg(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/UpdateMsg', data);
    }

    updateThread(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/UpdateThread', data);
    }

    createThreadLesson(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/CreateThreadLesson', data);
    }
    BanCrsUser(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Lms/BanCrsUser', data);
    }
    UnBanCrsUser(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Lms/UnBanCrsUser', data);
    }
    checkBanCrsUser(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Lms/CheckBanUser', data);
    }
    SendNotiUserCrs(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Lms/SendNotiUserCrs', data);
    }
    GetActivityLog(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Lms/GetActivityLog', data);
    }
    LoadCrsProgess(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Lms/LoadCrsProgess', data);
    }
    loadReportType(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Master/LoadReportType', data);
    }
    loadReportPeriod(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Master/LoadReportPeriod', data);
    }
    loadTutors(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'User/LoadTutors', data);
    }
    getCrsEnrollLeft(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Lms/GetCrsEnrollLeft', data);
    }
    getCrsDiscussion(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Lms/GetCrsDiscussion', data);
    }
    getCrsFeedback(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Lms/GetCrsFeedback', data);
    }
    loadCrsProgress(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Lms/LoadCrsProgress', data);
    }
    getEnrollInfo(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Lms/GetEnrollInfo', data);
    }
    enrollFreeCourse(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Lms/EnrollFreeCourse', data);
    }
    loadCrsUserLeft(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Lms/LoadCrsUserLeft', data);
    }
    loadUserCrsProfile(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Lms/LoadUserCrsProfile', data);
    }
    updateCrsRank(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Lms/UpdateCrsRank', data);
    }
    getThreadInfo(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/GetThreadInfo', data);
    }
    loadMessageById(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/LoadMessageById', data);
    }
    loadCvInfoList(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/LoadCvInfoList', data);
    }
    loadCrsCategory(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Master/LoadCrsCategory', data);
    }
    loadOrgStaffList(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Org/LoadOrgStaffList', data);
    }
    updateCrsLogo(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Lms/UpdateCrsLogo', data);
    }
    removeStaff(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Lms/RemoveStaff', data);
    }
    addStaff(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Lms/AddStaff', data);
    }
}
