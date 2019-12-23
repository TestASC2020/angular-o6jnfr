import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PagerService} from '../../../../services/pager.service';
import {CoursesService} from '../../../../services/courses.service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AppState} from '../../../../app-state.service';
import {PreloaderService} from '../../../../shared/pre-loader/service/pre-loader.service';
import {CookieService} from 'ngx-cookie';
import {ModalDirective} from '../../../../lib/ng-uikit-pro-standard/free/modals';
import {DatePipe} from '@angular/common';

@Component({
    selector: 'app-courses-course-edit',
    templateUrl: './course-edit.component.html',
    styleUrls: ['./course-edit.component.scss']
})
export class CourseEditComponent implements OnInit, AfterViewInit {
    @ViewChild('avatar') avatar: ElementRef;
    @ViewChild('fileInput') fileInput: ElementRef;
    @ViewChild('cvListModal') cvListModal: ModalDirective;
    @ViewChild('tutorsListModal') tutorsListModal: ModalDirective;
    @ViewChild('adminListModal') adminListModal: ModalDirective;
    @ViewChild('createNewCourseModal') createNewCourseModal: ModalDirective;
    @ViewChild('errorModal') errorModal: ModalDirective;
    error: any;
    selectedTutor: number = 0;
    selectedAdmin: number = 0;
    categoryList: Array<any> = new Array<any>();
    pageSz: number = 10;
    // For Curriculums list
    cvList: Array<any> = new Array<any>();
    selectedCv: any;
    currentPageCv: number = 1;
    enableMoreCv: boolean = true;
    searchTextCv: string = '';
    // For Tutors list
    tutorsList: Array<any> = new Array<any>();
    const_tutorsList: Array<any> = new Array<any>();
    enableMoreTutors: boolean = true;
    searchTextTutors: string = '';
    currentPageTutors: number = 1;
    // For Admin list
    adminList: Array<any> = new Array<any>();
    const_adminList: Array<any> = new Array<any>();
    enableMoreAdmin: boolean = true;
    searchTextAdmin: string = '';
    currentPageAdmin: number = 1;
    formcourse: FormGroup;
    newCourseForm: FormGroup;
    tutorsForm: FormGroup;
    adminForm: FormGroup;
    submitted: boolean = false;
    courseInfo: any;
    avatarURL: string = '../../../../assets/img/user-avatar.png';
    toRouters: Array<any> = new Array<any>();
    newMode: boolean = true;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private service: CoursesService,
        private pagerService: PagerService,
        private appState: AppState,
        private preloaderService: PreloaderService,
        private cookieService: CookieService,
        private datePipe: DatePipe,
        private formBuilder: FormBuilder) {
        if (this.cookieService.get('courseInfo')) {
            this.newMode = false;
        }
        this.createForm();
    }

    newCourse() {
        const dataSend = {
            name: this.newCourseForm.get('name').value
        };
        this.service.addCourse(dataSend).subscribe(
            data0 => {
                this.courseInfo = data0['data'];
                this.initCourseFirstTime();
                this.createNewCourseModal.hide();
            },
            err => {
                this.error = err;
                this.errorModal.show();
            }
        );
    }

    cancel() {
        this.router.navigate(['courses/course-list']);
    }

    initCourseFirstTime() {
        const _this = this;
        this.newMode = false;
        this.service.loadCvInfoList({pageSz: _this.pageSz, pageNo: _this.currentPageCv}).subscribe(
            data1 => {
                const temp = (data1['data'] && data1['data'].length > 0) ? data1['data'] : [];
                if (temp.length === 0) {
                    this.enableMoreCv = false;
                    this.currentPageCv = -1;
                } else {
                    temp.forEach(te => {
                        this.cvList.push(te);
                    });
                }
                if (_this.courseInfo.cvId) {
                    _this.selectedCv = _this.cvList.filter(cv => cv.id === _this.courseInfo.cvId)[0];
                } else {
                    _this.selectedCv = _this.cvList[0];
                }
                _this.formcourse.get('name').setValue(_this.courseInfo.name);
                _this.formcourse.get('category').setValue(_this.courseInfo.category);
                _this.formcourse.get('listPrice').setValue(_this.courseInfo.listPrice);
                _this.formcourse.get('maxDayToUse').setValue(_this.courseInfo.maxDayToUse);
                _this.formcourse.get('minUseAmt').setValue(_this.courseInfo.minUseAmt);
                _this.formcourse.get('openDate')
                    .setValue(_this.courseInfo.openDate ? this.datePipe.transform(_this.courseInfo.openDate, 'yyyy-MM-dd') : '');
                _this.formcourse.get('closeDate')
                    .setValue(_this.courseInfo.closeDate ? this.datePipe.transform(_this.courseInfo.closeDate, 'yyyy-MM-dd') : '');
                _this.avatarURL = (_this.courseInfo.logoURL) ? _this.courseInfo.logoURL : '../../../../assets/img/user-avatar.png';
                _this.formcourse.get('cvId').setValue((_this.selectedCv) ? _this.selectedCv.id : '');
                _this.service.loadCrsCategory({}).subscribe(
                    data2 => {
                        _this.categoryList = data2['data'];
                        _this.service.loadOrgStaffList({
                            type: 1,
                            pageSz: _this.pageSz,
                            pageNo: _this.currentPageTutors
                        }).subscribe(
                            data3 => {
                                const temp3 = (data3['data'] && data3['data'].length > 0) ? data3['data'] : [];
                                if (temp3.length === 0) {
                                    _this.enableMoreTutors = false;
                                    _this.currentPageTutors = -1;
                                } else {
                                    temp3.forEach(te => {
                                        _this.const_tutorsList.push(te);
                                    });
                                    _this.tutorsList = [];
                                    _this.const_tutorsList.forEach(ad => {
                                        _this.tutorsList.push(ad);
                                    });
                                }
                                _this.service.loadOrgStaffList({
                                    type: 2,
                                    pageSz: _this.pageSz,
                                    pageNo: _this.currentPageAdmin
                                }).subscribe(
                                    data4 => {
                                        const temp4 = (data4['data'] && data4['data'].length > 0) ? data4['data'] : [];
                                        if (temp4.length === 0) {
                                            _this.enableMoreAdmin = false;
                                            _this.currentPageAdmin = -1;
                                        } else {
                                            temp4.forEach(te => {
                                                _this.const_adminList.push(te);
                                            });
                                            _this.adminList = [];
                                            _this.const_adminList.forEach(ad => {
                                                _this.adminList.push(ad);
                                            });
                                        }
                                        _this.initStaffsData();
                                    },
                                    err => {
                                        this.error = {
                                            text: 'Load Administrative Staffs List error: ' + err.text
                                        };
                                        this.errorModal.show();
                                    }
                                );
                            },
                            err => {
                                this.error = {
                                    text: 'Load Tutors List error: ' + err.text
                                };
                                this.errorModal.show();
                            }
                        );
                    },
                    err => {
                        this.error = {
                            text: 'Load Course Categories List error: ' + err.text
                        };
                        this.errorModal.show();
                    }
                );
            },
            err => {
                this.error = {
                    text: 'Load Curriculums List error: ' + err.text
                };
                this.errorModal.show();
            }
        );
    }

    ngOnInit() {
        const _this = this;
        if (this.cookieService.get('routLinks')) {
            this.toRouters = JSON.parse(this.cookieService.get('routLinks'));
        } else {
            this.toRouters = [
                {
                    'link': '../',
                    'display': 'Courses.Course'
                },
                {
                    'display': 'Courses.NewCourse'
                }
            ];
        }
        if (this.cookieService.get('courseInfo')) {
            this.courseInfo = JSON.parse(this.cookieService.get('courseInfo'));
            const data = {
                crsSig: this.courseInfo.crsSig
            };
            this.service.loadCrsInfo(data).subscribe(resp => {
                this.courseInfo = resp['data'];
                _this.initCourseFirstTime();
            });
        }
    }

    ngAfterViewInit() {
        if (this.newMode) {
            this.createNewCourseModal.show();
        }
    }

    createForm() {
        this.newCourseForm = new FormGroup({
            name: new FormControl('')
        });
        this.formcourse = new FormGroup({
            name: new FormControl(''),
            category: new FormControl(''),
            data: new FormControl(''),
            fileExt: new FormControl(''),
            cvId: new FormControl(''),
            openDate: new FormControl(''),
            closeDate: new FormControl(''),
            maxDayToUse: new FormControl(''),
            listPrice: new FormControl(''),
            minUseAmt: new FormControl('')
        });
        this.tutorsForm = new FormGroup({
            staffs: this.formBuilder.array([]),
        });
        this.adminForm = new FormGroup({
            staffs: this.formBuilder.array([]),
        });
    }

    onSubmit() {

    }
    saveCourse() {
        this.submitted = true;
        if (this.formcourse.valid) {
            this.preloaderService.enableLoading();
            const data = {
                name: this.formcourse.get('name').value,
                category: this.formcourse.get('category').value,
                cvId: this.formcourse.get('cvId').value,
                openDate: (this.formcourse.get('openDate').value) ? new Date(this.formcourse.get('openDate').value) : null,
                closeDate: (this.formcourse.get('closeDate').value) ? new Date(this.formcourse.get('closeDate').value) : null,
                maxDayToUse: (this.formcourse.get('maxDayToUse').value) ?
                    JSON.parse(this.formcourse.get('maxDayToUse').value.toString()) : 0,
                listPrice: (this.formcourse.get('listPrice').value) ? JSON.parse(this.formcourse.get('listPrice').value.toString()) : 0,
                minUseAmt: (this.formcourse.get('minUseAmt').value) ? JSON.parse(this.formcourse.get('minUseAmt').value.toString()) : 0,
                crsSig: this.courseInfo.signature
            };
            this.service.updateCourse(data).subscribe(
                result => {
                    this.preloaderService.disableLoading();
                    this.router.navigate(['courses/course-list']);
                },
                err => {
                    this.preloaderService.disableLoading();
                    this.error = {
                        text: 'Update course error: ' + err.text
                    };
                    this.errorModal.show();
                }
            );
        }
    }

    cancelCourse() {
        this.router.navigate(['courses/course-list']);
    }

    openFileDialog() {
        this.fileInput.nativeElement.click();
    }

    previewFile($event) {
        const file: File = $event.target.files[0];
        const temp = this;
        if (file) {
            const reader = new FileReader();
            reader.onloadend = function(e) {
                if (reader.result) {
                    const ext = file.name.split('.');
                    const url = e.target['result'];
                    const data = {
                        crsSig: temp.courseInfo.signature,
                        data: url.split(',')[1],
                        fileExt: '.' + ext[ext.length - 1]
                    };
                    temp.service.updateCrsLogo(data).subscribe(
                        res => {
                            temp.courseInfo.logoURL = res['data'];
                            const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
                            temp.cookieService.put('courseInfo', JSON.stringify(temp.courseInfo), opt);
                            temp.avatarURL = url;
                            temp.avatar.nativeElement.setAttribute('width', '106px');
                            temp.avatar.nativeElement.setAttribute('height', '107px');
                            temp.formcourse.get('fileExt').setValue(data.fileExt);
                            temp.formcourse.get('data').setValue(data.data);
                            temp.fileInput.nativeElement.value = '';
                        },
                        err => {
                            temp.error = {
                                text: 'Update Course Logo error: ' + err.text
                            };
                            temp.errorModal.show();
                        }
                    );
                }
            };
            reader.readAsDataURL(file);
        }
    }

    getCvName(): any {
        if (this.cvList && this.selectedCv) {
            return {
                name: this.selectedCv.name,
                blocks: this.selectedCv.blockQty,
                s: (this.selectedCv.blockQty > 1) ? 's' : ''
            };
        }
        return {
            name: '',
            blocks: '',
            s: ''
        };
    }

    updateSelectedCv(cv) {
        this.selectedCv = cv;
        this.formcourse.get('cvId').setValue(cv.id);
        this.cvListModal.hide();
    }

    loadRecordsCv() {
        if (this.currentPageCv !== -1) {
            this.currentPageCv++;
            this.service.loadCvInfoList({pageSz: this.pageSz, pageNo: this.currentPageCv}).subscribe(
                result => {
                    const temp = (result['data'] && result['data'].length > 0) ? result['data'] : [];
                    if (temp.length === 0) {
                        this.enableMoreCv = false;
                        this.currentPageCv = -1;
                    } else {
                        temp.forEach(te => {
                            this.cvList.push(te);
                        });
                    }
                },
                err => {
                    this.error = {
                        text: 'Load Curriculums List error: ' + err.text
                    };
                    this.errorModal.show();
                }
            );
        } else {
            this.enableMoreCv = false;
        }
    }

    loadMoreRecordsCv() {
        this.loadRecordsCv();
    }

    loadRecordsTutors() {
        if (this.currentPageTutors !== -1) {
            this.currentPageTutors++;
            this.service.loadOrgStaffList({pageSz: this.pageSz, pageNo: this.currentPageTutors}).subscribe(
                result => {
                    const temp = (result['data'] && result['data'].length > 0) ? result['data'] : [];
                    if (temp.length === 0) {
                        this.enableMoreTutors = false;
                        this.currentPageTutors = -1;
                    } else {
                        const len = this.const_tutorsList.length;
                        temp.forEach(te => {
                            if (this.const_tutorsList.map(m => m.id).indexOf(te.id) < 0) {
                                this.const_tutorsList.push(te);
                            }
                        });
                        if (len === this.const_tutorsList.length) {
                            this.enableMoreTutors = false;
                        } else {
                            this.tutorsList = [];
                            this.const_tutorsList.forEach(ad => {
                                this.tutorsList.push(ad);
                            });
                        }
                    }
                },
                err => {
                    this.error = {
                        text: 'Load More Tutors List error: ' + err.text
                    };
                    this.errorModal.show();
                }
            );
        } else {
            this.enableMoreTutors = false;
        }
    }

    loadMoreRecordsTutors() {
        this.loadRecordsTutors();
    }

    loadRecordsAdmin() {
        if (this.currentPageAdmin !== -1) {
            this.currentPageAdmin++;
            this.service.loadOrgStaffList({pageSz: this.pageSz, pageNo: this.currentPageAdmin}).subscribe(
                result => {
                    const temp = (result['data'] && result['data'].length > 0) ? result['data'] : [];
                    if (temp.length === 0) {
                        this.enableMoreAdmin = false;
                        this.currentPageAdmin = -1;
                    } else {
                        const len = this.const_adminList.length;
                        temp.forEach(te => {
                            if (this.const_adminList.map(m => m.id).indexOf(te.id) < 0) {
                                this.const_adminList.push(te);
                            }
                        });
                        if (len === this.const_adminList.length) {
                            this.enableMoreAdmin = false;
                        } else {
                            this.adminList = [];
                            this.const_adminList.forEach(ad => {
                                this.adminList.push(ad);
                            });
                        }
                    }
                },
                err => {
                    this.error = {
                        text: 'Load More Administative Staffs List error: ' + err.text
                    };
                    this.errorModal.show();
                }
            );
        } else {
            this.enableMoreAdmin = false;
        }
    }

    loadMoreRecordsAdmin() {
        this.loadRecordsAdmin();
    }

    addTutor() {
        if (this.tutorsList.length > 0) {
            this.tutorsListModal.show();
            const ctrls = (<FormArray>this.tutorsForm.controls['staffs']).controls;
            ctrls.push(this.formBuilder.group({
                staff: new FormControl({value: '', disabled: true}, [Validators.required]),
                staff_id: new FormControl({value: '', disabled: true}, [Validators.required]),
                onEdit: new FormControl({value: false, disabled: true})
            }));
            this.selectedTutor =  0;
        }
    }

    removeTutor(rowIndex) {
        const control = (<FormArray>this.tutorsForm.controls['staffs']);
        if (control.controls[rowIndex]['controls']['staff_id']) {
            const selectedItemIndex = this.const_tutorsList.map(item => item.name)
                .indexOf(control.controls[rowIndex]['controls']['staff'].value);
            if (this.selectedTutor === selectedItemIndex) {
                this.selectedTutor = 0;
            }
            if (this.tutorsList.indexOf(this.const_tutorsList[selectedItemIndex]) < 0) {
                this.tutorsList.push(this.const_tutorsList[selectedItemIndex]);
            }
            this.service.removeStaff({staffSig: this.tutorsForm['controls']['staffs']['controls'][rowIndex].
                    controls['staff_id'].value}).subscribe(
                res => {
                    const staff = this.courseInfo.staff
                        .filter(st =>
                            st.name === this.tutorsForm['controls']['staffs']['controls'][rowIndex].
                                controls['staff'].value &&
                            st.type === 1
                        )[0];
                    this.courseInfo.staff.splice(this.courseInfo.staff.indexOf(staff), 1);
                    const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
                    this.cookieService.put('courseInfo', JSON.stringify(this.courseInfo), opt);
                    control.removeAt(rowIndex);
                },
                err => {
                    this.error = {
                        text: 'Remove this tutor error: ' + err.text
                    };
                    this.errorModal.show();
                }
            );
        }
    }

    showTutor(tutor) {
        this.tutorsListModal.hide();
        const index = (this.tutorsForm['controls']['staffs']['controls'].length > 0) ?
            this.tutorsForm['controls']['staffs']['controls'].length - 1 : 0;
        document.getElementById('input_tutor_' + index).setAttribute('style', 'display: block;');
        document.getElementById('span_tutor_' + index).setAttribute('style', 'display: block;');
        document.getElementById('input_tutor_' + index).parentElement.setAttribute('style', 'display: block;');
        this.selectedTutor = this.tutorsList.map(item => item.name).indexOf(tutor.name);
        this.tutorsForm['controls']['staffs']['controls'][index].controls['staff'].setValue(tutor.name);
        this.tutorsForm['controls']['staffs']['controls'][index].controls['staff_id'].setValue(tutor.signature);
        this.service.addStaff(
            {
                crsSig: this.courseInfo.signature,
                type: 1,
                staffSig: this.tutorsForm['controls']['staffs']['controls'][index].controls['staff_id'].value
            }).subscribe(
            res => {
                const item = {
                    name: tutor.name,
                    avatarURL: tutor.avatarURL,
                    assigmedOn: res['data'].assignedOn,
                    employer: tutor.employer,
                    rank: tutor.rank,
                    rankCount: tutor.rankCount,
                    signature: res['data'].signature,
                    type: res['data'].type,
                    userId: res['data'].userId
                };
                if (!this.courseInfo.staff) {
                    this.courseInfo.staff = [];
                }
                this.courseInfo.staff.push(item);
                this.tutorsForm['controls']['staffs']['controls'][index].controls['staff_id'].setValue(item.signature);
                const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
                this.cookieService.put('courseInfo', JSON.stringify(this.courseInfo), opt);
                this.updateTutorsList();
            },
            err => {
                this.error = {
                    text: 'Add this tutor error: ' + err.text
                };
                this.errorModal.show();
            }
        );
    }

    updateTutorsList() {
        this.tutorsList.splice(this.selectedTutor, 1);
    }

    addAdmin() {
        if (this.adminList.length > 0) {
            this.adminListModal.show();
            const ctrls = (<FormArray>this.adminForm.controls['staffs']).controls;
            ctrls.push(this.formBuilder.group({
                staff: new FormControl({value: '', disabled: true}, [Validators.required]),
                staff_id: new FormControl({value: '', disabled: true}, [Validators.required]),
                onEdit: new FormControl({value: false, disabled: true})
            }));
            this.selectedAdmin =  0;
        }
    }

    removeAdmin(rowIndex) {
        const control = (<FormArray>this.adminForm.controls['staffs']);
        if (control.controls[rowIndex]['controls']['staff_id']) {
            const selectedItemIndex = this.const_adminList.map(item => item.name)
                .indexOf(control.controls[rowIndex]['controls']['staff'].value);
            if (this.selectedAdmin === selectedItemIndex) {
                this.selectedAdmin = 0;
            }
            if (this.adminList.indexOf(this.const_adminList[selectedItemIndex]) < 0) {
                this.adminList.push(this.const_adminList[selectedItemIndex]);
            }
            this.service.removeStaff({staffSig: this.adminForm['controls']['staffs']['controls'][rowIndex].
                    controls['staff_id'].value}).subscribe(
                res => {
                    const staff = this.courseInfo.staff
                        .filter(st =>
                            st.name === this.adminForm['controls']['staffs']['controls'][rowIndex].
                                controls['staff'].value &&
                            st.type === 2
                        )[0];
                    this.courseInfo.staff.splice(this.courseInfo.staff.indexOf(staff), 1);
                    const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
                    this.cookieService.put('courseInfo', JSON.stringify(this.courseInfo), opt);
                    control.removeAt(rowIndex);
                },
                err => {
                    this.error = {
                        text: 'Remove this administrative staff error: ' + err.text
                    };
                    this.errorModal.show();
                }
            );
        }
    }

    showAdmin(admin) {
        this.adminListModal.hide();
        const index = (this.adminForm['controls']['staffs']['controls'].length > 0) ?
            this.adminForm['controls']['staffs']['controls'].length - 1 : 0;
        document.getElementById('input_admin_' + index).setAttribute('style', 'display: block;');
        document.getElementById('span_admin_' + index).setAttribute('style', 'display: block;');
        document.getElementById('input_admin_' + index).parentElement.setAttribute('style', 'display: block;');
        this.selectedAdmin = this.adminList.map(item => item.name).indexOf(admin.name);
        this.adminForm['controls']['staffs']['controls'][index].controls['staff'].setValue(admin.name);
        this.adminForm['controls']['staffs']['controls'][index].controls['staff_id'].setValue(admin.signature);
        this.service.addStaff(
            {
                crsSig: this.courseInfo.signature,
                type: 2,
                staffSig: this.adminForm['controls']['staffs']['controls'][index].controls['staff_id'].value
            }).subscribe(
            res => {
                const item = {
                    name: admin.name,
                    avatarURL: admin.avatarURL,
                    assigmedOn: res['data'].assignedOn,
                    employer: admin.employer,
                    rank: admin.rank,
                    rankCount: admin.rankCount,
                    signature: res['data'].signature,
                    type: res['data'].type,
                    userId: res['data'].userId
                };
                if (!this.courseInfo.staff) {
                    this.courseInfo.staff = [];
                }
                this.courseInfo.staff.push(item);
                this.adminForm['controls']['staffs']['controls'][index].controls['staff_id'].setValue(item.signature);
                const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
                this.cookieService.put('courseInfo', JSON.stringify(this.courseInfo), opt);
                this.updateAdminList();
            },
            err => {
                this.error = {
                    text: 'Add this administrative staff error: ' + err.text
                };
                this.errorModal.show();
            }
        );
    }

    updateAdminList() {
        this.adminList.splice(this.selectedAdmin, 1);
    }

    initStaffsData() {
        if (this.courseInfo.staff && this.courseInfo.staff.length > 0) {
            const temp = this;
            (<FormArray>temp.tutorsForm.controls['staffs']).controls = [];
            let ctrls = (<FormArray>temp.tutorsForm.controls['staffs']).controls;
            this.courseInfo.staff.filter(stff => stff.type === 1).forEach(categ => {
                ctrls.push(temp.formBuilder.group({
                    staff: new FormControl({value: categ.name, disabled: true}, [Validators.required]),
                    staff_id: new FormControl({value: categ.signature, disabled: true}, [Validators.required]),
                    onEdit: new FormControl({value: true, disabled: true})
                }));
                const indx = temp.tutorsList.map(c => c.name).indexOf(categ.name);
                temp.tutorsList.splice(indx, 1);
            });
            // for admin controls
            (<FormArray>temp.adminForm.controls['staffs']).controls = [];
            ctrls = (<FormArray>temp.adminForm.controls['staffs']).controls;
            this.courseInfo.staff.filter(stff => stff.type === 2).forEach(categ => {
                ctrls.push(temp.formBuilder.group({
                    staff: new FormControl({value: categ.name, disabled: true}, [Validators.required]),
                    staff_id: new FormControl({value: categ.signature, disabled: true}, [Validators.required]),
                    onEdit: new FormControl({value: true, disabled: true})
                }));
                const indx = temp.adminList.map(c => c.name).indexOf(categ.name);
                temp.adminList.splice(indx, 1);
            });
        }
    }
}