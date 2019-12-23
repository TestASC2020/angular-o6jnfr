import {
    HttpClient
} from '@angular/common/http';
import { Injectable } from '@angular/core';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class HttpService extends HttpClient {
}