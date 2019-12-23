import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { CkEditorUploadAdapter } from 'src/app/utils/image-upload-adapter';
import { HttpService } from 'src/app/shared/http/service/http.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  public Editor = ClassicEditor;
  content: any;
  configs: any = {
    // plugins: [Image, ImageToolbar, ImageCaption, ImageStyle],
    toolbar: ['heading',
      '|',
      'alignment',                                               
      'bold',
      'italic',
      'link',
      'bulletedList',
      'numberedList',
      'imageUpload',
      'blockQuote',
      'undo',
      'redo'],
    image: {
      // You need to configure the image toolbar, too, so it uses the new style buttons.
      toolbar: ['imageTextAlternative', '|', 'imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:alignCenter', 'imageStyle:alignRight'],

      styles: [
        // This option is equal to a situation where no style is applied.
        'full',

        'alignCenter',
        // This represents an image aligned to the left.
        'alignLeft',

        // This represents an image aligned to the right.
        'alignRight'
      ]
    }
  }

  constructor(private http: HttpService) { }

  ngOnInit() {
    this.content = '';
  }

  onReady(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new CkEditorUploadAdapter(this.http, loader);
    };
  }

  submit() {
    console.log(this.content);
  }
}
