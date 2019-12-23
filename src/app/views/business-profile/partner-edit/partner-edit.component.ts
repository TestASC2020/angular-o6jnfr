import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {AppState} from '../../../app-state.service';
import {AppSharedService} from '../../../app-shared.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {BusinessService} from '../../../services/business.service';
import {CookieService} from 'ngx-cookie';
import {ModalDirective} from '../../../lib/ng-uikit-pro-standard/free/modals';

@Component({
    selector: 'app-business-profile-partner-edit',
    templateUrl: './partner-edit.component.html',
    styleUrls: ['./partner-edit.component.scss']
})
export class PartnerEditComponent implements OnInit, OnDestroy {
    @ViewChild('avatar') avatar: ElementRef;
    @ViewChild('fileInput') fileInput: ElementRef;
    partnerForm: FormGroup;
    countriesList: Array<any> = new Array<any>();
    regionList: Array<any> = new Array<any>();
    citiesList: Array<any> = new Array<any>();
    selectedCity: '';
    selectedCountry: '';
    selectedRegion: '';
    isEdit: boolean = false;
    partnerInfo: any;
    lastPartner: any;

    constructor(private service: UserService,
                private businessService: BusinessService,
                private cookieService: CookieService,
                private appState: AppState,
                private appShare: AppSharedService,
                private formBuilder: FormBuilder,
                private router: Router,
                private route: ActivatedRoute) {
        this.partnerForm = new FormGroup({
            name: new FormControl('', [Validators.required]),
            line1: new FormControl('', [Validators.required]),
            line2: new FormControl('', [Validators.required]),
            country: new FormControl('', [Validators.required]),
            city: new FormControl('', [Validators.required]),
            region: new FormControl('', [Validators.required]),
            phone: new FormControl('', [Validators.required]),
            hotline: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required]),
            logoURL: new FormControl('', [Validators.required]),
            about: new FormControl('', [Validators.required])
        });
        this.service.loadCountriesList().subscribe(res => {
            this.countriesList = res['data'];
            if (this.cookieService.get('partnerInfo')) {
                this.partnerInfo = JSON.parse(this.cookieService.get('partnerInfo'));
                if (this.partnerInfo.partner !== '') {
                    this.isEdit = true;
                    this.partnerForm.get('name').setValue(this.partnerInfo.partner.name);
                    this.partnerForm.get('line1').setValue(this.partnerInfo.partner.line1);
                    this.partnerForm.get('line2').setValue(this.partnerInfo.partner.line2);
                    this.partnerForm.get('country').setValue(this.partnerInfo.partner.country);
                    this.partnerForm.get('city').setValue(this.partnerInfo.partner.city);
                    this.partnerForm.get('region').setValue(this.partnerInfo.partner.region);
                    this.partnerForm.get('phone').setValue(this.partnerInfo.partner.phone);
                    this.partnerForm.get('hotline').setValue(this.partnerInfo.partner.hotline);
                    this.partnerForm.get('email').setValue(this.partnerInfo.partner.email);
                    this.partnerForm.get('logoURL').setValue(this.partnerInfo.partner.logoURL);
                    this.partnerForm.get('about').setValue(this.partnerInfo.partner.about);
                    if (!this.partnerForm.get('country')) {
                        this.partnerForm.get('country').setValue(
                            this.countriesList[0].code);
                    } else {
                        if (this.countriesList.map(it => it.name).indexOf(this.partnerInfo.partner['country']) < 0) {
                            this.partnerForm.get('country').setValue(
                                this.countriesList[0].code);
                        } else {
                            this.partnerForm.get('country').setValue(
                                this.countriesList[this.countriesList.map(it => it.name).
                                indexOf(this.partnerInfo.partner['country'])].code );
                        }
                    }
                    this.updateCountry(((this.partnerInfo.partner['region']) ? this.partnerInfo.partner['region'] : ''),
                        ((this.partnerInfo.partner['city']) ? this.partnerInfo.partner['city'] : ''));
                    this.avatar.nativeElement.setAttribute('src', this.partnerInfo.partner.logoURL);
                } else {
                    const partner = {
                        'Name': '',
                        'About': '',
                        'Address': {
                            'Line1': '',
                            'Line2': '',
                            'City': '',
                            'Region': '',
                            'Country': ''
                        },
                        'Email': '',
                        'Phone': '',
                        'Hotline': ''
                    };
                    this.businessService.addOrgPartner(partner).subscribe(resp => {
                        this.partnerInfo.partner = resp['data'];
                        const item = {
                            orgSig: this.partnerInfo.signature,
                            partner: this.partnerInfo.partner
                        };
                        const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
                        this.cookieService.put('partnerInfo', JSON.stringify(item), opt);
                    });
                }
            }
            this.lastPartner = {
                name: this.partnerForm.get('name').value,
                about: this.partnerForm.get('about').value,
                email: this.partnerForm.get('email').value,
                hotline: this.partnerForm.get('hotline').value,
                address: {
                    line1: this.partnerForm.get('line1').value,
                    line2: this.partnerForm.get('line2').value,
                    city: (this.partnerInfo.partner['city']) ? this.partnerInfo.partner['city'] : '',
                    country: (this.partnerInfo.partner['country']) ? this.partnerInfo.partner['country'] : '',
                    region: (this.partnerInfo.partner['region']) ? this.partnerInfo.partner['region'] : ''
                },
                phone: this.partnerForm.get('phone').value
            };
        });
    }

    ngOnInit() {
    }

    updateCountry(region?, city?) {
        const country = this.partnerForm.get('country').value;
        this.selectedCountry = country;
        this.service.loadCountryRegion(country).subscribe(res => {
            this.regionList = (res['data']) ? res['data'] : [];
            if (region && this.regionList.length > 0 && this.regionList.map(it => it.region).indexOf(region) > -1) {
                this.selectedRegion = this.regionList[this.regionList.map(it => it.region).indexOf(region)].region;
                this.partnerForm.get('region').setValue(
                    this.regionList[this.regionList.map(it => it.region).indexOf(this.selectedRegion)].region );
                this.updateRegion(city);
            } else {
                this.selectedRegion = (this.regionList.length > 0) ? this.regionList[0].region : '';
                this.partnerForm.get('region').setValue( (this.regionList.length > 0) ?
                    this.regionList[this.regionList.map(it => it.region).indexOf(this.selectedRegion)].region :
                    ''
                );
                this.updateRegion(city);
            }
        });
    }

    updateRegion(city?) {
        const region = this.partnerForm.get('region').value;
        this.selectedRegion = region;
        this.service.loadCitiesList(this.selectedCountry, this.selectedRegion).subscribe(res => {
            this.citiesList = (res['data']) ? res['data'] : [];
            if (city) {
                this.selectedCity = (this.citiesList.length > 0) ?
                    this.citiesList[this.citiesList.map(it => it.name).indexOf(city)].code : '';
                this.partnerForm.get('city').setValue(
                    this.selectedCity);
            } else {
                this.selectedCity = (this.citiesList.length > 0) ? this.citiesList[0].code : '';
                this.partnerForm.get('city').setValue(
                    this.selectedCity );
            }
        });
    }

    ngOnDestroy() {
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
                    temp.partnerForm.get('logoURL').setValue(e.target['result']);
                    const ext = file.name.split('.');
                    const data = {
                        data: e.target['result'].toString().split(',')[1],
                        fileExt: '.' + ext[ext.length - 1],
                        partnerSig: temp.partnerInfo.partner.signature
                    };
                    temp.businessService.uploadOrgPartnerLogo(data).subscribe(resp => {
                        temp.partnerInfo.partner.logoURL = resp['data'];
                        const item = {
                            orgSig: temp.partnerInfo.signature,
                            partner: temp.partnerInfo.partner
                        };
                        const opt = { expires: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) };
                        temp.cookieService.put('partnerInfo', JSON.stringify(item), opt);
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    }

    openFile() {
        this.fileInput.nativeElement.click();
    }

    save() {
        const indCity = this.citiesList.map(it => it.code).indexOf(this.partnerForm.get('city').value);
        const indCountry = this.countriesList.map(it => it.code).indexOf(this.partnerForm.get('country').value);
        const indRegion = this.regionList.map(it => it.region).indexOf(this.partnerForm.get('region').value);
        const partner = {
            'address': {
                'city': (this.citiesList.length > 0) ? this.citiesList[indCity].name : '',
                'country': (this.countriesList.length > 0) ? this.countriesList[indCountry].name : '',
                'line1': this.partnerForm.get('line1').value,
                'line2': this.partnerForm.get('line2').value,
                'region': (this.regionList.length > 0) ? this.regionList[indRegion].region : ''
            },
            'about': this.partnerForm.get('about').value,
            'email': this.partnerForm.get('email').value,
            'hotline': this.partnerForm.get('hotline').value,
            'name': this.partnerForm.get('name').value,
            'phone': this.partnerForm.get('phone').value,
            'partnerSig': this.partnerInfo.partner.signature
        };
        if (this.checkFormChange(this.lastPartner, partner)) {
            this.businessService.updateOrgPartner(partner).subscribe(res => {
                this.cookieService.remove('partnerInfo');
                this.router.navigate(['business-profile/profile']);
            });
        } else {
            this.cookieService.remove('partnerInfo');
            this.router.navigate(['business-profile/profile']);
        }
    }

    checkFormChange(lastPartner: any, partner: any): boolean {
        if (
            lastPartner.address.country === partner.address.country &&
            lastPartner.address.region === partner.address.region &&
            lastPartner.address.city === partner.address.city &&
            lastPartner.address.line1 === partner.address.line1 &&
            lastPartner.address.line2 === partner.address.line2 &&
            lastPartner.about === partner.about &&
            lastPartner.email === partner.email &&
            lastPartner.hotline === partner.hotline &&
            lastPartner.name === partner.name &&
            lastPartner.phone === partner.phone
        ) {
            return false;
        }
        return true;
    }

    removePartnerInfoCookie() {
        this.cookieService.remove('partnerInfo');
    }
}