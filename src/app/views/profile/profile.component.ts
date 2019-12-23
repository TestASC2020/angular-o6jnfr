import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {AppState} from '../../app-state.service';
import {AppSharedService} from '../../app-shared.service';
import {ToastService} from '../../lib/ng-uikit-pro-standard/pro/alerts';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    @ViewChild('avatar') avatar: ElementRef;
    @ViewChild('fileInput') fileInput: ElementRef;
    countriesList: Array<any> = new Array<any>();
    regionList: Array<any> = new Array<any>();
    citiesList: Array<any> = new Array<any>();
    selectedCity: '';
    selectedCountry: '';
    selectedRegion: '';
    profiles: any;
    lang: number = 0;
    profileForm: FormGroup;
    experiencesForm: FormGroup;
    specialtiesForm: FormGroup;

    constructor(private service: UserService,
                private appState: AppState,
                private appShare: AppSharedService,
                private toastrService: ToastService,
                private translate: TranslateService,
                private formBuilder: FormBuilder
                ) {
        this.lang = this.appState.locale.lang;
        this.profileForm = new FormGroup({
            about: new FormControl('', [Validators.required]),
            firstName: new FormControl('', [Validators.required]),
            lastName: new FormControl('', [Validators.required]),
            phone: new FormControl('', [Validators.required]),
            employer: new FormControl('', [Validators.required]),
            city: new FormControl('', [Validators.required]),
            country: new FormControl('', [Validators.required]),
            region: new FormControl('', [Validators.required]),
            line1: new FormControl('', [Validators.required]),
            line2: new FormControl('', [Validators.required])
        });
        const experiences = this.formBuilder.array([]);
        this.experiencesForm = new FormGroup({
            experiences: experiences
        });
        const specialties = this.formBuilder.array([]);
        this.specialtiesForm = new FormGroup({
            specialties: specialties
        });
    }

    createExpeienceControl(data): FormGroup {
        if (Object.keys(data).length > 0) {
            return this.formBuilder.group({
                business: [data.business, Validators.required],
                id: [data.id],
                role: [data.role, Validators.required],
                isEdit: [false]
            });
        }
        return this.formBuilder.group({
            business: ['', Validators.required],
            id: [''],
            role: ['', Validators.required],
            isEdit: [true]
        });
    }

    createSpecialtyControl(data): FormGroup {
        if (Object.keys(data).length > 0) {
            return this.formBuilder.group({
                id: [data.id],
                name: [data.name, Validators.required],
                isEdit: [false]
            });
        }
        return this.formBuilder.group({
            id: [''],
            name: ['', Validators.required],
            isEdit: [true]
        });
    }

    ngOnInit() {
        this.service.loadUserProfile().subscribe(response => {
            this.service.loadCountriesList().subscribe(res => {
                this.profiles = response['data'];
                this.countriesList = res['data'];
                this.profileForm.get('about').setValue((this.profiles['about']) ? this.profiles['about'] : '');
                this.profileForm.get('phone').setValue((this.profiles['phone']) ? this.profiles['phone'] : '');
                this.profileForm.get('employer').setValue((this.profiles['employer']) ? this.profiles['employer'] : '');
                if (!this.profileForm.get('country')) {
                    this.profileForm.get('country').setValue(
                        this.countriesList[0].code);
                } else {
                    if (this.countriesList.map(it => it.name).indexOf(this.profiles['country']) < 0) {
                        this.profileForm.get('country').setValue(
                            this.countriesList[0].code);
                    } else {
                        this.profileForm.get('country').setValue(
                            this.countriesList[this.countriesList.map(it => it.name).
                            indexOf(this.profiles['country'])].code );
                    }
                }
                this.updateCountry(((this.profiles['region']) ? this.profiles['region'] : ''),
                    ((this.profiles['city']) ? this.profiles['city'] : ''));
                this.profileForm.get('line1').setValue((this.profiles['line1']) ? this.profiles['line1'] : '');
                this.profileForm.get('line2').setValue((this.profiles['line2']) ? this.profiles['line2'] : '');
                const name = (this.profiles['name']) ? this.profiles['name'] : '';
                if (name === '') {
                    this.profileForm.get('firstName').setValue('');
                    this.profileForm.get('lastName').setValue('');
                } else if (name.indexOf(' ') < 0) {
                    this.profileForm.get('lastName').setValue(name.trim());
                    this.profileForm.get('firstName').setValue('');
                } else {
                    this.profileForm.get('lastName').setValue(
                        name.split(' ').slice(-1).join(' ').trim()
                    );
                    this.profileForm.get('firstName').setValue(
                        name.split(' ').slice(0, -1).join(' ').trim()
                    );
                }
                this.avatar.nativeElement.setAttribute('src', this.profiles['avatarURL']);
                if (this.profiles['experiences']) {
                    this.profiles['experiences'].forEach(experience => {
                        (<FormArray>this.experiencesForm.get('experiences')).push(this.createExpeienceControl({
                            id: experience.signature,
                            business: experience.business,
                            role: experience.role,
                            isEdit: false
                        }));
                    });
                }
                (<FormArray>this.experiencesForm.get('experiences')).push(this.createExpeienceControl({}));
                if (this.profiles['specialties']) {
                    this.profiles['specialties'].forEach(specialty => {
                        (<FormArray>this.specialtiesForm.get('specialties')).push(this.createSpecialtyControl({
                            id: specialty.signature,
                            name: specialty.name,
                            isEdit: false
                        }));
                    });
                }
                (<FormArray>this.specialtiesForm.get('specialties')).push(this.createSpecialtyControl({}));
            });
        });
    }

    updateUser() {
        const data = {
            about: this.profileForm.get('about').value,
            phone: this.profileForm.get('phone').value,
            lastName: this.profileForm.get('lastName').value,
            firstName: this.profileForm.get('firstName').value,
            employer: this.profileForm.get('employer').value,
            address: {
                country: this.countriesList[this.countriesList.map(it => it.code).indexOf(this.profileForm.get('country').value)].name,
                region: this.regionList[this.regionList.map(it => it.region).indexOf(this.profileForm.get('region').value)].region,
                city: this.citiesList[this.citiesList.map(it => it.code).indexOf(this.profileForm.get('city').value)].name,
                line1: this.profileForm.get('line1').value,
                line2: this.profileForm.get('line2').value
            }
        };
        this.toastrService.clear();
        const notifNeigbourId = '#notif-neigbour';
        this.service.updateUser(data).subscribe(
            resp => {
                this.appShare.requestProfile();
                const message = 'MESSAGE.NameList.UpdateProfileSuccess';
                this.translate.get(message).subscribe(
                    text => {
                        this.toastrService.success(text);
                        const elem = document.querySelector(notifNeigbourId).getBoundingClientRect();
                        (document.querySelector('#toast-container') as HTMLElement).style.top = elem.top + 'px';
                        (document.querySelector('#toast-container') as HTMLElement).style.left = (elem.left + elem.width + 10) + 'px';
                    }
                );
            },
            err => {
                const message = 'MESSAGE.NameList.UpdateProfileFailed';
                const error = 'MESSAGE.NameList.NothingChanged';
                this.translate.get(error).subscribe(
                    text1 => {
                        this.translate.get(message, {error: text1}).subscribe(
                            text2 => {
                                this.toastrService.error(text2);
                                const elem = document.querySelector(notifNeigbourId).getBoundingClientRect();
                                (document.querySelector('#toast-container') as HTMLElement).style.top = elem.top + 'px';
                                (document.querySelector('#toast-container') as HTMLElement).style.left = (elem.left + elem.width + 10) + 'px';
                            }
                        );
                    }
                );
            }
        );
    }

    updateCountry(region?, city?) {
        const country = this.profileForm.get('country').value;
        this.selectedCountry = country;
        this.service.loadCountryRegion(country).subscribe(res => {
            this.regionList = res['data'];
            if (region && this.regionList.map(it => it.region).indexOf(region) > -1) {
                this.selectedRegion = this.regionList[this.regionList.map(it => it.region).indexOf(region)].region;
                this.profileForm.get('region').setValue(
                    this.regionList[this.regionList.map(it => it.region).indexOf(this.selectedRegion)].region );
                this.updateRegion(city);
            } else {
                this.selectedRegion = (this.regionList.length > 0) ? this.regionList[0].region : '';
                this.profileForm.get('region').setValue( (this.regionList.length > 0) ?
                    this.regionList[this.regionList.map(it => it.region).indexOf(this.selectedRegion)].region :
                    ''
                );
                this.updateRegion(city);
            }
        });
    }

    updateRegion(city?) {
        const region = this.profileForm.get('region').value;
        this.selectedRegion = region;
        this.service.loadCitiesList(this.selectedCountry, this.selectedRegion).subscribe(res => {
            this.citiesList = res['data'];
            if (city) {
                this.selectedCity = (this.citiesList.length > 0) ?
                    this.citiesList[this.citiesList.map(it => it.name).indexOf(city)].code : '';
                this.profileForm.get('city').setValue(
                    this.selectedCity);
            } else {
                this.selectedCity = (this.citiesList.length > 0) ? this.citiesList[0].code : '';
                this.profileForm.get('city').setValue(
                    this.selectedCity );
            }
        });
    }

    previewFile($event) {
        const file: File = $event.target.files[0];
        const temp = this;
        const reader: FileReader = new FileReader();
        if (file) {
            reader.onloadend = function(e) {
                if (e.target && e.target['result']) {
                    temp.avatar.nativeElement.setAttribute('src', e.target['result']);
                    temp.avatar.nativeElement.setAttribute('width', '106px');
                    temp.avatar.nativeElement.setAttribute('height', '107px');
                    temp.service.uploadAvatar(e.target['result'].split(',')[1], 1).subscribe(resp => {
                        temp.appShare.requestProfile();
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    }

    openFile() {
        this.fileInput.nativeElement.click();
    }

    getExperienceControlValue(index) {
        const control = (<FormArray>this.experiencesForm.get('experiences')).controls[index];
        return {
            experienceSig: control['controls']['id'].value,
            business: control['controls']['business'].value,
            role: control['controls']['role'].value,
            isEdit: JSON.parse(control['controls']['isEdit'].value)
        };
    }

    enableExperienceControl(index, editable) {
        const control = (<FormArray>this.experiencesForm.get('experiences')).controls[index];
        control['controls']['isEdit'].setValue(editable);
    }

    removeExperienceControl(index) {
        const data = {
            experienceSig: this.getExperienceControlValue(index).experienceSig
        };
        this.toastrService.clear();
        const notifNeigbourId = '#notif-exp-neigbour';
        this.service.removeUserExperience(data).subscribe(
            resp => {
                const control = (<FormArray>this.experiencesForm.controls['experiences']);
                control.removeAt(index);
                this.appShare.requestProfile();
                const message = 'MESSAGE.NameList.UpdateExperiencesSuccess';
                this.translate.get(message).subscribe(
                    text => {
                        this.toastrService.success(text);
                        const elem = document.querySelector(notifNeigbourId).getBoundingClientRect();
                        (document.querySelector('#toast-container') as HTMLElement).style.top = elem.top + 'px';
                        (document.querySelector('#toast-container') as HTMLElement).style.left = (elem.left + elem.width + 10) + 'px';
                    }
                );
            },
            err => {
                const message = 'MESSAGE.NameList.UpdateExperiencesFailed';
                const error = 'MESSAGE.NameList.NothingChanged';
                this.translate.get(error).subscribe(
                    text1 => {
                        this.translate.get(message, {error: text1}).subscribe(
                            text2 => {
                                this.toastrService.error(text2);
                                const elem = document.querySelector(notifNeigbourId).getBoundingClientRect();
                                (document.querySelector('#toast-container') as HTMLElement).style.top = elem.top + 'px';
                                (document.querySelector('#toast-container') as HTMLElement).style.left = (elem.left + elem.width + 10) + 'px';
                            }
                        );
                    }
                );
            }
        );
    }

    updateExperienceControl(index) {
        const data = {
            experienceSig: this.getExperienceControlValue(index).experienceSig,
            business: this.getExperienceControlValue(index).business,
            role: this.getExperienceControlValue(index).role
        };
        this.service.updateUserExperience(data).subscribe(resp => {
            const control = (<FormArray>this.experiencesForm.get('experiences')).controls[index];
            control['controls']['isEdit'].setValue(false);
            this.appShare.requestProfile();
        });
    }

    addExperienceControl(index) {
        const data = {
            business: this.getExperienceControlValue(index).business,
            role: this.getExperienceControlValue(index).role
        };
        this.toastrService.clear();
        const notifNeigbourId = '#notif-exp-neigbour';
        this.service.addUserExperience(data).subscribe(
            resp => {
                const control = (<FormArray>this.experiencesForm.get('experiences')).controls[index];
                control['controls']['isEdit'].setValue(false);
                control['controls']['id'].setValue(resp['data'].signature);
                (<FormArray>this.experiencesForm.get('experiences')).push(this.createExpeienceControl({}));
                this.appShare.requestProfile();
                const message = 'MESSAGE.NameList.UpdateExperiencesSuccess';
                this.translate.get(message).subscribe(
                    text => {
                        this.toastrService.success(text);
                        const elem = document.querySelector(notifNeigbourId).getBoundingClientRect();
                        (document.querySelector('#toast-container') as HTMLElement).style.top = elem.top + 'px';
                        (document.querySelector('#toast-container') as HTMLElement).style.left = (elem.left + elem.width + 10) + 'px';
                    }
                );
            },
            err => {
                const message = 'MESSAGE.NameList.UpdateExperiencesFailed';
                const error = 'MESSAGE.NameList.NothingChanged';
                this.translate.get(error).subscribe(
                    text1 => {
                        this.translate.get(message, {error: text1}).subscribe(
                            text2 => {
                                this.toastrService.error(text2);
                                const elem = document.querySelector(notifNeigbourId).getBoundingClientRect();
                                (document.querySelector('#toast-container') as HTMLElement).style.top = elem.top + 'px';
                                (document.querySelector('#toast-container') as HTMLElement).style.left = (elem.left + elem.width + 10) + 'px';
                            }
                        );
                    }
                );
            }
        );
    }

    saveExperienceControl(index) {
        const control = (<FormArray>this.experiencesForm.get('experiences')).controls[index];
        if (control['controls']['id'].value) {
            this.updateExperienceControl(index);
        } else {
            this.addExperienceControl(index);
        }
    }

    getSpecialtyControlValue(index) {
        const control = (<FormArray>this.specialtiesForm.get('specialties')).controls[index];
        return {
            specialSig: control['controls']['id'].value,
            name: control['controls']['name'].value,
            isEdit: JSON.parse(control['controls']['isEdit'].value)
        };
    }

    enableSpecialtyControl(index, editable) {
        const control = (<FormArray>this.specialtiesForm.get('specialties')).controls[index];
        control['controls']['isEdit'].setValue(editable);
    }

    updateSpecialtyControl(index) {
        const data = {
            specialSig: this.getSpecialtyControlValue(index).specialSig,
            name: this.getSpecialtyControlValue(index).name
        };
        this.toastrService.clear();
        const notifNeigbourId = '#notif-spec-neigbour';
        this.service.updateUserSpecialty(data).subscribe(
            resp => {
                const control = (<FormArray>this.specialtiesForm.get('specialties')).controls[index];
                control['controls']['isEdit'].setValue(false);
                this.appShare.requestProfile();
                const message = 'MESSAGE.NameList.UpdateSpecialtiesSuccess';
                this.translate.get(message).subscribe(
                    text => {
                        this.toastrService.success(text);
                        const elem = document.querySelector(notifNeigbourId).getBoundingClientRect();
                        (document.querySelector('#toast-container') as HTMLElement).style.top = elem.top + 'px';
                        (document.querySelector('#toast-container') as HTMLElement).style.left = (elem.left + elem.width + 10) + 'px';
                    }
                );
            },
            err => {
                const message = 'MESSAGE.NameList.UpdateSpecialtiesFailed';
                const error = 'MESSAGE.NameList.NothingChanged';
                this.translate.get(error).subscribe(
                    text1 => {
                        this.translate.get(message, {error: text1}).subscribe(
                            text2 => {
                                this.toastrService.error(text2);
                                const elem = document.querySelector(notifNeigbourId).getBoundingClientRect();
                                (document.querySelector('#toast-container') as HTMLElement).style.top = elem.top + 'px';
                                (document.querySelector('#toast-container') as HTMLElement).style.left = (elem.left + elem.width + 10) + 'px';
                            }
                        );
                    }
                );
            }
        );
    }

    removeSpecialtyControl(index) {
        const data = {
            specialSig: this.getSpecialtyControlValue(index).specialSig
        };
        this.toastrService.clear();
        const notifNeigbourId = '#notif-spec-neigbour';
        this.service.removeUserSpecialty(data).subscribe(
            resp => {
                const control = (<FormArray>this.specialtiesForm.controls['specialties']);
                control.removeAt(index);
                this.appShare.requestProfile();
                const message = 'MESSAGE.NameList.UpdateSpecialtiesSuccess';
                this.translate.get(message).subscribe(
                    text => {
                        this.toastrService.success(text);
                        const elem = document.querySelector(notifNeigbourId).getBoundingClientRect();
                        (document.querySelector('#toast-container') as HTMLElement).style.top = elem.top + 'px';
                        (document.querySelector('#toast-container') as HTMLElement).style.left = (elem.left + elem.width + 10) + 'px';
                    }
                );
            },
            err => {
                const message = 'MESSAGE.NameList.UpdateSpecialtiesFailed';
                const error = 'MESSAGE.NameList.NothingChanged';
                this.translate.get(error).subscribe(
                    text1 => {
                        this.translate.get(message, {error: text1}).subscribe(
                            text2 => {
                                this.toastrService.error(text2);
                                const elem = document.querySelector(notifNeigbourId).getBoundingClientRect();
                                (document.querySelector('#toast-container') as HTMLElement).style.top = elem.top + 'px';
                                (document.querySelector('#toast-container') as HTMLElement).style.left = (elem.left + elem.width + 10) + 'px';
                            }
                        );
                    }
                );
            }
        );
    }

    addSpecialtyControl(index) {
        const data = {
            lang: this.lang,
            name: this.getSpecialtyControlValue(index).name
        };
        this.toastrService.clear();
        const notifNeigbourId = '#notif-spec-neigbour';
        this.service.addUserSpecialty(data).subscribe(
            resp => {
                const control = (<FormArray>this.specialtiesForm.get('specialties')).controls[index];
                control['controls']['isEdit'].setValue(false);
                control['controls']['id'].setValue(resp['data'].signature);
                (<FormArray>this.specialtiesForm.get('specialties')).push(this.createSpecialtyControl({}));
                this.appShare.requestProfile();
                const message = 'MESSAGE.NameList.UpdateSpecialtiesSuccess';
                this.translate.get(message).subscribe(
                    text => {
                        this.toastrService.success(text);
                        const elem = document.querySelector(notifNeigbourId).getBoundingClientRect();
                        (document.querySelector('#toast-container') as HTMLElement).style.top = elem.top + 'px';
                        (document.querySelector('#toast-container') as HTMLElement).style.left = (elem.left + elem.width + 10) + 'px';
                    }
                );
            },
            err => {
                const message = 'MESSAGE.NameList.UpdateSpecialtiesFailed';
                const error = 'MESSAGE.NameList.NothingChanged';
                this.translate.get(error).subscribe(
                    text1 => {
                        this.translate.get(message, {error: text1}).subscribe(
                            text2 => {
                                this.toastrService.error(text2);
                                const elem = document.querySelector(notifNeigbourId).getBoundingClientRect();
                                (document.querySelector('#toast-container') as HTMLElement).style.top = elem.top + 'px';
                                (document.querySelector('#toast-container') as HTMLElement).style.left = (elem.left + elem.width + 10) + 'px';
                            }
                        );
                    }
                );
            }
        );
    }

    saveSpecialtyControl(index) {
        const control = (<FormArray>this.specialtiesForm.get('specialties')).controls[index];
        if (control['controls']['id'].value) {
            this.updateSpecialtyControl(index);
        } else {
            this.addSpecialtyControl(index);
        }
    }

    get console() {
        return console;
    }
}
