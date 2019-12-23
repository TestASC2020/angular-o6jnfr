import { Injectable } from '@angular/core';

@Injectable()
export class PreloaderService {

    loaderStatus: boolean = false;

    constructor() {
    }

    getStatus() {
        return this.loaderStatus;
    }

    enableLoading() {
        setTimeout(() => {
            this.loaderStatus = true;
        }, 0);
    }

    disableLoading() {
        setTimeout(() => {
            this.loaderStatus = false;
        }, 0);
    }

}