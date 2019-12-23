import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalDirective} from '../../../../../lib/ng-uikit-pro-standard/free/modals';
import {CurriculumsService} from '../../../../../services/curriculums.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';
import {AppState} from '../../../../../app-state.service';
import {ToastService} from '../../../../../lib/ng-uikit-pro-standard/pro/alerts';
import {TranslateService} from '@ngx-translate/core';
import {UtilsService} from '../../../../../services/utils.service';
import {ClientEventService} from '../../../../../services/client-event.service';

@Component({
    selector: 'app-cms-creator-curriculum-lesson-view',
    templateUrl: './curriculum-lesson-view.component.html',
    styleUrls: ['./curriculum-lesson-view.component.scss']
})
export class CurriculumLessonViewComponent implements OnInit, OnDestroy {
    @ViewChild('fileInput') fileInput: ElementRef;
    @ViewChild('subtitle') subtitle: ModalDirective;
    @ViewChild('confirmDeleteDialog') confirmDeleteDialog: ModalDirective;
    @ViewChild('errorDialog') errorDialog: ModalDirective;
    @Input() toRouters: Array<any>;
    lessonForm: FormGroup;
    addVideoForm: FormGroup;
    subtitleForm: FormGroup;
    languagesList: Array<any>;
    view_languagesList: Array<any>;
    lessonList: Array<any> = new Array<any>();
    acceptedFileExtension: Array<any> = ['srt', 'src', 'ssa', 'sbv', 'vtt', 'dfxp', 'ttml'];
    selectedVideoNo: number = 0;
    selectedSubtitleId: number = 0;
    canSaveVideo: boolean = false;
    lesson: any;
    @Input() editable: boolean = null;
    error: any;
    selectedIndex: number;
    uploadResponse = { status: '', message: ''};

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
        this.addVideoForm = new FormGroup({
            no: new FormControl('', [Validators.required]),
            name: new FormControl('', [Validators.required]),
            url: new FormControl('', [Validators.required]),
            fileExt: new FormControl('', [Validators.required]),
            lenSec: new FormControl('', [Validators.required]),
            defaultSub: new FormControl({value: 0, disabled: true}),
            allowPreview: new FormControl(false, [Validators.required]),
            previewPerc: new FormControl('', [Validators.required]),
            videoSig: new FormControl('', [Validators.required]),
            type: new FormControl(''),
            size: new FormControl(0),
            data: new FormControl('', [Validators.required]),
            thumbnail: new FormControl('', [Validators.required]),
            onEdit: new FormControl(false),
            subtitles: this.formBuilder.array([])
        });
        this.subtitleForm = new FormGroup({
            id: new FormControl(''),
            subtitle: new FormControl({value: '', disabled: true}, [Validators.required]),
            lang: new FormControl('', [Validators.required]),
            data: new FormControl('', [Validators.required]),
            signature: new FormControl(''),
            url: new FormControl(''),
            videoSig: new FormControl(''),
            fileExt: new FormControl('', [Validators.required])
        });
    }

    getName(i) {
        return this.lessonForm.get('items')['controls'][i].controls['name'].value;
    }

    addVideoSubTitlteComponent(sub_i: number) {
        this.subtitleForm.get('subtitle').setValue('');
        this.selectedVideoNo = sub_i;
        const ctrls = (<FormArray>(<FormArray>this.lessonForm.controls['items']).controls[sub_i]['controls']['subtitles']).controls;
        this.view_languagesList = [];
        const temp = [];
        for (let i = 0; i < ctrls.length; i++) {
            temp.push(JSON.parse(ctrls[i]['controls']['lang'].value.toString()));
        }
        this.languagesList.forEach(item => {
            if (temp.indexOf(item.value) < 0) {
                this.view_languagesList.push(item);
            }
        });
        const subIndex = (ctrls.length < 1) ? 0 : ctrls.length;
        ctrls.push(this.formBuilder.group({
            id: new FormControl( subIndex, [Validators.required]),
            subtitle: new FormControl( ''),
            lang: new FormControl(this.view_languagesList[0].value, [Validators.required]),
            fileExt: new FormControl(''),
            onReady: new FormControl(false),
            signature: new FormControl(''),
            url: new FormControl(''),
            videoSig: new FormControl((<FormArray>this.lessonForm.controls['items']).controls[sub_i]['controls']['videoSig'].value),
            data: new FormControl('')
        }));
        this.selectedSubtitleId = subIndex;
        this.subtitleForm.get('lang').setValue(this.view_languagesList[0].value);
        this.subtitle.show();
    }

    addVideoControl(lesson?: any) {
        this.addVideoForm.get('name').setValue('');
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
        _this.addVideoForm.get('no').setValue(index);
    }

    addVideoComponent() {
        document.getElementById('start').classList.remove('hidden');
        document.getElementById('response').classList.add('hidden');
        document.getElementById('notvideo').classList.remove('hidden');
        this.addVideoControl();
        document.getElementById('AddVisaChipCardVideo').style.display = 'none';
        this.lightboxAdd_open();
    }

    updateLesson(index) {
        const data = {
            lang: this.appState.locale.lang,
            name: this.lessonForm.get('items')['controls'][index].controls['name'].value,
            defaultSub: (((<FormArray>this.lessonForm.controls['items']).controls[index]['controls']['defaultSub']) ?
                JSON.parse((<FormArray>this.lessonForm.controls['items']).controls[index]['controls']['defaultSub'].value.toString()) : 0),
            sig: this.lessonForm.get('items')['controls'][index].controls['videoSig'].value,
            allowPreview: this.lessonForm.get('items')['controls'][index].controls['allowPreview'].value,
            previewPerc: (this.lessonForm.get('items')['controls'][index].controls['previewPerc'].value) ?
                JSON.parse(this.lessonForm.get('items')['controls'][index].controls['previewPerc'].value.toString()) : 0
        };
        this.service.updateLesson(data).subscribe(res => {
            this.updateLessonSuccessNotif('#save-lesson-area-' + index);
        });
    }

    ngOnDestroy() {
        this.cookieService.remove('lessonInfo');
    }

    getLanguageName(lan: any): string {
        return this.languagesList[this.languagesList.
        map(it => it.value).indexOf(JSON.parse(lan.toString()))].display;
    }

    getLanguageSrcLang(langName: string): string {
        const temp = {
            '0': 'en',
            '1': 'vi',
            '2': 'zh',
            '5': 'ko',
            '4': 'ja',
            '3': 'fr'
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
        if (!this.toRouters || this.toRouters === null) {
            this.toRouters = [
                {
                    'link': '../../../',
                    'display': 'MESSAGE.NameList.Curriculums'
                },
                {
                    'link': '../',
                    'display': this.lesson.unitName
                },
                {
                    'display': 'LAYOUT.EDIT'
                },
            ];
        }
        const _this = this;
        this.subtitle.onShown.subscribe(data => {
            _this.subtitleForm.get('subtitle').setValue('');
            document.getElementById('subtitle_file').setAttribute('value', '');
        });
        const fileSelect    = document.getElementById('file-upload'),
            fileDrag      = document.getElementById('file-drag');

        fileSelect.addEventListener('change', this.fileSelectHandler.bind(this), false);

        // Is XHR2 available?
        const xhr = new XMLHttpRequest();

        document.querySelector('video').addEventListener('loadedmetadata', function() {});

        if (xhr.upload) {
            // File Drop
            fileDrag.addEventListener('dragover', this.fileDragHover.bind(this), false);
            fileDrag.addEventListener('dragleave', this.fileDragHover.bind(this), false);
            fileDrag.addEventListener('drop', this.fileSelectHandler.bind(this), false);
        }
        this.view_languagesList = [];
        this.subtitleForm.get('lang').setValue(this.languagesList[0].value);
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
                _this.lightboxAdd_close();
            }
        };
        if (this.editable === null && this.cookieService.get('editable')) {
            this.editable = JSON.parse(this.cookieService.get('editable')).editable;
        }
        if (this.cookieService.get('routLinks') && this.toRouters === null) {
            console.log(this.toRouters);
            this.toRouters = JSON.parse(this.cookieService.get('routLinks'));
        }
        if (this.cookieService.get('lessonInfo')) {
            this.lesson = JSON.parse(this.cookieService.get('lessonInfo'));
            this.service.loadLessonByGrp({lang: this.appState.locale.lang,
                grpSig: this.lesson.signature, subLang: 1}).subscribe(res => {
                this.lessonList = res['data'];
                this.processLessonNoList(this.lessonList);
                this.service.loadSubtitleLang({lang: this.appState.locale.lang}).subscribe(res2 => {
                    const temp = res2['data'];
                    this.languagesList = new Array<any>();
                    this.view_languagesList = [];
                    temp.forEach(it => {
                        const t = {
                            value: it.tag,
                            display: it.text,
                            srclang: this.getLanguageSrcLang(it.text)
                        };
                        this.languagesList.push(t);
                    });
                    this.lessonList.forEach(lesson => {
                        this.addVideoControl(lesson);
                    });
                    this.doInit();
                });
            });
        }
    }

    getLanguageFlag(lan: any): string {
        const srcLang = this.getLanguageSrcLang(lan);
        return '../../../../../../assets/icons/flags/' +
            srcLang + '_flag.png';
    }

    onSubmit() {
        // do something here
    }
    save() {
        // do something here
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

    uploadLanguage() {
        const _this = this;
        if (this.subtitleForm.get('subtitle') && this.subtitleForm.get('subtitle').value) {
            // chen subtitle vao video hien tai voi ngon ngu danh kem
            const fi = this.fileInput.nativeElement;
            if (fi.files && fi.files[0]) {
                const fileToUpload = fi.files[0];
                const reader = new FileReader();
                const ext = fileToUpload.name.split('.');
                reader.onloadend = function(e) {
                    _this.lessonForm.get('items')['controls'][_this.selectedVideoNo].controls['subtitles']
                        ['controls'][_this.selectedSubtitleId]['controls']['url'].setValue(reader.result.toString());
                    const subData = {
                        subtitle: _this.subtitleForm.get('subtitle').value,
                        lang: JSON.parse(_this.subtitleForm.controls['lang'].value.toString()),
                        data: reader.result.toString().split(',')[1],
                        fileExt: ('.' + ext[ext.length - 1])
                    };
                    document.getElementById('subArea_' + _this.selectedVideoNo + '_' + _this.selectedSubtitleId).
                    setAttribute('style', 'display: block;');
                    document.getElementById('subLanguage_' + _this.selectedVideoNo + '_' + _this.selectedSubtitleId).
                        innerText = _this.languagesList[_this.languagesList.
                    map(ii => ii.value).indexOf(subData.lang)].display;
                    document.getElementById('subLanguageImg_' + _this.selectedVideoNo + '_' + _this.selectedSubtitleId).
                    setAttribute('src', _this.getLanguageFlag(subData.lang));
                    _this.lessonForm.get('items')['controls'][_this.selectedVideoNo].
                        controls['subtitles']['controls'][_this.selectedSubtitleId]['controls']
                        ['subtitle'].setValue(_this.subtitleForm.controls['subtitle'].value);
                    _this.lessonForm.get('items')['controls'][_this.selectedVideoNo].
                        controls['subtitles']['controls'][_this.selectedSubtitleId]['controls']
                        ['lang'].setValue(subData.lang);
                    _this.lessonForm.get('items')['controls'][_this.selectedVideoNo].
                        controls['subtitles']['controls'][_this.selectedSubtitleId]['controls']
                        ['data'].setValue(subData.data);
                    _this.lessonForm.get('items')['controls'][_this.selectedVideoNo].
                        controls['subtitles']['controls'][_this.selectedSubtitleId]['controls']
                        ['onReady'].setValue(true);
                    _this.lessonForm.get('items')['controls'][_this.selectedVideoNo].
                        controls['subtitles']['controls'][_this.selectedSubtitleId]['controls']
                        ['fileExt'].setValue(subData.fileExt);
                    const track = document.createElement('track');
                    track.setAttribute('kind', 'subtitles');
                    if (_this.selectedSubtitleId === 0) {
                        track.removeAttribute('default');
                    }
                    track.setAttribute('srclang', _this.languagesList[
                        _this.languagesList.map(item => item.value)
                            .indexOf(subData.lang)
                        ].srclang);
                    track.setAttribute('label', _this.languagesList[
                        _this.languagesList.map(item => item.value)
                            .indexOf(subData.lang)
                        ].display);
                    if (e.target && e.target['result']) {
                        track.setAttribute('src', reader.result.toString());
                    }
                    document.getElementById('AddVisaChipCardVideo').appendChild(track);

                    fi.value = '';
                    _this.service.addLessonSub(
                        {
                            lang: subData.lang,
                            data: subData.data,
                            language: _this.appState.locale.lang,
                            fileExt: subData.fileExt,
                            videoSig: _this.lessonForm.get('items')['controls'][_this.selectedVideoNo].
                                controls['videoSig'].value
                        }).subscribe(rr => {
                        _this.lessonForm.get('items')['controls'][_this.selectedVideoNo].
                        get('subtitles')['controls'][_this.selectedSubtitleId].get('signature').setValue(rr['data'].signature);
                    });
                };
                reader.readAsDataURL(fileToUpload);
            }
        }
    }

    previewFile($event) {
        const file = $event.target.files[0];
        if (file) {
            if (file.size === 0) {
                alert('Empty data');
                this.subtitleForm.get('subtitle').setValue('');
                $event.target.value = '';
                return;
            }
            if (this.checkFileExtension(file.name)) {
                this.subtitleForm.get('subtitle').setValue(file.name);
            } else {
                alert('Invalid file extension');
                this.subtitleForm.get('subtitle').setValue('');
                $event.target.value = '';
            }
        }
    }

    openFile() {
        this.fileInput.nativeElement.click();
    }

    openFileThumbnails(index) {
        (document.getElementById('file_thumbnails_' + index) as HTMLInputElement).click();
    }

    previewThumbnails(index, $event) {
        const file: File = $event.target.files[0];
        const temp = this;
        const reader: FileReader = new FileReader();
        if (file) {
            reader.onloadend = function(e) {
                if (e.target && e.target['result']) {
                    (document.getElementById('file_video_' + index) as HTMLInputElement).setAttribute('poster', e.target['result']);
                    temp.lessonForm.get('items')['controls'][index]['controls']['thumbnail'].setValue(e.target['result']);
                    const ext = file.name.split('.');
                    const thumbnail = {
                        data: reader.result.toString().split(',')[1],
                        fileExt: ('.' + ext[ext.length - 1]),
                        lessonSig: temp.lessonForm.get('items')['controls'][index].controls['videoSig'].value
                    };
                    temp.service.uploadVideoThumbnail(thumbnail).subscribe(res => {
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    }

    get console() {
        return console;
    }

    checkFileExtension(fileName) {
        let fileExtension = '';
        if (fileName.lastIndexOf('.') > 0) {
            fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length);
        }
        if (fileExtension === '' || this.acceptedFileExtension.indexOf(fileExtension) < 0) {
            return false;
        }
        return true;
    }

    fileDragHover(e) {
        const fileDrag = document.getElementById('file-drag');

        e.stopPropagation();
        e.preventDefault();

        fileDrag.className = (e.type === 'dragover' ? 'hover' : 'modal-body file-upload');
    }

    output(msg) {
        // Response
        const m = document.getElementById('messages');
        m.innerHTML = msg;
    }

    saveVideo() {
        const _this = this;
        const data = {
            'no': this.addVideoForm.get('no').value,
            'name': this.addVideoForm.get('name').value,
            'fileExt': this.addVideoForm.get('fileExt').value,
            'lenSec': this.addVideoForm.get('lenSec').value,
            'previewPerc': this.addVideoForm.get('previewPerc').value,
            'allowPreview': this.addVideoForm.get('allowPreview').value,
            'grpSig': this.lesson.signature
        };
        this.service.addVideo(data).subscribe(resp1 => {
            data['signature'] = resp1['data']['signature'];
            data['data'] = _this.addVideoForm.get('data').value;
            data['url'] = resp1['data']['lessonUrl'];
            const dataSend = {
                file: data['data'],
                url: resp1['data']['uploadUrl']
            };
            _this.service.uploadFile(dataSend.file, dataSend.url, data['fileExt'])
                .subscribe(
                    (resp: any) => {
                        this.uploadResponse = resp;
                        if (resp.status === 200) {
                            this.uploadResponse = null;
                            document.getElementById('file_video_' + _this.selectedVideoNo).setAttribute('src', data['url']);
                            _this.lessonForm.get('items')['controls'][_this.selectedVideoNo].controls['videoSig']
                                .setValue(data['signature']);
                            _this.lessonForm.get('items')['controls'][_this.selectedVideoNo].controls['no'].setValue(data['no']);
                            _this.lessonForm.get('items')['controls'][_this.selectedVideoNo].controls['name'].setValue(data['name']);
                            _this.lessonForm.get('items')['controls'][_this.selectedVideoNo].controls['data'].setValue(data['data']);
                            _this.lessonForm.get('items')['controls'][_this.selectedVideoNo]
                                .controls['fileExt'].setValue(data['fileExt']);
                            _this.lessonForm.get('items')['controls'][_this.selectedVideoNo]
                                .controls['lenSec'].setValue(data['lenSec']);
                            _this.lessonForm.get('items')['controls'][_this.selectedVideoNo].controls['previewPerc']
                                .setValue(data['previewPerc']);
                            _this.lessonForm.get('items')['controls'][_this.selectedVideoNo].controls['allowPreview']
                                .setValue(data['allowPreview']);
                            _this.lessonForm.get('items')['controls'][_this.selectedVideoNo].controls['url'].setValue(data['url']);
                            _this.lessonForm['controls']['items']['controls'][_this.selectedVideoNo].get('onEdit').setValue(true);
                            _this.lightboxAdd_close();
                            _this.canSaveVideo = false;
                            const element = document.querySelector('.lesson-area');
                            if (element) {
                                _this.scrollSmoothToBottom(element);
                            }
                        }
                    },
                    err => {
                        _this.error = err;
                        _this.errorDialog.show();
                    }
                );
        });
    }

    openDeleteDialog(itemId: number) {
        this.selectedIndex = itemId;
        this.confirmDeleteDialog.show();
    }

    deleteSelectedVideo() {
        const itemId = this.selectedIndex;
        const video = {
            lang: this.appState.locale.lang,
            sig: this.lessonForm.get('items')['controls'][itemId].controls['videoSig'].value
        };
        this.service.removeLesson(video).subscribe(
            res => {
                const control = (<FormArray>this.lessonForm.controls['items']);
                control.removeAt(Number.parseInt(itemId.toString(), 10));
                this.confirmDeleteDialog.hide();
                const elementId = '#delete-icon-' + this.selectedIndex;
                this.updateLessonSuccessNotif(elementId);
            },
            err => {
                this.confirmDeleteDialog.hide();
                this.error = err;
                this.errorDialog.show();
            }
        );
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

    lightboxAdd_open() {
        window.scrollTo(0, 0);
        document.getElementById('lightAdd').style.display = 'block';
        document.getElementById('fadeAdd').style.display = 'block';
    }

    lightboxAdd_close() {
        document.getElementById('lightAdd').style.display = 'none';
        document.getElementById('fadeAdd').style.display = 'none';
    }

    doNothing() {}

    removeVideo() {
        const control = (<FormArray>this.lessonForm.controls['items']);
        control.removeAt(this.selectedVideoNo);
    }

    unloadLanguage() {
        const control = (<FormArray>this.lessonForm.controls['items']).controls[this.selectedVideoNo]['controls']['subtitles'];
        control.removeAt(this.selectedSubtitleId);
        if (document.getElementById('track_' + this.selectedVideoNo + '_' + this.selectedSubtitleId)) {
            document.getElementById('track_' + this.selectedVideoNo + '_' + this.selectedSubtitleId).remove();
        }
    }

    unloadLanguageAt(i, j) {
        const control = this.lessonForm.get('items')['controls'][i].get('subtitles');
        this.service.removeLessonSub({
            subSig:  control['controls'][j].get('signature').value
        }).subscribe(res => {
            control.removeAt(j);
            if (document.getElementById('track_' + i + '_' + j)) {
                document.getElementById('track_' + i + '_' + j).remove();
            }
        });
    }

    parseFile(file) {
        this.selectedVideoNo = (<FormArray>this.lessonForm.controls['items']).length;
        if (!document.getElementById('file_video_' + this.selectedVideoNo)) {
            this.selectedVideoNo--;
        }
        const _this = this;
        this.output(
            '<strong>' + file.name + '</strong>'
        );
        const ext = file.name.split('.');
        _this.addVideoForm.get('fileExt').setValue('.' + ext[ext.length - 1]);
        document.getElementById('start').classList.add('hidden');
        document.getElementById('response').classList.remove('hidden');
        document.getElementById('notvideo').classList.add('hidden');
        const video = document.getElementById('AddVisaChipCardVideo') as HTMLVideoElement;
        const objUrl = URL.createObjectURL(file);
        video.src = objUrl;
        video.addEventListener('loadedmetadata', function() {
            if (video.buffered.length === 0) {
                return;
            }
            if (Math.round(video.buffered.end(0)) / Math.round(video.seekable.end(0)) === 1) {
                // Entire video is downloaded
                _this.addVideoForm.get('url').setValue(objUrl);
                document.getElementById('AddVisaChipCardVideo').setAttribute('src', objUrl);
                _this.addVideoForm.get('lenSec').setValue(Math.floor(video.duration));
                _this.canSaveVideo = true;
            }
        });
    }

    fileSelectHandler(e) {
        // Fetch FileList object
        const files = e.target.files || e.dataTransfer.files;

        // Cancel event and hover styling
        this.fileDragHover(e);

        // Process all File objects
        for (let i = 0, f; f = files[i]; i++) {
            const ext = f.name.split('.');
            this.addVideoForm.get('fileExt').setValue('.' + ext[ext.length - 1]);
            this.addVideoForm.get('data').setValue(f);
            this.addVideoForm.get('type').setValue(f.type);
            this.addVideoForm.get('size').setValue(f.size);
        }
        for (let i = 0, f; f = files[i]; i++) {
            this.parseFile(f);
        }
        e.target.value = '';
    }

    languageDefaultChange(index, $event) {
        (<FormArray>this.lessonForm.controls['items']).controls[index]['controls']['defaultSub'].setValue($event.target.value);
        const data = {
            lang: this.appState.locale.lang,
            defaultSub: (((<FormArray>this.lessonForm.controls['items']).controls[index]['controls']['defaultSub']) ?
                JSON.parse((<FormArray>this.lessonForm.controls['items']).controls[index]['controls']['defaultSub'].value.toString()) : 0),
            sig: this.lessonForm.get('items')['controls'][index].controls['videoSig'].value,
        };
        this.service.updateLesson(data).subscribe(res => {
        });
    }

    updateLessonSuccessNotif(elementId: string) {
        this.toastrService.clear();
        const message = 'MESSAGE.UpdateLessonSuccess';
        this.translate.get(message).subscribe(res => {
            this.toastrService.success(res);
            const elem = document.querySelector(elementId).getBoundingClientRect();
            (document.querySelector('#toast-container') as HTMLElement).style.top = elem.top + 'px';
            (document.querySelector('#toast-container') as HTMLElement).style.left = (elem.left + elem.width + 10) + 'px';
        });
    }

    scrollSmoothToBottom (e) {
        e.scrollTop = e.scrollHeight - e.clientHeight;
    }
}
