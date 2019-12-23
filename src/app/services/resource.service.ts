
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/shared/http/service/http.service';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  constructor(private http: HttpService) { }
  
  isAbsoluteURL(url: string) {
    return (url.indexOf('http://') >= 0 || url.indexOf('https://') >= 0)
  }

  getExtensionFile(filename: string) {
    const fileParts = filename.split('.');
    return fileParts.length > 1 ? fileParts[fileParts.length - 1] : '';
  }

  saveFile(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      const a = document.createElement('a');
      document.body.appendChild(a);
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = filename;
      a.click();
      setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
      }, 0)
    }
  }

  trimObject(object: any): any {
    for (const prop of Object.keys(object)) {
      if (object[prop] && typeof object[prop] === 'string') {
        object[prop] = object[prop].trim();
      }
    }
    return object;
  }
}