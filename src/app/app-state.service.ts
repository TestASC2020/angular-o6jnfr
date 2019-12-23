import { Injectable } from '@angular/core';

@Injectable()
export class AppState {
    private _currentLocale: any;

    constructor() { }

    get locale() {
        return this._currentLocale;
    }

    set locale(locale: any) {
        this._currentLocale = locale;
    }
}