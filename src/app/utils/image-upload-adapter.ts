import { HttpService } from '../shared/http/service/http.service';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

export class CkEditorUploadAdapter {
  constructor(private http: HttpService, private loader: any) {
    // The file loader instance to use during the upload.
  }

  // Starts the upload process.
  upload() {

    // Upload to server and get file url
    let formData: FormData = new FormData();
    formData.append('uploadFile', this.loader.file, this.loader.file.name);
    let httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    };
    // let options = new RequestOptions({ headers: headers });
    return this.http.post('http://localhost:3000/api/imagecontainers/floormap/upload', formData, httpOptions).pipe(
      map((data: any) => {
        return {
          default: 'http://localhost:3000/api/imagecontainers/floormap/download/' + data.result.files.uploadFile[0].name
        }
      })
    ).toPromise();
  }

  // Aborts the upload process.
  abort() {
  }
}