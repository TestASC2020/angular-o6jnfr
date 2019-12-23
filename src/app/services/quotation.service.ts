import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import {environment} from '../../environments/environment';
import {HttpService} from 'src/app/shared/http/service/http.service';
import {HttpHeaders} from '@angular/common/http';

@Injectable()
export class QuotationService {
    public static items: Array<any> = new Array<any>();
    constructor(private http: HttpService) {
    }

    loadCvTaskRqtList(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/LoadCvTaskRqtList', data);
    }

    loadApproveRqtQuote(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/LoadApproveRqtQuote', data);
    }

    loadCurriculumQuote(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/LoadCurriculumQuote', data);
    }

    addTaskFeedback(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/AddTaskFeedback', data);
    }
    QuoteRqtReaction(data, headers?: HttpHeaders): Observable<any> {
        return this.http.post(environment.serverUrl + 'Cms/QuoteRqtReaction', data, {headers: headers});
    }
}
