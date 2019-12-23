import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import {environment} from '../../environments/environment';
import {HttpService} from 'src/app/shared/http/service/http.service';
import {map} from 'rxjs/operators';
import {HttpEventType} from '@angular/common/http';

@Injectable()
export class AccountingService {
    public static items: Array<any> = new Array<any>();
    constructor(private http: HttpService) {
    }
    loadContractList(data): Observable<any> {
        return this.http.post(
            environment.serverUrl + 'Org/LoadContractList',
            data,
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

    LoadContract(data): Observable<any> {
        return this.http.post(
            environment.serverUrl + 'Org/LoadContract',
            data,
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


    loadOrgJournal(data): Observable<any> {
        return this.http.post(
            environment.serverUrl + 'Org/LoadOrgJournal',
            data,
            {
                reportProgress: true,
                observe: 'events'
            }
        ).pipe(
            map((event) => {
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

    loadCrsBalanceAmt(data): Observable<any> {
        return this.http.post(
            environment.serverUrl + 'Org/LoadCrsBalanceAmt',
            data,
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
}
