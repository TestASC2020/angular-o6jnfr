import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalDirective} from '../../../../../lib/ng-uikit-pro-standard/free/modals';
import {NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, Router} from '@angular/router';
import {CurriculumsService} from '../../../../../services/curriculums.service';
import {DatePipe} from '@angular/common';
import {UtilsService} from '../../../../../services/utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {AppState} from '../../../../../app-state.service';
import {ToastService} from '../../../../../lib/ng-uikit-pro-standard/pro/alerts';
import {CookieService} from 'ngx-cookie';

@Component({
    selector: 'app-cms-creator-create-curriculum',
    templateUrl: './create-curriculum.component.html',
    styleUrls: ['./create-curriculum.component.scss']
})
export class CreateCurriculumComponent implements OnInit {
    cv: any;
    kind: number = 0;
    // kind = 1 : lesson
    // kind = 2 : exercise
    // kind = 3 : quiz
    lesson: any;
    exercise: any;
    quiz: any;
    stepTerminate: number = 1;
    alreadyCreateCVFromTemplate: boolean = false;
    templateFormGroup: FormGroup;
    updateInfoFormGroup: FormGroup;
    updateUnitsFormGroup: FormGroup;
    templates: Array<any>;
    selectedTemplate: any;
    newName = '';
    rqtQuote: any;
    quoteFormGroup: FormGroup;
    date_template: Array<any>;
    category_list: Array<any>;
    const_category_list: Array<any>;
    selectedCategory: number = 0;
    notify_vendors_list: Array<any>;
    const_notify_vendors_list: Array<any>;
    selectedVendor: number = 0;
    filesAttachment: Array<any> = new Array<any>();
    percentage: number = 10;
    searchText2 = '';
    searchCategoryText = '';
    types: any;
    subtitlesLanguages: Array<any> = new Array<any>();
    unitInfoForm: FormGroup;
    unitInfoEditForm: FormGroup;
    groupForm: FormGroup;
    selectedUnitIndex: number = 0;
    selectedItem: string = '';
    selectedGroupItem: any;
    deleteWhat: string = '';
    @ViewChild('vendorModal') vendorModal: ModalDirective;
    @ViewChild('confirmDeleteCV') confirmDeleteCV: ModalDirective;
    @ViewChild('categoryModal') categoryModal: ModalDirective;
    @ViewChild('attachments_preview') attachments_preview: ElementRef;
    @ViewChild('confirmSaveSettings') confirmSaveSettings: ModalDirective;
    @ViewChild('confirmCreateCVFromTemplate') confirmCreateCVFromTemplate: ModalDirective;
    @ViewChild('fileInput') fileInput: ElementRef;
    @ViewChild('curriculum_tab_step') curriculum_tab_step: NgbTabset;
    @ViewChild('curriculumUnitInfo') curriculumUnitInfo: ModalDirective;
    @ViewChild('curriculumUnitInfoEdit') curriculumUnitInfoEdit: ModalDirective;
    @ViewChild('groupItemDescription') groupItemDescription: ModalDirective;
    @ViewChild('confirmDeleteDialog') confirmDeleteDialog: ModalDirective;
    @ViewChild('confirmUpdateInfoDialog') confirmUpdateInfoDialog: ModalDirective;
    @ViewChild('individualModal') individualModal: ModalDirective;
    @ViewChild('groupCreate') groupCreate: ModalDirective;
    step: number = 1;
    // progress loading
    error: any;
    uploadResponse = { status: '', message: '', filePath: '' };
    today: string = new Date().toISOString();
    selectedSaveType: string = '';

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private service: CurriculumsService,
        private datePipe: DatePipe,
        private utilsService: UtilsService,
        private spinner: NgxSpinnerService,
        private toastervice: ToastService,
        private cookieService: CookieService,
        private appState: AppState) {
        this.templates = [];
        this.selectedTemplate = {};
        this.templateFormGroup = new FormGroup({
            template: new FormControl('', [Validators.required])
        });
        this.updateInfoFormGroup = new FormGroup({
            type: new FormControl('', [Validators.required]),
            title: new FormControl('', [Validators.required]),
            learning_objective: new FormControl('', [Validators.required]),
            goals_and_expectations: new FormControl('', [Validators.required]),
            materials: new FormControl(''),
            subtitles: this.formBuilder.group({})
        });
        this.updateUnitsFormGroup = new FormGroup({});
        this.unitInfoForm = new FormGroup({
            name: new FormControl('', [Validators.required]),
            description: new FormControl('', [Validators.required]),
            prerequisites: this.formBuilder.group({})
        });
        this.unitInfoEditForm = new FormGroup({
            name: new FormControl('', [Validators.required]),
            description: new FormControl('', [Validators.required]),
            prerequisites: this.formBuilder.group({})
        });
        this.groupForm = new FormGroup({
            name: new FormControl('', [Validators.required])
        });
    }

    ngOnInit() {
        this.service.loadCvTemplate({lang: this.appState.locale.lang}).subscribe(templatesData => {
            templatesData['data'].forEach(item => {
                this.templates.push(item);
            });
            this.selectedTemplate = this.templates[0];
            this.newName = this.selectedTemplate.name;
            this.templateFormGroup.get('template').setValue(this.templates[0].id);
        });
    }

    closeVendorModal() {
        this.vendorModal.hide();
        const rowIndex = this.quoteFormGroup['controls']['notify_vendors']['controls'].length - 1;
        const control = (<FormArray>this.quoteFormGroup.controls['notify_vendors']);
        if (control.controls[rowIndex]['controls']['vendor']) {
            control.removeAt(rowIndex);
        }
    }

    gotoTabTerminate(tabId) {
        this.stepTerminate = tabId;
    }

    showUnitsExerciseDetailFullForTerminateTab() {
        this.stepTerminate++;
    }

    showUnitsQuizDetailFullForTerminateTab() {
        this.stepTerminate++;
    }

    changeSelectedTemplate($event) {
        this.selectedTemplate = this.templates.filter(item => item.id === $event.target.value)[0];
        this.newName = this.selectedTemplate.name;
    }

    backToSelecteTemplateStep() {
        this.alreadyCreateCVFromTemplate = true;
        this.step--;
        this.percentage = 10;
    }

    get shortString() {
        return this.utilsService.shortString;
    }

    getDurationName(value: string): string {
        const temp = this.date_template.map(item => item.value.toString());
        const ind = temp.indexOf(value.toString());
        return this.date_template[ind].text;
    }

    getSelectedVendors(): Array<any> {
        const result: Array<any> = new Array<any>();
        const control = (<FormArray>this.quoteFormGroup.controls['notify_vendors']);
        for (let i = 0 ; i < control.controls.length; i++) {
            result.push(control.controls[i]['controls']['vendor'].value.toString());
        }
        return result;
    }

    gotoTab(tabId) {
        if (this.step > tabId) {
            if (this.step === (tabId + 1)) {
                if (this.step === 2) {
                    this.backToSelecteTemplateStep();
                } else if (this.step === 5) {
                    this.showStep4();
                } else {
                    this.step = tabId;
                    this. updatePercentage();
                }
            }
        } else {
            // next
            if (this.step === (tabId - 1)) {
                if (this.step === 1) {
                    this.confirmCreateCVFromTemplate.show();
                } else if (this.step === 2) {
                    this.confirmUpdateInfoDialog.show();
                } else if (this.step === 3) {
                    this.showStep4();
                } else  if (this.step === 4) {
                    this.confirmSaveSettings.show();
                } else {
                    this.step = tabId;
                    this. updatePercentage();
                }
            }
        }
    }

    updatePercentage() {
        switch (this.step) {
            case 1: this.percentage = 10; break;
            case 2: this.percentage = 30; break;
            case 3: this.percentage = 50; break;
            case 4: this.percentage = 70; break;
            default: this.percentage = 95; break;
        }
    }

    createCvFromTemplate() {
        const data = {
            CvInfo: {
                category: this.selectedTemplate.category,
                name: this.newName,
                material: this.selectedTemplate.material,
                objectives: this.selectedTemplate.objectives,
                requirements: this.selectedTemplate.requirements
            },
            CvUnitList: this.selectedTemplate.units
        };
        if (this.alreadyCreateCVFromTemplate === false) {
            this.service.addCurriculum(data).subscribe(res => {
                // this.reloadCVList();
                this.cv = res['data'];
                this.cv['name'] = this.newName;
                this.step = 2;
                this.percentage = 30;
                this.initUpdateInfoForm();
            });
        } else {
            this.service.removeCurriculum({cvSig: this.cv.signature}).subscribe(res => {
                this.alreadyCreateCVFromTemplate = false;
                this.service.addCurriculum(data).subscribe(res2 => {
                    // this.reloadCVList();
                    this.cv = res2['data'];
                    this.cv['name'] = this.newName;
                    this.step++;
                    this.percentage = 30;
                    this.initUpdateInfoForm();
                });
            });
        }
    }

    specialGotoTab(tabId) {
        if (tabId === 2) {
            this.step = 2;
            this.percentage = 30;
            this.initUpdateInfoForm();
        } else if (tabId === 4) {
            this.step = 3;
            this.showStep4();
            this.initUpdateInfoForm();
        } else if (tabId === 3) {
            this.percentage = 50;
            this.step = 3;
        }
    }

    updateCvInfo() {
        if (!this.updateInfoFormGroup.invalid) {
            // save info
            const typeId = this.updateInfoFormGroup.get('type').value;
            const type = this.types.filter(item => item.id === typeId)[0].name;
            const subtitles = this.updateInfoFormGroup.get('subtitles').value;
            const sub: Array<number> = new Array<number>();
            Object.keys(subtitles).forEach(key => {
                if (subtitles[key]) {
                    sub.push(this.subtitlesLanguages[this.subtitlesLanguages.map(item => item.text).indexOf(key)].tag);
                }
            });
            const data = {
                cvSig: this.cv.signature,
                category: type,
                name: this.updateInfoFormGroup.get('title').value,
                material: this.updateInfoFormGroup.get('materials').value,
                objectives: this.updateInfoFormGroup.get('learning_objective').value,
                requirements: this.updateInfoFormGroup.get('goals_and_expectations').value,
                subtitles: sub
            };
            this.toastervice.clear();
            this.service.updateCvInfo(data).subscribe(res => {
                this.service.loadCv({cvSig: this.cv.signature, lang: this.appState.locale.lang}).subscribe(
                    result => {
                        this.step = 3;
                        this.percentage = 50;
                        this.cv = result['data'];
                        this.confirmUpdateInfoDialog.hide();
                        this.toastervice.success(result.text);
                    },
                    err => {
                        this.toastervice.error(err.text);
                    }
                );
            });
        }
    }

    initUpdateInfoForm() {
        this.service.loadCategoryList().subscribe(res => {
            this.service.loadSubtitleLang({lang: this.appState.locale.lang}).subscribe(res2 => {
                this.types = res['data'];
                if (this.types.filter(it => it.name === this.cv.category).length > 0) {
                    this.updateInfoFormGroup.get('type').setValue(this.types.filter(it => it.name === this.cv.category)[0].id);
                } else {
                    this.updateInfoFormGroup.get('type').setValue(this.types[0].id);
                }
                this.updateInfoFormGroup.get('title').setValue(this.cv.name);
                this.updateInfoFormGroup.get('learning_objective').setValue(this.cv.objectives);
                this.updateInfoFormGroup.get('goals_and_expectations').setValue(this.cv.requirements);
                this.updateInfoFormGroup.get('materials').setValue(this.cv.material);
                this.subtitlesLanguages = res2['data'];
                this.subtitlesLanguages.forEach((option: any) => {
                    const subtitles = <FormGroup>this.updateInfoFormGroup.get('subtitles');
                    let check = false;
                    if (this.cv.subtitles && this.cv.subtitles.length > 0) {
                        check = !(this.cv.subtitles.indexOf(option.tag) < 0);
                    }
                    subtitles.addControl(option.text, new FormControl(check));
                });
            });
        });
    }

    showStep4() {
        this.initCVQuote();
    }

    showVendor(vendor) {
        this.vendorModal.hide();
        const index = this.quoteFormGroup['controls']['notify_vendors']['controls'].length - 1;
        document.getElementById('input_' + index).setAttribute('style', 'display: block;');
        document.getElementById('span_' + index).setAttribute('style', 'display: block;');
        document.getElementById('input_' + index).parentElement.setAttribute('style', 'display: block;');
        this.selectedVendor = this.notify_vendors_list.map(item => item.name).indexOf(vendor.name);
        this.quoteFormGroup['controls']['notify_vendors']['controls'][index].controls['vendor'].setValue(vendor.name);
        this.quoteFormGroup['controls']['notify_vendors']['controls'][index].controls['vendor_sig'].setValue(vendor.signature);
        this.updateNotifyVendorsList();
    }

    initCVQuote() {
        const _this = this;
        if (!this.rqtQuote) {
            _this.date_template = [];
        }
        _this.quoteFormGroup = new FormGroup({
            description: new FormControl('', [Validators.required]),
            attachment: new FormControl('', [Validators.required]),
            wishMinPrice: new FormControl('', [Validators.required]),
            wishMaxPrice: new FormControl('', [Validators.required]),
            wishDayEndOn: new FormControl(1, [Validators.required]),
            expireOn: new FormControl('', [Validators.required]),
            categories: this.formBuilder.array([]),
            notify_vendors: this.formBuilder.array([]),
            invitedOnly: new FormControl(false, [Validators.required])
        });
        _this.step = 4;
        this.percentage = 70;
        if (!this.rqtQuote) {
            this.service.addCvQuoteRqt({cvSig: this.cv.signature}).subscribe(quoteLoad => {
                this.rqtQuote = quoteLoad['data'];
                this.initFromQuote();
            });
        } else {
            this.service.loadCvQuoteRqt({cvSig: this.cv.signature}).subscribe(quoteLoad => {
                this.rqtQuote = quoteLoad['data'];
                this.initFromQuote();
            });
        }
    }

    initFromQuote() {
        this.quoteFormGroup.get('wishMinPrice').setValue((this.rqtQuote['wishMinPrice']) ? this.rqtQuote['wishMinPrice'] : 0);
        this.quoteFormGroup.get('wishMaxPrice').setValue((this.rqtQuote['wishMaxPrice']) ? this.rqtQuote['wishMaxPrice'] : 0);
        this.quoteFormGroup.get('wishDayEndOn').setValue((this.rqtQuote['wishDayEndOn']) ? this.rqtQuote['wishDayEndOn'] : 1);
        this.quoteFormGroup.get('expireOn').setValue((this.rqtQuote['expireOn']) ?
            this.datePipe.transform(this.rqtQuote['expireOn'], 'yyyy-MM-dd') : this.datePipe.transform(this.today, 'yyyy-MM-dd'));
        this.quoteFormGroup.get('description').setValue((this.rqtQuote['description']) ? this.rqtQuote['description'] : '');
        this.quoteFormGroup.get('invitedOnly').setValue((this.rqtQuote['invitedOnly'] !== undefined) ?
            this.rqtQuote['invitedOnly'] : '');
        this.service.loadWishDayEndOn({}).subscribe(wishDayList => {
            this.date_template = wishDayList['data'];
            this.service.loadCategoryList().subscribe(categoriesData => {
                this.const_category_list = categoriesData['data'];
                this.category_list = [];
                this.loadCategoryList(this.rqtQuote.category);
                this.const_category_list.forEach(item => {
                    if (this.rqtQuote.category === null || this.rqtQuote.category.indexOf(item.name) < 0) {
                        this.category_list.push(item);
                    }
                });
                this.service.loadOrgVendorList({pageSz: 3524}).subscribe(response => {
                    this.const_notify_vendors_list = response['data'];
                    this.notify_vendors_list = [];
                    this.loadVendorsList(this.rqtQuote.vendors);
                    this.const_notify_vendors_list.forEach(item => {
                        if (!this.rqtQuote.vendors || this.rqtQuote.vendors === null ||
                            (this.rqtQuote.vendors && this.rqtQuote.vendors.map(it => it.name).indexOf(item.name) < 0)) {
                            this.notify_vendors_list.push(item);
                        }
                    });
                });
            });
        });
    }

    closeCategoryModal() {
        this.categoryModal.hide();
        const rowIndex = this.quoteFormGroup['controls']['categories']['controls'].length - 1;
        const control = (<FormArray>this.quoteFormGroup.controls['categories']);
        if (control.controls[rowIndex]['controls']['category']) {
            control.removeAt(rowIndex);
        }
    }

    loadRqtQuoteFiles(files: Array<any>) {
        if (this.attachments_preview) {
            const _this = this;
            if (files && files.length > 0) {
                let counter = 0;
                this.filesAttachment = [];
                files.forEach(file => {
                    const index = files.indexOf(file);
                    _this.filesAttachment.push(
                        {
                            data: file.url,
                            filename: '',
                            fileSig: file.signature,
                            index: index
                        });
                    const fileElement = document.createElement('div');
                    fileElement.setAttribute('style', 'margin-right: 10px; text-align: center; position: relative; left: 15px;');
                    const imgElement = document.createElement('img');
                    imgElement.setAttribute('id', index.toString());
                    imgElement.setAttribute('src', file.url);
                    imgElement.setAttribute('width', '41');
                    imgElement.setAttribute('height', '41');
                    const removeElement = document.createElement('span');
                    const removeImgElement = document.createElement('i');
                    removeElement.setAttribute('style', 'position: absolute; top: -5px; right: -2px;');
                    removeImgElement.setAttribute('class', 'fas fa-times-circle text-danger');
                    removeImgElement.addEventListener('click', function () {
                        _this.removeImage(Number.parseInt(imgElement.getAttribute('id'), 10));
                    }, false);
                    removeElement.appendChild(removeImgElement);
                    fileElement.appendChild(imgElement);
                    fileElement.appendChild(removeElement);
                    this.attachments_preview.nativeElement.appendChild(fileElement);
                    counter++;
                    if (counter === files.length) {
                        this.fileInput.nativeElement.value = '';
                        this.quoteFormGroup.get('attachment').setValue(this.filesAttachment.map(item => item.data).join(';'));
                    }
                });
            }
        }
    }

    loadCategoryList(categories: Array<any>) {
        const ctrls = (<FormArray>this.quoteFormGroup.controls['categories']).controls;
        if (categories) {
            categories.forEach(category => {
                ctrls.push(this.formBuilder.group({
                    category: new FormControl({value: category, disabled: true}, [Validators.required]),
                    onLoad: new FormControl({value: true, disabled: true})
                }));
            });
        }
    }

    addCategory() {
        if (this.category_list.length > 0) {
            this.categoryModal.show();
            const ctrls = (<FormArray>this.quoteFormGroup.controls['categories']).controls;
            ctrls.push(this.formBuilder.group({
                category: new FormControl({value: '', disabled: true}, [Validators.required]),
                onLoad: new FormControl({value: false, disabled: true})
            }));
            this.selectedCategory =  0;
        }
    }

    removeCategory(rowIndex) {
        const control = (<FormArray>this.quoteFormGroup.controls['categories']);
        if (control.controls[rowIndex]['controls']['category']) {
            const selectedItemIndex = this.const_category_list.map(it => it.name).
            indexOf(control.controls[rowIndex]['controls']['category'].value.toString());
            if (this.selectedCategory === selectedItemIndex) {
                this.selectedCategory = 0;
            }
            if (this.category_list.map(it => it.name).indexOf(this.const_category_list[selectedItemIndex].name) < 0) {
                this.category_list.push(this.const_category_list[selectedItemIndex]);
            }
            const data = {
                category: control.controls[rowIndex]['controls']['category'].value,
                cvRqtSig: this.rqtQuote.signature
            };
            this.service.removeCvRqtCategory(data).subscribe(response => {
                control.removeAt(rowIndex);
            });
        }
    }

    showCategory(category) {
        this.categoryModal.hide();
        const index = this.quoteFormGroup['controls']['categories']['controls'].length - 1;
        document.getElementById('category_input_' + index).setAttribute('style', 'display: block;');
        document.getElementById('span_category_' + index).setAttribute('style', 'display: block;');
        document.getElementById('category_input_' + index).parentElement.setAttribute('style', 'display: block;');
        this.selectedCategory = this.category_list.map(it => it.name).indexOf(category.name);
        this.quoteFormGroup['controls']['categories']['controls'][index].controls['category'].setValue(category.name);
        this.updateCategoriesList();
    }

    updateCategoriesList() {
        const _this = this;
        const data = {
            category: this.category_list[this.selectedCategory].name,
            cvRqtSig: this.rqtQuote.signature
        };
        this.service.addCvRqtCategory(data).subscribe(response => {
            _this.category_list.splice(this.selectedCategory, 1);
        });
    }

    loadVendorsList(vendors: Array<any>) {
        const ctrls = (<FormArray>this.quoteFormGroup.controls['notify_vendors']).controls;
        if (vendors) {
            vendors.forEach(vendor => {
                ctrls.push(this.formBuilder.group({
                    vendor: new FormControl({value: vendor.name, disabled: true}, [Validators.required]),
                    vendor_sig: new FormControl({value: vendor.signature, disabled: true}, [Validators.required]),
                    onLoad: new FormControl({value: true, disabled: true})
                }));
            });
        }
        this.loadRqtQuoteFiles(this.rqtQuote.files);
    }

    addNotifyVendor() {
        if (this.notify_vendors_list && this.notify_vendors_list.length > 0) {
            this.vendorModal.show();
            const ctrls = (<FormArray>this.quoteFormGroup.controls['notify_vendors']).controls;
            ctrls.push(this.formBuilder.group({
                vendor: new FormControl({value: '', disabled: true}, [Validators.required]),
                vendor_sig: new FormControl({value: '', disabled: true}, [Validators.required]),
                onLoad: new FormControl({value: false, disabled: true})
            }));
            this.selectedVendor =  0;
        }
    }

    removeNotifyVendor(rowIndex) {
        const control = (<FormArray>this.quoteFormGroup.controls['notify_vendors']);
        if (control.controls[rowIndex]['controls']['vendor_sig']) {
            const selectedItemIndex = this.const_notify_vendors_list.map(item => item.name)
                .indexOf(control.controls[rowIndex]['controls']['vendor'].value.toString());
            if (this.selectedVendor === selectedItemIndex) {
                this.selectedVendor = 0;
            }
            if (this.notify_vendors_list.map(i => i.name).indexOf(this.const_notify_vendors_list[selectedItemIndex].name) < 0) {
                this.notify_vendors_list.push(this.const_notify_vendors_list[selectedItemIndex]);
            }
            const data = {
                vendorAuthSig: this.const_notify_vendors_list[selectedItemIndex].signature,
                quoteSig: this.rqtQuote.signature
            };
            this.service.removeVendor(data).subscribe(response => {
                control.removeAt(rowIndex);
            });
        }
    }

    updateNotifyVendorsList() {
        const _this = this;
        const data = {
            orgSig: this.notify_vendors_list[this.selectedVendor].signature,
            quoteSig: this.rqtQuote.signature
        };
        this.service.addVendor(data).subscribe(response => {
            _this.notify_vendors_list.splice(this.selectedVendor, 1);
        });
    }

    previewFile($event) {
        const files = $event.target.files;
        if (files && files.length > 0) {
            let counter = 0;
            const _this = this;
            Object.keys(files).forEach( key => {
                const file = files[key];
                const reader: FileReader = new FileReader();
                reader.onloadend = function(e) {
                    if (e.target && e.target['result']) {
                        const ext = file.name.split('.');
                        const data = {
                            data: e.target['result'].toString().split(',')[1],
                            fileExt: '.' + ext[ext.length - 1],
                            quoteSig: _this.rqtQuote.signature
                        };
                        _this.service.addCvRqtQuoteFile(data).subscribe(rs => {
                            const index = _this.filesAttachment.length;
                            _this.filesAttachment.push({
                                data: e.target['result'],
                                filename: file.name,
                                fileSig: rs['data'].signature,
                                index: index
                            });
                            const fileElement = document.createElement('div');
                            fileElement.setAttribute('style', 'margin-right: 10px; text-align: center; position: relative; left: 15px;');
                            const imgElement = document.createElement('img');
                            imgElement.setAttribute('id', index.toString());
                            imgElement.setAttribute('src', e.target['result']);
                            imgElement.setAttribute('width', '41');
                            imgElement.setAttribute('height', '41');
                            const removeElement = document.createElement('span');
                            const  removeImgElement = document.createElement('i');
                            removeElement.setAttribute('style', 'position: absolute; top: -5px; right: -2px;');
                            removeImgElement.setAttribute('class', 'fas fa-times-circle text-danger');
                            removeImgElement.addEventListener('click', function() {
                                _this.removeImage( Number.parseInt(imgElement.getAttribute('id'), 10));
                            }, false);
                            removeElement.appendChild(removeImgElement);
                            fileElement.appendChild(imgElement);
                            fileElement.appendChild(removeElement);
                            _this.attachments_preview.nativeElement.appendChild(fileElement);
                            counter++;
                            if (counter === files.length) {
                                _this.fileInput.nativeElement.value = '';
                                _this.quoteFormGroup.get('attachment').setValue(_this.filesAttachment.map(item => item.data).join(';'));
                            }
                        });
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    }

    removeImage(index: number) {
        const data = {
            fileSig: this.filesAttachment[index].fileSig,
            quoteSig: this.rqtQuote.signature
        };
        this.service.removeCvRqtQuoteFile(data).subscribe(res => {
            this.attachments_preview.nativeElement.children[index].remove();
            if (index < this.filesAttachment.length - 1) {
                // update all images behind this image set image id - 1
                const divCollection = this.attachments_preview.nativeElement.children;
                if (divCollection) {
                    for (let i = index; i < Object.keys(divCollection).length; i++) {
                        const newId = Number.parseInt(divCollection[i].children[0].getAttribute('id'), 10) - 1;
                        divCollection[i].children[0].setAttribute('id', newId.toString());
                    }
                }
            }
            this.filesAttachment.splice(this.filesAttachment.map(item => item.index).indexOf(index), 1);
            this.filesAttachment.filter( item => item.index > index).forEach(item => {
                item.index--;
            });
            this.quoteFormGroup.get('attachment').setValue(this.filesAttachment.map(item => item.data).join(';'));
        });
    }

    openFile() {
        this.fileInput.nativeElement.click();
    }

    updateCvRqtQuote() {
        const description = this.quoteFormGroup.get('description').value;
        const wishMinPrice = JSON.parse(this.quoteFormGroup.get('wishMinPrice').value.toString());
        const wishMaxPrice = JSON.parse(this.quoteFormGroup.get('wishMaxPrice').value.toString());
        const wishDayEndOn = JSON.parse(this.quoteFormGroup.get('wishDayEndOn').value.toString());
        const expireOn = this.quoteFormGroup.get('expireOn').value;
        const invitedOnly = JSON.parse(this.quoteFormGroup.get('invitedOnly').value.toString());
        const data = {
            description: description,
            wishMinPrice: wishMinPrice,
            wishMaxPrice: wishMaxPrice,
            wishDayEndOn: wishDayEndOn,
            expireOn: expireOn,
            invitedOnly: invitedOnly,
            cvRqtSig: this.rqtQuote.signature
        };
        this.service.updateCvQuoteRqt(data).subscribe(resp => {
            this.step = 5;
            this.percentage = 95;
        });
    }

    get getCreateDateInfo() {
        return this.utilsService.getCreateDateInfo;
    }

    editLesson(index, lesson) {
        const sendLesson = {
            signature: lesson.signature,
            name: lesson.name,
            unitSig: this.cv.units[index]['signature'],
            unitName: this.cv.units[index]['name']
        };
        const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
        this.cookieService.put('lessonInfo', JSON.stringify(sendLesson), opt);
        this.kind = 1;
        this.lesson = lesson;
        this.stepTerminate = 1;
        this.individualModal.show();
    }

    editExercise(index, exercise) {
        const sendExercise = {
            signature: exercise.signature,
            name: exercise.name,
            unitSig: this.cv.units[index]['signature'],
            unitName: this.cv.units[index]['name']
        };
        const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
        this.cookieService.put('exerciseInfo', JSON.stringify(sendExercise), opt);
        // open modal editExercise here
        this.kind = 2;
        this.exercise = exercise;
        this.stepTerminate = 1;
        this.individualModal.show();
    }

    editQuestion(index, question) {
        const sendQuestion = {
            signature: question.signature,
            name: question.name,
            unitSig: this.cv.units[index]['signature'],
            unitName: this.cv.units[index]['name']
        };
        const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
        this.cookieService.put('questionInfo', JSON.stringify(sendQuestion), opt);
        // open modal editQuestion here
        this.kind = 3;
        this.quiz = question;
        this.stepTerminate = 1;
        this.individualModal.show();
    }

    removeLesson(index, lesson) {
        this.deleteWhat = 'Lesson';
        this.selectedUnitIndex = index;
        this.selectedItem = lesson;
        this.confirmDeleteDialog.show();
    }

    removeSelectedLesson() {
        const index = this.selectedUnitIndex;
        const lesson = this.selectedItem;
        const data = {
            grpSig: lesson['signature'],
            grpType: 1
        };
        this.service.removeUnitGroup(data).subscribe(res => {
            const lessIndx = this.cv.units[index]['lessonGroup'].indexOf(lesson);
            (this.cv.units[index]['lessonGroup'] as Array<any>).splice(lessIndx, 1);
            this.confirmDeleteDialog.hide();
        });
    }

    removeExercise(index, exercise) {
        this.deleteWhat = 'Exercise';
        this.selectedUnitIndex = index;
        this.selectedItem = exercise;
        this.confirmDeleteDialog.show();
    }

    removeSelectedExercise() {
        const index = this.selectedUnitIndex;
        const exercise = this.selectedItem;
        const data = {
            grpSig: exercise['signature'],
            grpType: 2
        };
        this.service.removeUnitGroup(data).subscribe(res => {
            const exerIndx = this.cv.units[index]['exerciseGroup'].indexOf(exercise);
            (this.cv.units[index]['exerciseGroup'] as Array<any>).splice(exerIndx, 1);
            this.confirmDeleteDialog.hide();
        });
    }

    removeQuiz(index, quiz) {
        this.deleteWhat = 'Question';
        this.selectedUnitIndex = index;
        this.selectedItem = quiz;
        this.confirmDeleteDialog.show();
    }

    removeSelectedQuiz() {
        const index = this.selectedUnitIndex;
        const quiz = this.selectedItem;
        const data = {
            grpSig: quiz['signature'],
            grpType: 3
        };
        this.service.removeUnitGroup(data).subscribe(res => {
            const quizIndx = this.cv.units[index]['quizGroup'].indexOf(quiz);
            (this.cv.units[index]['quizGroup'] as Array<any>).splice(quizIndx, 1);
            this.confirmDeleteDialog.hide();
        });
    }

    removeUnit(unit) {
        this.selectedItem = unit;
        this.deleteWhat = 'Unit';
        this.confirmDeleteDialog.show();
    }

    removeSelectedItem() {
        if (this.deleteWhat === 'Unit') {
            this.removeSelectedUnit();
        } else if (this.deleteWhat === 'Lesson') {
            this.removeSelectedLesson();
        } else if (this.deleteWhat === 'Exercise') {
            this.removeSelectedExercise();
        } else if (this.deleteWhat === 'Question') {
            this.removeSelectedQuiz();
        }
    }

    removeSelectedUnit() {
        const unit = this.selectedItem;
        this.service.removeCvUnit({lang: this.appState.locale.lang, unitSig: unit['signature']}).subscribe(
            res => {
                (this.cv.units as Array<any>).splice(this.cv.units.indexOf(unit), 1);
                this.confirmDeleteDialog.hide();
                this.deleteWhat = '';
            }
        );
    }

    openGroupModal(index, item, type) {
        this.selectedGroupItem = {
            index: index,
            item: item,
            type: type
        };
        this.groupForm.get('name').setValue(item.name);
        this.groupItemDescription.show();
    }

    updateGroupItemName() {
        const data = {
            name: this.groupForm.get('name').value,
            id: this.selectedGroupItem.item.id,
            lang: this.appState.locale.lang,
            grpSig: this.selectedGroupItem.item.signature
        };
        switch (this.selectedGroupItem.type) {
            case 'Lesson': {
                this.service.updateCvLessonGroup(data).subscribe(resLesson => {
                    const idx = this.cv.units[this.selectedGroupItem.index]['lessonGroup']
                        .map(it => it.signature).indexOf(this.selectedGroupItem.item.signature);
                    this.cv.units[this.selectedGroupItem.index]['lessonGroup'][idx].name = data.name;
                });
                break;
            }
            case 'Exercise': {
                this.service.updateCvExerciseGroup(data).subscribe(resExer => {
                    const idx = this.cv.units[this.selectedGroupItem.index]['exerciseGroup']
                        .map(it => it.signature).indexOf(this.selectedGroupItem.item.signature);
                    this.cv.units[this.selectedGroupItem.index]['exerciseGroup'][idx].name = data.name;
                });
                break;
            }
            case 'Quiz': {
                this.service.updateCvQuizGroup(data).subscribe(resQuiz => {
                    const idx = this.cv.units[this.selectedGroupItem.index]['quizGroup']
                        .map(it => it.signature).indexOf(this.selectedGroupItem.item.signature);
                    this.cv.units[this.selectedGroupItem.index]['quizGroup'][idx].name = data.name;
                });
                break;
            }
        }
        this.groupItemDescription.hide();
    }

    openCreateArea(index) {
        this.selectedUnitIndex = index;
        this.groupCreate.show();
    }

    addType(index) {
        const gName = (document.getElementById('name_' + index) as HTMLInputElement).value;
        const gType = (document.getElementById('type_' + index) as HTMLSelectElement).value;
        const data = {
            name: gName,
            unitSig: this.cv.units[index]['signature']
        };
        switch (gType) {
            case 'Lesson': {
                data['no'] = (this.cv.units[index]['lessonGroup'] && this.cv.units[index]['lessonGroup'].length > 0) ?
                    (this.cv.units[index]['lessonGroup'].length + 1) : 1;
                this.service.addCvLessonGroup(data).subscribe(resLesson => {
                    (document.getElementById('name_' + index) as HTMLInputElement).setAttribute('value', '');
                    if (!this.cv.units[index]['lessonGroup']) {
                        this.cv.units[index]['lessonGroup'] = [];
                    }
                    this.cv.units[index]['lessonGroup'].push(resLesson['data']);
                    this.groupCreate.hide();
                });
                break;
            }
            case 'Exercise': {
                data['no'] = (this.cv.units[index]['exerciseGroup'] && this.cv.units[index]['exerciseGroup'].length > 0) ?
                    (this.cv.units[index]['exerciseGroup'].length + 1) : 1;
                this.service.addCvExerciseGroup(data).subscribe(resExercise => {
                    (document.getElementById('name_' + index) as HTMLInputElement).setAttribute('value', '');
                    if (!this.cv.units[index]['exerciseGroup']) {
                        this.cv.units[index]['exerciseGroup'] = [];
                    }
                    this.cv.units[index]['exerciseGroup'].push(resExercise['data']);
                    this.groupCreate.hide();
                });
                break;
            }
            case 'Quiz': {
                data['no'] = (this.cv.units[index]['quizGroup'] && this.cv.units[index]['quizGroup'].length > 0) ?
                    (this.cv.units[index]['quizGroup'].length + 1) : 1;
                this.service.addCvQuizGroup(data).subscribe(resQuiz => {
                    (document.getElementById('name_' + index) as HTMLInputElement).setAttribute('value', '');
                    if (!this.cv.units[index]['quizGroup']) {
                        this.cv.units[index]['quizGroup'] = [];
                    }
                    this.cv.units[index]['quizGroup'].push(resQuiz['data']);
                    this.groupCreate.hide();
                });
                break;
            }
        }
    }

    createUnit() {
        const prerequisites = this.unitInfoForm.get('prerequisites').value;
        const prerequisitesArr: Array<number> = new Array<number>();
        Object.keys(prerequisites).forEach(key => {
            if (prerequisites[key]) {
                prerequisitesArr.push(Number.parseInt(key, 10));
            }
        });
        const data = {
            cvSig: this.cv.signature,
            description: this.unitInfoForm.get('description').value,
            lang: this.appState.locale.lang,
            name: this.unitInfoForm.get('name').value,
            prerequisites: prerequisitesArr,
            no: this.cv.units.length + 1
        };
        this.service.addCvUnit(data).subscribe(res => {
            this.cv.units.push(res['data']);
            this.unitInfoForm = new FormGroup({
                name: new FormControl('', [Validators.required]),
                description: new FormControl('', [Validators.required]),
                prerequisites: this.formBuilder.group({})
            });
        });
    }

    updateUnit() {
        const prerequisites = this.unitInfoEditForm.get('prerequisites').value;
        const prerequisitesArr: Array<number> = new Array<number>();
        Object.keys(prerequisites).forEach(key => {
            if (prerequisites[key]) {
                prerequisitesArr.push(Number.parseInt(key, 10));
            }
        });
        const data = {
            cvSig: this.cv.signature,
            description: this.unitInfoEditForm.get('description').value,
            lang: this.appState.locale.lang,
            name: this.unitInfoEditForm.get('name').value,
            prerequisites: prerequisitesArr,
            unitSig: this.selectedItem['signature']
        };
        this.toastervice.clear();
        this.service.updateCvUnit(data).subscribe(
            res => {
                const index = this.cv.units.map(it => it.signature).indexOf(this.selectedItem['signature']);
                this.cv.units[index]['name'] = data.name;
                this.cv.units[index]['description'] = data.description;
                this.cv.units[index]['prerequisites'] = data.prerequisites;
                this.unitInfoEditForm = new FormGroup({
                    name: new FormControl('', [Validators.required]),
                    description: new FormControl('', [Validators.required]),
                    prerequisites: this.formBuilder.group({})
                });
                this.toastervice.success(res.text);
            },
            err => {
                this.toastervice.error(err.text);
            }
        );
    }

    openUnitInfoEditModal(unit) {
        this.unitInfoEditForm = new FormGroup({
            name: new FormControl('', [Validators.required]),
            description: new FormControl('', [Validators.required]),
            prerequisites: this.formBuilder.group({})
        });
        this.selectedItem = unit;
        const unitIndex = this.cv.units.map(u => u.signature).indexOf(unit.signature);
        for (let i = 0; i < unitIndex; i++) {
            const prerequisites = <FormGroup>this.unitInfoEditForm.get('prerequisites');
            let check = false;
            if (unit.prerequisites.length > 0) {
                check = !(unit.prerequisites.indexOf(i + 1) < 0);
                prerequisites.addControl((i + 1).toString(), new FormControl(check));
            } else {
                prerequisites.addControl((i + 1).toString(), new FormControl(false));
            }
        }
        this.unitInfoEditForm.get('name').setValue(unit.name);
        this.unitInfoEditForm.get('description').setValue(unit.description);
        this.curriculumUnitInfoEdit.show();
    }

    checkPrerequisites(form) {
        return Object.keys(form.get('prerequisites')['controls']).length > 0;
    }

    checkEmpty(obj) {
        if (!obj || Object.entries(obj).length === 0) {
            return true;
        }
        return false;
    }

    openUnitInfoModal() {
        this.unitInfoForm = new FormGroup({
            name: new FormControl('', [Validators.required]),
            description: new FormControl('', [Validators.required]),
            prerequisites: this.formBuilder.group({})
        });
        for (let i = 0; i < this.cv.units.length; i++) {
            const prerequisites = <FormGroup>this.unitInfoForm.get('prerequisites');
            let check = false;
            if (this.cv.units.prerequisites && this.cv.units.prerequisites.length > 0) {
                check = !(this.cv.units.prerequisites.indexOf(i + 1) < 0);
                prerequisites.addControl((i + 1).toString(), new FormControl(check));
            } else {
                prerequisites.addControl((i + 1).toString(), new FormControl(false));
            }
        }
        this.curriculumUnitInfo.show();
    }

    getUnitNameFromPrerequisitesKey(key: any) {
        if (this.cv && this.cv.units.length > 0) {
            const index = this.cv.units.map(item => item.no.toString()).indexOf(key.toString());
            return this.cv.units[index]['name'];
        }
        return '';
    }

    gotoCVList() {
        this.router.navigate(['/cms/creator/curriculums']);
    }

    saveStatus() {
        if (this.selectedSaveType === '') {
            return;
        }
        this.toastervice.clear();
        const item = this.cv;
        this.service.updateCvStatus({cvSig: item.signature, status: (this.selectedSaveType === 'complete') ? 5 : 2}).subscribe(
            res => {
                this.toastervice.success(res.text);
                this.router.navigate(['/cms/creator/curriculums']);
            },
            err => {
                this.toastervice.error(err.text);
            }
        );
    }
}
