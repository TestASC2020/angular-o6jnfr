import {Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalDirective} from '../../../../../lib/ng-uikit-pro-standard/free/modals';
import {CurriculumsService} from '../../../../../services/curriculums.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';
import {AppState} from '../../../../../app-state.service';
import {AppSharedService} from '../../../../../app-shared.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
    selector: 'app-cms-creator-curriculum-proof',
    templateUrl: './curriculum-proof.component.html',
    styleUrls: ['./curriculum-proof.component.scss']
})
export class CurriculumProofComponent implements OnInit {
    staffs_list: Array<any>;
    primary_staffs_list: Array<any>;
    const_staffs_list: Array<any>;
    proofForm: FormGroup;
    selectedCoAuthor: number = 0;
    searchText: string = '';
    cv: any;
    @ViewChild('staffModal') staffModal: ModalDirective;
    @ViewChild('staffModal2') staffModal2: ModalDirective;
    @ViewChild('curriculumProofSign') curriculumProofSign: ModalDirective;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private formBuilder: FormBuilder,
                private service: CurriculumsService,
                private cookieService: CookieService,
                private appState: AppState,
                private appShare: AppSharedService,
                private domSanitizer: DomSanitizer) {
        this.primary_staffs_list = [];
        this.staffs_list = [];
        this.proofForm = new FormGroup({
            proof_signature: new FormControl(
                {
                    value: '',
                    disabled: true
                },
                [
                    Validators.required
                ]
            ),
            primary_author: new FormControl('', [Validators.required]),
            primary_author_email: new FormControl('', [Validators.required]),
            co_authors: this.formBuilder.array([])
        });
    }

    ngOnInit() {
        if (this.cookieService.get('cvInfo')) {
            this.cv = JSON.parse(this.cookieService.get('cvInfo'));
            this.service.loadCv({cvSig: this.cv.signature}).subscribe(result0 => {
                this.cv = result0['data'];
                let mainAuthor: any;
                let coAuthors: Array<any> = new Array<any>();
                if (this.cv.authors ) {
                    if (this.cv.authors.main) {
                        mainAuthor = this.cv.authors.main;
                    }
                    if (this.cv.authors.co) {
                        coAuthors = this.cv.authors.co;
                    }
                } else {
                    mainAuthor = null;
                    coAuthors = [];
                }
                this.service.loadOrgStaffList({}).subscribe(result => {
                    this.const_staffs_list = result['data'];
                    this.const_staffs_list.forEach(item => {
                        this.primary_staffs_list.push(item);
                    });
                    if (mainAuthor && mainAuthor.id) {
                        this.proofForm.get('primary_author').setValue(mainAuthor.name);
                        this.proofForm.get('primary_author_email').setValue(mainAuthor.id);
                        const index = this.const_staffs_list.map(item => item.id).indexOf(mainAuthor.id);
                        this.proofForm.get('proof_signature').setValue(this.const_staffs_list[index].signature);
                        this.updatePrimaryAuthor(this.const_staffs_list[index]);
                    } else {
                        this.proofForm.get('proof_signature').setValue('');
                    }
                    if (coAuthors.length > 0) {
                        this.addCoAuthorsList(coAuthors);
                    }
                });
            });
        }
        this.staffModal.onHide.subscribe(result => {
            this.searchText = '';
        });
        this.staffModal2.onHide.subscribe(result => {
            this.searchText = '';
        });
        this.staffModal2.onShown.subscribe(data => {
            this.updatePrimaryStaffList();
        });
    }

    updateStaffList() {
        if (this.const_staffs_list) {
            this.staffs_list = [];
            const ctrls = (<FormArray>this.proofForm.controls['co_authors']).controls;
            const temp = [];
            for (let i = 0; i < ctrls.length; i++) {
                const email = ctrls[i]['controls']['co_author_email'].value;
                temp.push(this.const_staffs_list[this.const_staffs_list.map(item => item.id).indexOf(email)]);
            }
            this.const_staffs_list.forEach(item => {
                if (temp.length < 1 || temp.map(it => it.id).indexOf(item.id) < 0) {
                    this.staffs_list.push(item);
                }
            });
            if (this.proofForm['controls']['primary_author_email']) {
                const email = this.proofForm['controls']['primary_author_email'].value;
                if (email) {
                    this.staffs_list.splice(this.staffs_list.map(item => item.id).indexOf(email), 1);
                }
            }
        }
    }

    updatePrimaryStaffList() {
        this.primary_staffs_list = [];
        this.const_staffs_list.forEach(item => {
            this.primary_staffs_list.push(item);
        });
        if (this.proofForm['controls'] && this.proofForm['controls']['primary_author_email']) {
            const primary_email = this.proofForm['controls']['primary_author_email'].value;
            if (primary_email) {
                this.primary_staffs_list.splice(this.primary_staffs_list.map(item => item.id).indexOf(primary_email), 1);
            }
        }
        const ctrls = (<FormArray>this.proofForm.controls['co_authors']).controls;
        for (let i = 0; i < ctrls.length; i++) {
            const email = ctrls[i]['controls']['co_author_email'].value;
            if (email) {
                this.primary_staffs_list.splice(this.primary_staffs_list.map(item => item.id).indexOf(email), 1);
            }
        }
    }

    addCoAuthor() {
        this.updateStaffList();
        if (this.staffs_list.length > 0) {
            this.staffModal.show();
            const ctrls = (<FormArray>this.proofForm.controls['co_authors']).controls;
            ctrls.push(this.formBuilder.group({
                co_author: new FormControl({value: '', disabled: true}, [Validators.required]),
                co_author_email: new FormControl({value: '', disabled: true}, [Validators.required]),
                onLoad: new FormControl(false)
            }));
            this.selectedCoAuthor =  0;
        }
    }

    addCoAuthorsList(coList:  Array<any>) {
        coList.forEach(co => {
            this.updateStaffList();
            if (this.staffs_list.length > 0) {
                const ctrls = (<FormArray>this.proofForm.controls['co_authors']).controls;
                ctrls.push(this.formBuilder.group({
                    co_author: new FormControl({value: co.name, disabled: true}, [Validators.required]),
                    co_author_email: new FormControl({value: co.id, disabled: true}, [Validators.required]),
                    onLoad: new FormControl(true)
                }));
            }
        });
    }

    showCoAuthor(staff) {
        this.staffModal.hide();
        const index = this.proofForm['controls']['co_authors']['controls'].length - 1;
        document.getElementById('input_' + index).setAttribute('style', 'display: block;');
        document.getElementById('span_' + index).setAttribute('style', 'display: block;');
        document.getElementById('input_' + index).parentElement.setAttribute('style', 'display: block;');
        this.selectedCoAuthor = this.staffs_list.map(item => item.id).indexOf(staff.id);
        this.proofForm['controls']['co_authors']['controls'][index].controls['co_author'].setValue(staff.name);
        this.proofForm['controls']['co_authors']['controls'][index].controls['co_author_email'].setValue(staff.id);
        this.updateCoAuthorsList();
    }

    updatePrimaryAuthor(staff) {
        this.staffModal2.hide();
        this.proofForm['controls']['primary_author'].setValue(staff.name);
        this.proofForm['controls']['primary_author_email'].setValue(staff.id);
        this.proofForm['controls']['proof_signature'].setValue(staff.signature);
        this.searchText = '';
        this.updateStaffList();
    }

    closeStaffModal() {
        this.staffModal.hide();
        const rowIndex = this.proofForm['controls']['co_authors']['controls'].length - 1;
        const control = (<FormArray>this.proofForm.controls['co_authors']);
        if (control.controls[rowIndex]['controls']['co_author']) {
            control.removeAt(rowIndex);
        }
    }

    removeCoAuthor(rowIndex) {
        const control = (<FormArray>this.proofForm.controls['co_authors']);
        if (control.controls[rowIndex]['controls']['co_author_email']) {
            const selectedItemIndex = this.const_staffs_list.map(item => item.id)
                .indexOf(control.controls[rowIndex]['controls']['co_author_email'].value);
            if (this.selectedCoAuthor === selectedItemIndex) {
                this.selectedCoAuthor = 0;
            }
            if (this.staffs_list.indexOf(this.const_staffs_list[selectedItemIndex]) < 0) {
                this.staffs_list.push(this.const_staffs_list[selectedItemIndex]);
                this.staffs_list.sort((a, b) => a.name.toLowerCase() - b.name.toLowerCase());
            }
            control.removeAt(rowIndex);
        }
    }

    updateCoAuthorsList() {
        this.staffs_list.splice(this.selectedCoAuthor, 1);
        this.staffs_list.sort((a, b) => a.name.toLowerCase() - b.name.toLowerCase());
    }

    onSubmit() {
        // do something here
    }
    save() {
        // update main author, co-author
        let mainAuthor: any;
        let coAuthorsRemove: Array<any> = new Array<any>();
        if (this.cv.authors ) {
            if (this.cv.authors.main) {
                mainAuthor = this.cv.authors.main;
            }
            if (this.cv.authors.co) {
                coAuthorsRemove = this.cv.authors.co;
            }
        } else {
            mainAuthor = null;
            coAuthorsRemove = [];
        }
        if (this.cv.authors.main && this.cv.authors.main.id) {
            this.service.removeMainAuthor({
                cvSig: this.cv.signature,
                authorId: this.cv.authors.main.id
            }).subscribe(res0 => {
                this.service.setMainAuthor({
                    cvSig: this.cv.signature,
                    id: this.proofForm.get('primary_author_email').value
                }).subscribe(res1 => {
                    const co_authors: Array<any> = new Array<any>();
                    const ctrls = (<FormArray>this.proofForm.controls['co_authors']).controls;
                    for (let i = 0; i < ctrls.length; i++) {
                        co_authors.push(ctrls[i]['controls']['co_author_email'].value);
                    }
                    if (coAuthorsRemove.length > 0) {
                        this.service.removeCoAuthors({
                            coAuthor: coAuthorsRemove.map(item => item.id),
                            cvSig: this.cv.signature
                        }).subscribe(res2 => {
                            this.service.addCoAuthors({
                                coAuthor: co_authors,
                                cvSig: this.cv.signature,
                            }).subscribe(res3 => {
                                const co_list = [];
                                co_authors.forEach(c => {
                                    const idc = this.const_staffs_list.map(iii => iii.id).indexOf(c);
                                    co_list.push({
                                        id: c,
                                        name: this.const_staffs_list[idc].name
                                    });
                                });
                                this.cv.authors.co = co_list;
                                this.cv.authors.main = this.proofForm.get('primary_author_email').value;
                                const opt = {
                                    expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate())
                                };
                                this.cookieService.put('cvInfo', JSON.stringify(this.cv), opt);
                                this.router.navigate(['cms/creator/curriculums']);
                            });
                        });
                    } else {
                        this.service.addCoAuthors({
                            coAuthor: co_authors,
                            cvSig: this.cv.signature,
                        }).subscribe(res3 => {
                            const co_list = [];
                            co_authors.forEach(c => {
                                const idc = this.const_staffs_list.map(iii => iii.id).indexOf(c);
                                co_list.push({
                                    id: c,
                                    name: this.const_staffs_list[idc].name
                                });
                            });
                            this.cv.authors.co = co_list;
                            this.cv.authors.main = this.proofForm.get('primary_author_email').value;
                            const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
                            this.cookieService.put('cvInfo', JSON.stringify(this.cv), opt);
                            this.router.navigate(['cms/creator/curriculums']);
                        });
                    }
                });
            });
        } else {
            this.service.setMainAuthor({
                cvSig: this.cv.signature,
                id: this.proofForm.get('primary_author_email').value
            }).subscribe(res1 => {
                const co_authors: Array<any> = new Array<any>();
                const ctrls = (<FormArray>this.proofForm.controls['co_authors']).controls;
                for (let i = 0; i < ctrls.length; i++) {
                    co_authors.push(ctrls[i]['controls']['co_author_email'].value);
                }
                if (coAuthorsRemove.length > 0) {
                    this.service.removeCoAuthors({
                        coAuthor: coAuthorsRemove.map(item => item.id),
                        cvSig: this.cv.signature
                    }).subscribe(res2 => {
                        this.service.addCoAuthors({
                            coAuthor: co_authors,
                            cvSig: this.cv.signature,
                        }).subscribe(res3 => {
                            const co_list = [];
                            co_authors.forEach(c => {
                                const idc = this.const_staffs_list.map(iii => iii.id).indexOf(c);
                                co_list.push({
                                    id: c,
                                    name: this.const_staffs_list[idc].name
                                });
                            });
                            this.cv.authors.co = co_list;
                            this.cv.authors.main = this.proofForm.get('primary_author_email').value;
                            const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
                            this.cookieService.put('cvInfo', JSON.stringify(this.cv), opt);
                            this.router.navigate(['cms/creator/curriculums']);
                        });
                    });
                } else {
                    this.service.addCoAuthors({
                        coAuthor: co_authors,
                        cvSig: this.cv.signature,
                    }).subscribe(res3 => {
                        const co_list = [];
                        co_authors.forEach(c => {
                            const idc = this.const_staffs_list.map(iii => iii.id).indexOf(c);
                           co_list.push({
                              id: c,
                              name: this.const_staffs_list[idc].name
                           });
                        });
                        this.cv.authors.co = co_list;
                        this.cv.authors.main = this.proofForm.get('primary_author_email').value;
                        const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
                        this.cookieService.put('cvInfo', JSON.stringify(this.cv), opt);
                        this.router.navigate(['cms/creator/curriculums']);
                    });
                }
            });
        }
    }
    backToCVList() {
        this.curriculumProofSign.hide();
        this.router.navigate(['cms/creator/curriculums']);
    }

    copyToClipBoard(item) {
        document.addEventListener('copy', (e: ClipboardEvent) => {
            e.clipboardData.setData('text/plain', (item));
            e.preventDefault();
            document.removeEventListener('copy', null);
        });
        document.execCommand('copy');
    }
}
