import {Injectable} from '@angular/core';
import * as moment from 'moment';
import {Observable, Observer} from 'rxjs';
import {HttpService} from '../shared/http/service/http.service';
import * as FileSaver from 'file-saver';
import {ModalDirective} from '../lib/ng-uikit-pro-standard/free/modals';

@Injectable()
export class UtilsService {

    /*
    * @constructor
    */
    constructor(private http: HttpService) { }

    shortString(source: string, l: number): string {
        if (source.length <= l) {
            return source;
        }
        return source.substr(0, l) + '...';
    }
    isNumber(value: string | number): boolean {
        return ((value != null) && !isNaN(Number(value.toString())));
    }
    shortMonth(month: number): string {
        const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        if (month >= 12) {
            return monthList[11];
        }
        return monthList[month];
    }
    getCreateDateInfo(dateInput: any): any {
        const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        if (dateInput) {
            let createDate: Date;
            if (typeof dateInput === 'string') {
                createDate = new Date(dateInput);
            } else {
                createDate = dateInput;
            }
            const createDate_day = createDate.getDate();
            const createDate_month = (createDate.getMonth() >= 11) ? monthList[11] : monthList[createDate.getMonth()];
            const createDate_year = createDate.getFullYear();
            let createDate_hour: any = createDate.getHours();
            let createDate_ampm = '';
            if (createDate_hour > 12) {
                createDate_hour = createDate_hour - 12;
                createDate_ampm = 'PM';
            } else {
                createDate_ampm = 'AM';
            }
            createDate_hour = ('0' + createDate_hour.toString()).slice(-2);
            const createDate_minute = ('0' + createDate.getMinutes().toString()).slice(-2);
            const createDate_second = ('0' + createDate.getSeconds().toString()).slice(-2);
            let day_st = '';
            switch (createDate.getDate()) {
                case 1:
                case 21: {
                    day_st = 'st';
                    break;
                }
                case 2:
                case 22: {
                    day_st = 'nd';
                    break;
                }
                case 3:
                case 23: {
                    day_st = 'rd';
                    break;
                }
                default: {
                    day_st = 'th';
                    break;
                }
            }
            const result = {
                day: createDate_day,
                month: createDate_month,
                year: createDate_year,
                hour: createDate_hour,
                minute: createDate_minute,
                second: createDate_second,
                ampm: createDate_ampm,
                st: day_st
            };
            return result;
        }
        return {
            day: 1,
            month: monthList[0],
            year: 9999,
            hour: 1,
            minute: 1,
            second: 1,
            ampm: 'AM',
            st: 'st'
        };
    }
    getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    getRandomArbitraryInteger(min, max) {
        return Math.ceil(Math.random() * (max - min) + min);
    }

    getLocale(lang: number) {
        if (lang === 1) {
            return 'vi';
        } else if (lang === 0) {
            return 'en';
        } else {
            return 'zh_CN';
        }
    }

    dateDiff(date1: string, date2: string): any {
        const a = moment(new Date(date1), 'dd/mm/yyyy');
        const b = moment(new Date(date2), 'dd/mm/yyyy');
        const result = {
            days: Math.abs(b.diff(a, 'days')),
            hours: Math.abs(b.diff(a, 'hours')),
            minutes: Math.abs(b.diff(a, 'minutes'))
        };
        return result;
    }

    timeSpent(date1: string): any {
        if (date1) {
            const a = moment(new Date(date1), 'dd/mm/yyyy');
            const b = moment(new Date(), 'dd/mm/yyyy');
            const result = {
                years: Math.abs(b.diff(a, 'years')),
                months: Math.abs(b.diff(a, 'months')),
                days: Math.abs(b.diff(a, 'days')),
                hours: Math.abs(b.diff(a, 'hours')),
                minutes: Math.abs(b.diff(a, 'minutes')),
                seconds: Math.abs(b.diff(a, 'seconds'))
            };
            return result;
        }
        return null;
    }

    getThisWeekDays() {
        const curr = new Date;
        const firstDate = new Date(curr.getFullYear(), curr.getMonth() + 1, curr.getDate() - curr.getDay());
        return {start: firstDate, end: curr};
    }

    checkInThisWeek(dayString: string) {
        const myDate = moment(new Date(dayString), 'dd/mm/yyyy');
        const curr = new Date;
        const firstDate = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate() - curr.getDay());
        const a = moment(firstDate, 'dd/mm/yyyy');
        const b = moment(curr, 'dd/mm/yyyy');
        return myDate.diff(a, 'seconds') >= 0 && b.diff(myDate, 'seconds') >= 0;
    }

    numOfDaysInMonth(month: number, year: number) {
        switch (month) {
            case 1: case 3: case 5: case 7:  case 8: case 10: case 12: {
                return 31;
            }
            case 4: case 6: case 9: case 11: {
                return 30;
            }
            default: {
                if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
                    return 29;
                }
                return 28;
            }
        }
    }

    checkInThisMonth(dayString: string) {
        const myDate = moment(new Date(dayString), 'dd/mm/yyyy');
        const curr = new Date;
        const firstDate = new Date(curr.getFullYear(), curr.getMonth(), 1);
        const a = moment(firstDate, 'dd/mm/yyyy');
        const b = moment(curr, 'dd/mm/yyyy');
        return myDate.diff(a, 'seconds') >= 0 && b.diff(myDate, 'seconds') >= 0;
    }

    checkInThisQuarter(dayString: string) {const myDate = moment(new Date(dayString), 'dd/mm/yyyy');
        const curr = new Date;
        const quarter = Math.floor((curr.getMonth() / 3));
        const firstDate = new Date(curr.getFullYear(), quarter * 3, 1);
        const a = moment(firstDate, 'dd/mm/yyyy');
        const b = moment(curr, 'dd/mm/yyyy');
        return myDate.diff(a, 'seconds') >= 0 && b.diff(myDate, 'seconds') >= 0;
    }

    checkInThisYear(dayString: string) {
        const myDate = moment(new Date(dayString), 'dd/mm/yyyy');
        const curr = new Date;
        const year = curr.getFullYear();
        const firstDate = new Date(year, 1, 1);
        const a = moment(firstDate, 'dd/mm/yyyy');
        const b = moment(curr, 'dd/mm/yyyy');
        return myDate.diff(a, 'seconds') >= 0 && b.diff(myDate, 'seconds') >= 0;
    }

    getNormalDateString(dateString: string): string {
        const myDate = new Date(dateString);
        return myDate.getFullYear() + '/' + ('0' + (myDate.getMonth() + 1)).slice(-2) + '/' + ('0' + myDate.getDate()).slice(-2);
    }

    getNormalDateString2(dateString: string): string {
        const myDate = new Date(dateString);
        return myDate.getFullYear() + '_' + ('0' + (myDate.getMonth() + 1)).slice(-2) + '_' + ('0' + myDate.getDate()).slice(-2);
    }

    renameObjectKey(oldObj, oldName, newName) {
        if (oldName !== newName) {
            const temp = oldObj[oldName];
            oldObj[newName] = temp;
            delete oldObj[oldName];
        }
    }
    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    getBase64Image(img: HTMLImageElement) {
        // We create a HTML canvas object that will create a 2d image
        const canvas = document.createElement('canvas') as HTMLCanvasElement;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        // Convert the drawn image to Data URL
        const dataURL = canvas.toDataURL('image/png');
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
    }

    getImage(url: string, modal: ModalDirective) {
        const _this = this;
        return Observable.create((observer: Observer<string>) => {
            // create an image object
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = url;
            if (!img.complete) {
                // This will call another method that will create image from url
                img.onload = () => {
                    observer.next(this.getBase64Image(img));
                    observer.complete();
                };
                img.onerror = (err) => {
                    observer.error(err);
                };
            } else {
                observer.next(this.getBase64Image(img));
                observer.complete();
            }
        }).subscribe(data => {
            const contentTypeData = 'image/png';
            const blobData = _this.b64toBlob(data, contentTypeData);
            FileSaver.saveAs(blobData, 'certificate.png');
            modal.hide();
        });
    }

    b64toBlob(b64Data, contentType = '', sliceSize = 512) {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

    // give local file location
    // return Observable:
    // data: base64 data, fileExt: '.' + file extension
    loadImage(file: string): Observable<any> {
        return new Observable(obs => {
            const httpRequest = new XMLHttpRequest();
            httpRequest.onload = function() {
                const fileReader = new FileReader();
                fileReader.onloadend = function() {
                    const temp = fileReader.result.toString().split(';base64,');
                    const ext = temp[0].split('/');
                    obs.next({url: fileReader.result, data: temp[1], fileExt: '.' + ext[1]});
                }
                fileReader.readAsDataURL(httpRequest.response);
            };
            httpRequest.open('GET', 'https://cors-anywhere.herokuapp.com/' + file);
            httpRequest.responseType = 'blob';
            httpRequest.send();
        });
    }

    loadFile(filePath): Promise<any> {
        if (filePath) {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            resolve(xhr.responseText);
                        } else {
                            reject(xhr.responseText);
                        }
                      xhr.abort();
                    }
                }
                xhr.open('GET', 'https://cors-anywhere.herokuapp.com/' + filePath, true)
                xhr.send();
                /*this.http.get('https://cors-anywhere.herokuapp.com/' + filePath).subscribe(
                  resp => {
                    resolve(resp);
                    },
                    err => {
                      reject(err);
                    }
                  );*/
            });
        } else {
            return new Promise((resolve, reject) => {
                resolve('');
            });
        }
    }

    loadResource(filePath): Promise<any> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('get', 'https://cors-anywhere.herokuapp.com/' + filePath, true);
            // Load the data directly as a Blob.
            xhr.responseType = 'blob';
            xhr.onload = () => {
                resolve(URL.createObjectURL(xhr.response));
            };
            xhr.send();
        });
    }
}
