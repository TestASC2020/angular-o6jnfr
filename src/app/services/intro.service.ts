import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpService} from 'src/app/shared/http/service/http.service';
import {environment} from '../../environments/environment';

@Injectable()
export class IntroService {

  constructor(private http: HttpService) { }

    getIntroBoarding(): Observable<any> {
    return this.http.post(environment.serverUrl + 'Master/GetIntroBoarding', {});
  }
}