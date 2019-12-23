import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalDirective} from '../../../../../lib/ng-uikit-pro-standard/free/modals';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CurriculumsService} from '../../../../../services/curriculums.service';
import {CookieService} from 'ngx-cookie';
import {AppState} from '../../../../../app-state.service';
import {ToastService} from '../../../../../lib/ng-uikit-pro-standard/pro/alerts';
import {UtilsService} from '../../../../../services/utils.service';
import {ClientEventService} from '../../../../../services/client-event.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-courses-course-curriculum',
  templateUrl: './course-lesson.component.html',
  styleUrls: ['./course-lesson.component.scss']
})
export class CourseLessonComponent implements OnInit {
    @Input() toRouters: Array<any>;
    lessonForm: FormGroup;
    languagesList: Array<any>;
    view_languagesList: Array<any>;
    lessonList: Array<any> = new Array<any>();
    selectedVideoNo: number = 0;
    lesson: any;
    lessonGroup: Array<any> = new Array<any>();

    constructor(private router: Router,
                private route: ActivatedRoute,
                private formBuilder: FormBuilder,
                private service: CurriculumsService,
                private cookieService: CookieService,
                private appState: AppState,
                private toastrService: ToastService,
                private utilsService: UtilsService,
                private clientEventService: ClientEventService,
                private translate: TranslateService) {
        this.lessonForm = new FormGroup({
            items: this.formBuilder.array([]),
        });
    }

    addVideoControl(lesson?: any) {
        const _this = this;
        const ctrls = (<FormArray>this.lessonForm.controls['items']).controls;
        let index = 0;
        if (!lesson) {
            index = (ctrls.length < 1) ? 0 : ctrls.length;
            ctrls.push(this.formBuilder.group({
                no: new FormControl(index),
                name: new FormControl(''),
                url: new FormControl(''),
                fileExt: new FormControl(''),
                lenSec: new FormControl(''),
                allowPreview: new FormControl(false),
                previewPerc: new FormControl(0),
                defaultSub: new FormControl({value: 0, disabled: true}),
                videoSig: new FormControl(0),
                data: new FormControl(''),
                type: new FormControl(''),
                size: new FormControl(0),
                thumbnail: new FormControl(''),
                onEdit: new FormControl(false),
                subtitles: this.formBuilder.array([])
            }));
        } else {
            index = lesson.no;
            const subsList: Array<FormGroup> = new Array<FormGroup>();
            if (lesson.subs && lesson.subs.length > 0) {
                let count = 0;
                lesson.subs.forEach(sbItem => {
                    let extObj = sbItem.url;
                    let ext = '';
                    if (extObj) {
                        extObj = extObj.split('.');
                        ext = extObj[extObj.length - 1];
                    }
                    const sub = this.formBuilder.group({
                        id: new FormControl(count),
                        lang: new FormControl(sbItem.lang, Validators.required),
                        subtitle: new FormControl(''),
                        data: new FormControl(''),
                        onReady: new FormControl(true),
                        signature: new FormControl(sbItem.signature),
                        url: new FormControl(sbItem.url),
                        videoSig: new FormControl(lesson.signature),
                        fileExt: new FormControl(ext)
                    });
                    subsList.push(sub);
                    count++;
                });
            }
            ctrls.push(_this.formBuilder.group({
                no: new FormControl(index, [Validators.required]),
                name: new FormControl(lesson.name, [Validators.required]),
                url: new FormControl(lesson.lessonUrl, [Validators.required]),
                fileExt: new FormControl((lesson.fileExt) ? lesson.fileExt : '', [Validators.required]),
                lenSec: new FormControl((lesson.lenSec) ? lesson.lenSec : 0, [Validators.required]),
                allowPreview: new FormControl((lesson.allowPreview) ? lesson.allowPreview : false, [Validators.required]),
                previewPerc: new FormControl((lesson.previewPerc) ? lesson.previewPerc : 0, [Validators.required]),
                defaultSub: new FormControl({value: (lesson.defaultSub) ? lesson.defaultSub : 0, disabled: true}),
                videoSig: new FormControl(lesson.signature, [Validators.required]),
                data: new FormControl('', [Validators.required]),
                type: new FormControl(''),
                size: new FormControl(0),
                thumbnail: new FormControl(lesson.thumbnail, [Validators.required]),
                onEdit: new FormControl(true),
                subtitles: _this.formBuilder.array(subsList)
            }));
        }
        _this.selectedVideoNo = index + 1;
    }

    getSelectedVideoData(): string {
        let temp = '';
        const ctrls = (<FormArray>this.lessonForm.controls['items']).controls;
        for (let i = 0; i < ctrls.length; i++) {
            if (Number.parseInt(ctrls[i]['controls']['no'].value.toString(), 10) === Number.parseInt(this.selectedVideoNo.toString(), 10)) {
                temp = document.getElementById('file_video_' + i).getAttribute('src');
                return temp.replace('unsafe:', '');
            }
        }
        return '';
    }

    getSelectedVideoThumbnailData(): string {
        let temp = '';
        const ctrls = (<FormArray>this.lessonForm.controls['items']).controls;
        for (let i = 0; i < ctrls.length; i++) {
            if (Number.parseInt(ctrls[i]['controls']['no'].value.toString(), 10) === Number.parseInt(this.selectedVideoNo.toString(), 10)) {
                temp = document.getElementById('file_video_' + i).getAttribute('poster');
                return temp.replace('unsafe:', '');
            }
        }
        return '';
    }

    getLanguageName(lang: any): string {
        return this.languagesList[this.languagesList.
        map(it => it.value).indexOf(JSON.parse(lang.toString()))].display;
    }

    getLanguageSrcLang(langName: string): string {
        const temp = {
            'English': 'en',
            'Vietnamese': 'vi',
            'Chinese': 'zh',
            'Korean': 'ko',
            'Japanese': 'ja',
            'French': 'fr'
        };
        return temp[langName];
    }

    getLanguageLabel(cod: any): string {
        const temp = {
            '0': 'English',
            '1': 'Vietnam',
            '2': 'China',
            '5': 'Korea',
            '4': 'Japan',
            '3': 'France'
        };
        return temp[cod.toString()];
    }

    doInit() {
        this.view_languagesList = [];
    }

    processLessonNoList(lessonList: Array<any>) {
        lessonList.sort((a, b) => a.no - b.no);
        for (let i = 0; i < lessonList.length; i++) {
            lessonList[i].no = i;
        }
    }

    ngOnInit() {
        const _this = this;
        window.document.onkeydown = function(e) {
            if (e.keyCode === 27) {
                _this.lightbox_close();
            }
        };
        if (this.cookieService.get('routLinks')) {
            this.toRouters = JSON.parse(this.cookieService.get('routLinks'));
        }
        if (this.cookieService.get('lessonInfo')) {
            this.lesson = JSON.parse(this.cookieService.get('lessonInfo'));
            if (this.cookieService.get('lessonGroup')) {
                _this.lessonGroup = JSON.parse(this.cookieService.get('lessonGroup'));
            }
            _this.loadLessonsList();
        }
    }

    loadLessonsList() {
        const _this = this;
        this.lessonForm = new FormGroup({
            items: this.formBuilder.array([]),
        });
        this.service.loadLessonByGrp({lang: this.appState.locale.lang,
            grpSig: this.lesson.signature, subLang: 1}).subscribe(res => {
            _this.lessonList = res['data'];
            _this.processLessonNoList(_this.lessonList);
            _this.service.loadSubtitleLang({lang: _this.appState.locale.lang}).subscribe(res2 => {
                const temp = res2['data'];
                _this.languagesList = new Array<any>();
                _this.view_languagesList = [];
                temp.forEach(it => {
                    const t = {
                        value: it.tag,
                        display: it.text,
                        srclang: _this.getLanguageSrcLang(it.text)
                    };
                    _this.languagesList.push(t);
                });
                _this.lessonList.forEach(lesson => {
                    _this.addVideoControl(lesson);
                });
                _this.doInit();
            });
        });
    }

    lessonGroupChange($event) {
        const arr = this.lessonGroup.map(item => item.signature);
        const index = arr.indexOf($event.target.value);
        this.lesson = this.lessonGroup[index];
        this.loadLessonsList();
    }

    getLanguageFlag(lang: any): string {
        const srcLang = this.getLanguageSrcLang(this.getLanguageName(lang));
        return '../../../../../../assets/icons/flags/' +
            srcLang + '_flag.png';
    }

    getName(i) {
        return this.lessonForm.get('items')['controls'][i].controls['name'].value;
    }

    generateVideoSubtitleTracks() {
        document.getElementById('VisaChipCardVideo').innerHTML = '';
        const ctrls =  (<FormArray>this.lessonForm.get('items')['controls'][this.selectedVideoNo].controls['subtitles']).controls;
        for (let i = 0; i < ctrls.length; i++) {
            const track = document.createElement('track') as HTMLTrackElement;
            track.setAttribute('kind', 'subtitles');
            track.setAttribute('srclang', this.languagesList[
                this.languagesList.map(item => item.value)
                    .indexOf(JSON.parse(ctrls[i].get('lang').value.toString()))
                ].srclang);
            if (ctrls[i].get('lang').value.toString() === this.lessonForm.get('items')['controls']
                [this.selectedVideoNo].get('defaultSub').value.toString()) {
                track.setAttribute('default', '');
            }
            track.setAttribute('label', this.getLanguageLabel(ctrls[i].get('lang').value.toString()));
            this.utilsService.loadResource(ctrls[i].get('url').value).then(res => {
                track.src = res;
                document.getElementById('VisaChipCardVideo').appendChild(track);
            });
        }
        document.getElementById('VisaChipCardVideo')
            .setAttribute('src', this.lessonForm
                .get('items')['controls'][this.selectedVideoNo].controls['url'].value);
        document.getElementById('VisaChipCardVideo')
            .setAttribute('poster', this.lessonForm
                .get('items')['controls'][this.selectedVideoNo].controls['thumbnail'].value);
    }

    openVideoPlayer(itemNo: number) {
        this.selectedVideoNo = itemNo;
        this.generateVideoSubtitleTracks();
        this.lightbox_open();
    }

    lightbox_open() {
        const lightBoxVideo = document.getElementById('VisaChipCardVideo') as HTMLVideoElement;
        window.scrollTo(0, 0);
        document.getElementById('light').style.display = 'block';
        document.getElementById('fade').style.display = 'block';
        lightBoxVideo.play();
    }

    lightbox_close() {
        const lightBoxVideo = document.getElementById('VisaChipCardVideo') as HTMLVideoElement;
        document.getElementById('light').style.display = 'none';
        document.getElementById('fade').style.display = 'none';
        lightBoxVideo.pause();
        lightBoxVideo.src = null;
        lightBoxVideo.poster = null;
    }
}
