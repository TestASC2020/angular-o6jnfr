import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../services/user.service';
import {AppState} from '../../../app-state.service';
import {AppSharedService} from '../../../app-shared.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BusinessService} from '../../../services/business.service';
import {CookieService} from 'ngx-cookie';
import {ModalDirective} from '../../../lib/ng-uikit-pro-standard/free/modals';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    @ViewChild('fileInput') fileInput: ElementRef;
    @ViewChild('removePartnerModal') removePartnerModal: ModalDirective;
    selectedPartner: any;
    @ViewChild('removeStaffModal') removeStaffModal: ModalDirective;
    selectedStaff: any;
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
    partnerItems: Array<any> = new Array<any>();
    staffItems: Array<any> = new Array<any>();
    const_staffItems: Array<any> = new Array<any>();
    staffProfilesItems: Array<any> = new Array<any>();
    categoryItems: Array<any> = new Array<any>();
    const_categoryItems: Array<any> = new Array<any>();
    isEdit: boolean = false;
    editAbout: boolean = false;
    selectedCategory: number = 0;
    searchCategoryText = '';
    searchText = '';
    lastProfile: any;
    lastAbout: any;
    loginUser: any;

    @ViewChild('categorylist') categorylist: ModalDirective;
    @ViewChild('stafflist') stafflist: ModalDirective;

    constructor(private service: UserService,
                private businessService: BusinessService,
                private cookieService: CookieService,
                private appState: AppState,
                private appShare: AppSharedService,
                private formBuilder: FormBuilder,
                private router: Router,
                private route: ActivatedRoute
    ) {
        this.lang = this.appState.locale.lang;
        this.profileForm = new FormGroup({
            about: new FormControl('', [Validators.required]),
            name: new FormControl('', [Validators.required]),
            shortName: new FormControl('', [Validators.required]),
            phone: new FormControl('', [Validators.required]),
            hotline: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required]),
            employer: new FormControl('', [Validators.required]),
            city: new FormControl('', [Validators.required]),
            country: new FormControl('', [Validators.required]),
            region: new FormControl('', [Validators.required]),
            line1: new FormControl('', [Validators.required]),
            line2: new FormControl('', [Validators.required]),
            categories: this.formBuilder.array([]),
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
        if (this.cookieService.get('auth')) {
            this.loginUser = JSON.parse(this.cookieService.get('auth'));
        }
        const temp = this;
        temp.businessService.loadCategoryList({pageSz: 1000}).subscribe(rrr => {
            temp.businessService.loadOrgStaffList({pageSz: 1000}).subscribe(rr => {
                temp.const_staffItems = rr['data'];
                temp.const_staffItems.forEach(it => {
                    if (!it.avatarURL) {
                        it.avatarURL = '../../../../../assets/img/user-avatar.png';
                    }
                });
                temp.staffItems = [];
                temp.const_staffItems.forEach(staff => {
                    temp.staffItems.push(staff);
                });
                this.businessService.loadOrgProfileStaffList({pageSz: 1000}).subscribe(resss => {
                    temp.staffProfilesItems = (resss['data']) ? resss['data'] : [];
                    temp.staffProfilesItems.forEach(staffProfile => {
                        const ind = temp.staffItems.map(ii => ii.id).indexOf(staffProfile.id);
                       if (ind > -1) {
                           temp.staffItems.splice(ind, 1);
                       }
                    });
                    temp.businessService.loadOrgProfile({lang: temp.appState.locale.lang}).subscribe(response => {
                        temp.profiles = response['data'];
                        temp.initCategoryData(rrr['data']);
                        this.service.loadCountriesList().subscribe(res => {
                            this.businessService.getPartnersList({orgSig: this.profiles['signature']})
                                .subscribe(items => {
                                    this.partnerItems = items['data'];
                                    BusinessService.items = items['data'];
                                    this.countriesList = res['data'];
                                    this.profileForm.get('about').setValue((this.profiles['about']) ? this.profiles['about'] : '');
                                    this.profileForm.get('shortName').setValue((this.profiles['shortName']) ?
                                        this.profiles['shortName'] : '');
                                    this.profileForm.get('email').setValue((this.profiles['email']) ? this.profiles['email'] : '');
                                    this.profileForm.get('phone').setValue((this.profiles['phone']) ? this.profiles['phone'] : '');
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
                                    this.profileForm.get('hotline').setValue((this.profiles['hotline']) ? this.profiles['hotline'] : '');
                                    this.profileForm.get('name').setValue((this.profiles['name']) ? this.profiles['name'] : '');
                                    this.lastAbout = this.profileForm.get('about').value;
                                    this.lastProfile = {
                                        name: this.profileForm.get('name').value,
                                        shortName: this.profileForm.get('shortName').value,
                                        email: this.profileForm.get('email').value,
                                        hotline: this.profileForm.get('hotline').value,
                                        line1: this.profileForm.get('line1').value,
                                        line2: this.profileForm.get('line2').value,
                                        city: (this.profiles['city']) ? this.profiles['city'] : '',
                                        country: (this.profiles['country']) ? this.profiles['country'] : '',
                                        region: (this.profiles['region']) ? this.profiles['region'] : '',
                                        phone: this.profileForm.get('phone').value
                                    };
                                });
                        });
                    });
                });
            });
        });
    }

    initCategoryData(categoryList: Array<any>) {
        const temp = this;
        temp.const_categoryItems = categoryList;
        temp.const_categoryItems.forEach(itCat => {
            if (!itCat.url) {
                itCat.url = '../../../../../assets/img/user-avatar.png';
            }
        });
        temp.categoryItems = [];
        temp.const_categoryItems.forEach( item => {
            temp.categoryItems.push(item);
        });
        if (temp.categoryItems.length > 0 && temp.profiles.category && temp.profiles.category.length > 0) {
            (<FormArray>temp.profileForm.controls['categories']).controls = [];
            const ctrls = (<FormArray>temp.profileForm.controls['categories']).controls;
            let chay = -1;
            temp.profiles.category.forEach(categ => {
                const indx = temp.categoryItems.map(c => c.name).indexOf(categ);
                // remove this category from this.categoryItems
                if (indx > -1) {
                    ctrls.push(temp.formBuilder.group({
                        category: new FormControl({value: temp.categoryItems[indx].name, disabled: true}, [Validators.required]),
                        category_id: new FormControl({value: temp.categoryItems[indx].id, disabled: true}, [Validators.required]),
                        onEdit: new FormControl({value: true, disabled: true})
                    }));
                    temp.categoryItems.splice(indx, 1);
                } else {
                    ctrls.push(temp.formBuilder.group({
                        category: new FormControl({value: categ, disabled: true}, [Validators.required]),
                        category_id: new FormControl({value: chay.toString(), disabled: true}, [Validators.required]),
                        onEdit: new FormControl({value: true, disabled: true})
                    }));
                    chay--;
                }
            });
        }
    }

    updateUser() {
        const data = {
            lang: this.lang,
            about: this.profileForm.get('about').value,
            phone: this.profileForm.get('phone').value,
            lastName: this.profileForm.get('lastName').value,
            firstName: this.profileForm.get('firstName').value,
            employer: this.profileForm.get('employer').value,
            address: {
                country: this.countriesList[this.countriesList.map(it => it.code).indexOf(this.profileForm.get('country').value)].name,
                region: this.regionList[this.regionList.map(it => it.region).indexOf(this.profileForm.get('region').value)].name,
                city: this.citiesList[this.citiesList.map(it => it.code).indexOf(this.profileForm.get('city').value)].name,
                line1: this.profileForm.get('line1').value,
                line2: this.profileForm.get('line2').value
            }
        };
        this.service.updateUser(data).subscribe(resp => {
            this.appShare.requestProfile();
        });
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
                    temp.profiles.logoURL = e.target['result'];
                    const ext = file.name.split('.');
                    const data = {
                        data: e.target['result'].split(',')[1],
                        fileExt: '.' + ext[ext.length - 1],
                        orgSig: temp.profiles.signature
                    };
                    temp.service.uploadOrgLogo(data).subscribe(resp => {
                        temp.profiles.logoURL = resp['data'];
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
            id: control['controls']['id'].value,
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
            id: this.getExperienceControlValue(index).id
        };
        this.service.removeUserExperience(data).subscribe(resp => {
            const control = (<FormArray>this.experiencesForm.controls['experiences']);
            control.removeAt(index);
            this.appShare.requestProfile();
        });
    }

    updateExperienceControl(index) {
        const data = {
            id: this.getExperienceControlValue(index).id,
            lang: this.lang,
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
            lang: this.lang,
            business: this.getExperienceControlValue(index).business,
            role: this.getExperienceControlValue(index).role
        };
        this.service.addUserExperience(data).subscribe(resp => {
            const control = (<FormArray>this.experiencesForm.get('experiences')).controls[index];
            control['controls']['isEdit'].setValue(false);
            control['controls']['id'].setValue(resp['data'].id);
            (<FormArray>this.experiencesForm.get('experiences')).push(this.createExpeienceControl({}));
            this.appShare.requestProfile();
        });
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
            id: control['controls']['id'].value,
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
            id: this.getSpecialtyControlValue(index).id,
            lang: this.lang,
            name: this.getSpecialtyControlValue(index).name
        };
        this.service.updateUserSpecialty(data).subscribe(resp => {
            const control = (<FormArray>this.specialtiesForm.get('specialties')).controls[index];
            control['controls']['isEdit'].setValue(false);
            this.appShare.requestProfile();
        });
    }

    removeSpecialtyControl(index) {
        const data = {
            id: this.getSpecialtyControlValue(index).id
        };
        this.service.removeUserSpecialty(data).subscribe(resp => {
            const control = (<FormArray>this.specialtiesForm.controls['specialties']);
            control.removeAt(index);
            this.appShare.requestProfile();
        });
    }

    addSpecialtyControl(index) {
        const data = {
            lang: this.lang,
            name: this.getSpecialtyControlValue(index).name
        };
        this.service.addUserSpecialty(data).subscribe(resp => {
            const control = (<FormArray>this.specialtiesForm.get('specialties')).controls[index];
            control['controls']['isEdit'].setValue(false);
            control['controls']['id'].setValue(resp['data'].id);
            (<FormArray>this.specialtiesForm.get('specialties')).push(this.createSpecialtyControl({}));
            this.appShare.requestProfile();
        });
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

    editPartner(partner: any) {
        const item = {
            orgSig: this.profiles.signature,
            partner: partner
        };
        const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
        this.cookieService.put('partnerInfo', JSON.stringify(item), opt);
        this.router.navigate(['business-profile/partner-edit']);
    }

    addPartner() {
        const item = {
            orgSig: this.profiles.signature,
            partner: ''
        };
        const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
        this.cookieService.put('partnerInfo', JSON.stringify(item), opt);
        this.router.navigate(['business-profile/partner-edit']);
    }

    removePartner(partnerSignature: string) {
        const data = {
            orgSig: this.profiles.signature,
            partnerSig: partnerSignature
        };
        this.selectedPartner = data;
        this.removePartnerModal.show();
    }

    removeSelectedPartner() {
        const data = this.selectedPartner;
        this.businessService.removeOrgPartner(data).subscribe(resp => {
            const index = this.partnerItems.map(ite => ite.signature).indexOf(data.partnerSig);
            this.partnerItems.splice(index, 1);
        });
    }

    transformCategories(categoryList: Array<any>): string {
        let result = '';
        if (categoryList && categoryList.length > 0) {
            result = categoryList.join(' / ');
        }
        return result;
    }

    addCategory() {
        if (this.categoryItems.length > 0) {
            this.categorylist.show();
            const ctrls = (<FormArray>this.profileForm.controls['categories']).controls;
            ctrls.push(this.formBuilder.group({
                category: new FormControl({value: '', disabled: true}, [Validators.required]),
                category_id: new FormControl({value: '', disabled: true}, [Validators.required]),
                onEdit: new FormControl({value: false, disabled: true})
            }));
            this.selectedCategory =  0;
        }
    }

    removeCategory(rowIndex) {
        const control = (<FormArray>this.profileForm.controls['categories']);
        if (control.controls[rowIndex]['controls']['category_id']) {
            const selectedItemIndex = this.const_categoryItems.map(item => item.id)
                .indexOf(control.controls[rowIndex]['controls']['category_id'].value);
            if (this.selectedCategory === selectedItemIndex) {
                this.selectedCategory = 0;
            }
            if (this.categoryItems.indexOf(this.const_categoryItems[selectedItemIndex]) < 0) {
                this.categoryItems.push(this.const_categoryItems[selectedItemIndex]);
            }
            this.businessService.removeOrgCategory({category: this.profileForm['controls']['categories']['controls'][rowIndex].
                    controls['category'].value}).subscribe(res => {
                control.removeAt(rowIndex);
                const ctrls = (<FormArray>this.profileForm.controls['categories']).controls;
                this.profiles.category = [];
                for (let i = 0; i < ctrls.length; i++) {
                    const category = ctrls[i]['controls']['category'].value;
                    this.profiles.category.push(category);
                }
            });
        }
    }

    showCategory(category) {
        this.categorylist.hide();
        const index = this.profileForm['controls']['categories']['controls'].length - 1;
        document.getElementById('input_' + index).setAttribute('style', 'display: block;');
        document.getElementById('span_' + index).setAttribute('style', 'display: block;');
        document.getElementById('input_' + index).parentElement.setAttribute('style', 'display: block;');
        this.selectedCategory = this.categoryItems.map(item => item.id).indexOf(category.id);
        this.profileForm['controls']['categories']['controls'][index].controls['category'].setValue(category.name);
        this.profileForm['controls']['categories']['controls'][index].controls['category_id'].setValue(category.id);
        this.businessService.addOrgCategory({category: this.profileForm['controls']['categories']['controls'][index].
                controls['category'].value}).subscribe(res => {
            this.updateCategoryList();
        });
    }

    updateCategoryList() {
        this.categoryItems.splice(this.selectedCategory, 1);
        const ctrls = (<FormArray>this.profileForm.controls['categories']).controls;
        this.profiles.category = [];
        for (let i = 0; i < ctrls.length; i++) {
            const category = ctrls[i]['controls']['category'].value;
            this.profiles.category.push(category);
        }
    }

    saveOrgProfile() {
        const indCity = this.citiesList.map(it => it.code).indexOf(this.profileForm.get('city').value);
        const indCountry = this.countriesList.map(it => it.code).indexOf(this.profileForm.get('country').value);
        const indRegion = this.regionList.map(it => it.region).indexOf(this.profileForm.get('region').value);
        const data = {
            'address': {
                'city': (this.citiesList && this.citiesList.length > 0) ? this.citiesList[indCity].name : '',
                'country': (this.countriesList && this.countriesList.length > 0) ? this.countriesList[indCountry].name : '',
                'line1': this.profileForm.get('line1').value,
                'line2': this.profileForm.get('line2').value,
                'region': (this.regionList && this.regionList.length > 0 ) ?  this.regionList[indRegion].region : ''
            },
            'status': null,
            'email': this.profileForm.get('email').value,
            'hotline': this.profileForm.get('hotline').value,
            'shortName': this.profileForm.get('shortName').value,
            'phone': this.profileForm.get('phone').value,
            'name': this.profileForm.get('name').value
        };
        if (this.checkProfilesChanged(data, this.lastProfile)) {
            this.businessService.updateOrgProfileInfo(data).subscribe(res => {
                this.profiles.email = data.email;
                this.profiles.name = data.name;
                this.profiles.hotline = data.hotline;
                this.profiles.shortName = data.shortName;
                this.profiles.phone = data.phone;
                this.profiles.city = data.address.city;
                this.profiles.country = data.address.country;
                this.profiles.region = data.address.region;
                this.profiles.line1 = data.address.line1;
                this.profiles.line2 = data.address.line2;
                this.lastProfile = {
                    name: this.profileForm.get('name').value,
                    shortName: this.profileForm.get('shortName').value,
                    email: this.profileForm.get('email').value,
                    hotline: this.profileForm.get('hotline').value,
                    line1: this.profileForm.get('line1').value,
                    line2: this.profileForm.get('line2').value,
                    city: data['address']['city'],
                    country: data['address']['country'],
                    region: data['address']['region'],
                    phone: this.profileForm.get('phone').value
                };
            });
        }
    }

    checkProfilesChanged(a, b): boolean {
        if (
            a['name'] === b['name'] &&
            a['shortName'] === b['shortName'] &&
            a['email'] === b['email'] &&
            a['hotline'] === b['hotline'] &&
            a['address']['line1'] === b['line1'] &&
            a['address']['line2'] === b['line2'] &&
            a['address']['city'] === b['city'] &&
            a['address']['country'] === b['country'] &&
            a['address']['region'] === b['region'] &&
            a['phone'] === b['phone']
        ) {
            return false;
        }
        return true;
    }

    saveOrgAbout() {
        const data = {
            'about': this.profileForm.get('about').value
        };
        if (data['about'] !== this.lastAbout) {
            this.businessService.updateOrgAbout(data).subscribe(res => {
                this.profiles.about = data.about;
                this.lastAbout = this.profileForm.get('about').value;
            });
        }
    }

    reloadAbout() {
        this.profileForm.get('about').setValue(this.lastAbout);
    }

    reloadProfile() {
        this.profileForm.get('name').setValue(this.lastProfile.name);
        this.profileForm.get('shortName').setValue(this.lastProfile.shortName);
        this.profileForm.get('email').setValue(this.lastProfile.email);
        this.profileForm.get('hotline').setValue(this.lastProfile.hotline);
        this.profileForm.get('line1').setValue(this.lastProfile.line1);
        this.profileForm.get('line2').setValue(this.lastProfile.line2);
        const indCountry = this.countriesList.map(it => it.name).indexOf(this.lastProfile.country);
        this.profileForm.get('country').setValue(this.countriesList[indCountry].code);
        this.updateCountry(this.lastProfile.region, this.lastProfile.city);
        this.profileForm.get('phone').setValue(this.lastProfile.phone);
        this.initCategoryData(this.const_categoryItems);
    }

    toPropperCase(str: any): string {
        if (!str) {
            return '';
        }
        str = str.toLowerCase().split(' ');
        for (let i = 0; i < str.length; i++) {
            str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
        }
        return str.join(' ');
    }

    addToStaffProfileList(staff: any) {
        const ind = this.staffItems.map(item => item.id).indexOf(staff.id);
        this.businessService.updateOrgProfileStaff({staffSig: staff.signature}).subscribe(resp => {
           this.staffItems.splice(ind, 1);
           this.staffProfilesItems.push(staff);
            this.stafflist.hide();
        });
    }

    viewStaffProfile(staffProfile) {
        const item = {
            staffSig: staffProfile.signature
        };
        const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
        this.cookieService.put('staffSigInfo', JSON.stringify(item), opt);
        this.router.navigate(['business-profile/profile/staff-profile-info']);
    }

    removeStaffProfile(staffProfile) {
        this.selectedStaff = staffProfile;
        this.removeStaffModal.show();
    }

    removeSelectedStaff() {
        const staffProfile = this.selectedStaff;
        const ind = this.staffProfilesItems.map(item => item.id).indexOf(staffProfile.id);
        this.businessService.removeOrgProfileStaff({staffSig: staffProfile.signature}).subscribe(resp => {
            this.staffProfilesItems.splice(ind, 1);
            this.staffItems.push(staffProfile);
        });
    }
}
