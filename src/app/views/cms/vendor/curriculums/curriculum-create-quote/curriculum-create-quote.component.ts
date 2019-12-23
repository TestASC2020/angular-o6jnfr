import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CurriculumsService} from '../../../../../services/curriculums.service';
import {CookieService} from 'ngx-cookie';
import {AppState} from '../../../../../app-state.service';
import {AppSharedService} from '../../../../../app-shared.service';
import {DomSanitizer} from '@angular/platform-browser';
import {ModalDirective} from '../../../../../lib/ng-uikit-pro-standard/free/modals';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-cms-vendor-curriculum-create-quote',
    templateUrl: './curriculum-create-quote.component.html',
    styleUrls: ['./curriculum-create-quote.component.scss']
})
export class CurriculumCreateQuoteComponent implements OnInit {
    cv: any;
    rqtQuote: any;
    @Input() toRouters: Array<any> = new Array<any>();
    quoteFormGroup: FormGroup;
    date_template: Array<any>;
    category_list: Array<any>;
    const_category_list: Array<any>;
    selectedCategory: number = 0;
    notify_vendors_list: Array<any>;
    const_notify_vendors_list: Array<any>;
    selectedVendor: number = 0;
    filesAttachment: Array<any> = new Array<any>();
    searchText = '';
    searchCategoryText = '';
    @ViewChild('vendorModal') vendorModal: ModalDirective;
    @ViewChild('categoryModal') categoryModal: ModalDirective;
    @ViewChild('attachments_preview') attachments_preview: ElementRef;
    @ViewChild('fileInput') fileInput: ElementRef;

    constructor(private router: Router,
                private formBuilder: FormBuilder,
                private service: CurriculumsService,
                private cookieService: CookieService,
                private datePipe: DatePipe) {
        this.date_template = [];
        this.quoteFormGroup = new FormGroup({
            description: new FormControl('', [Validators.required]),
            attachment: new FormControl('', [Validators.required]),
            wishMinPrice: new FormControl(1000, [Validators.required]),
            wishMaxPrice: new FormControl(2000, [Validators.required]),
            wishDayEndOn: new FormControl(1, [Validators.required]),
            expireOn: new FormControl('2019-02-25', [Validators.required]),
            categories: this.formBuilder.array([]),
            notify_vendors: this.formBuilder.array([]),
            invitedOnly: new FormControl(false, [Validators.required])
        });
    }

    doInit() {
        this.toRouters = [
            {
                'link': '../',
                'display': 'CREATOR.CURRICULUMS.LIST.Curriculums'
            },
            {
                'display': this.cv.name
            }
        ];
    }

    backToCVList() {
        this.router.navigate(['cms/creator/curriculums']);
    }

    ngOnInit() {
        if (this.cookieService.get('cvInfo')) {
            this.cv = JSON.parse(this.cookieService.get('cvInfo'));
            this.service.loadCvQuoteRqt({cvSig: this.cv.signature}).subscribe(quoteLoad => {
                this.rqtQuote = quoteLoad['data'];
                this.quoteFormGroup.get('wishMinPrice').setValue((this.rqtQuote['wishMinPrice']) ? this.rqtQuote['wishMinPrice'] : 1000);
                this.quoteFormGroup.get('wishMaxPrice').setValue((this.rqtQuote['wishMaxPrice']) ? this.rqtQuote['wishMaxPrice'] : 2000);
                this.quoteFormGroup.get('wishDayEndOn').setValue((this.rqtQuote['wishDayEndOn']) ? this.rqtQuote['wishDayEndOn'] : 1);
                this.quoteFormGroup.get('expireOn').setValue((this.rqtQuote['expireOn']) ?
                    this.datePipe.transform(this.rqtQuote['expireOn'], 'yyyy-MM-dd') : '2019-02-25');
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
                            if (this.rqtQuote.category.indexOf(item.name) < 0) {
                                this.category_list.push(item);
                            }
                        });
                        this.service.loadOrgVendorList({pageSz: 3524}).subscribe(response => {
                            this.doInit();
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
            });
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
                    this.filesAttachment.push(
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

    closeCategoryModal() {
        this.categoryModal.hide();
        const rowIndex = this.quoteFormGroup['controls']['categories']['controls'].length - 1;
        const control = (<FormArray>this.quoteFormGroup.controls['categories']);
        if (control.controls[rowIndex]['controls']['category']) {
            control.removeAt(rowIndex);
        }
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
        if (this.notify_vendors_list.length > 0) {
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

    closeVendorModal() {
        this.vendorModal.hide();
        const rowIndex = this.quoteFormGroup['controls']['notify_vendors']['controls'].length - 1;
        const control = (<FormArray>this.quoteFormGroup.controls['notify_vendors']);
        if (control.controls[rowIndex]['controls']['vendor']) {
            control.removeAt(rowIndex);
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
        });
    }
}
