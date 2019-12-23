import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountingService} from '../../../../services/accounting.service';
import {CookieService} from 'ngx-cookie';
import {UtilsService} from '../../../../services/utils.service';
import {ContractStatus} from '../../../../models/contract-status';
import {ModalDirective} from '../../../../lib/ng-uikit-pro-standard/free/modals';

@Component({
    selector: 'app-accounting-contract-view',
    templateUrl: './contract-view.component.html',
    styleUrls: ['./contract-view.component.scss']
})
export class ContractViewComponent implements OnInit {
    @ViewChild('showImageModal') showImageModal: ModalDirective;
    contract: any;
    toRouters: Array<any>;
    selectedImages: Array<string> = new Array<string>();
    autoRunIndex: number = 0;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private service: AccountingService,
                private utilsService: UtilsService,
                private cookieService: CookieService) {
    }

    ngOnInit() {
        // Auto slider images in 3 seconds - right hand direction
        setInterval(() => {
            if (this.selectedImages.length > 0) {
                this.addUpdateRunIndex(1);
            }
        }, 3000);
        if (this.cookieService.get('routLinks')) {
            this.toRouters = JSON.parse(this.cookieService.get('routLinks'));
        }
        if (this.cookieService.get('contractInfo')) {
            this.contract = JSON.parse(this.cookieService.get('contractInfo'));
            this.service.LoadContract({contractSig: this.contract.contractSig}).subscribe(result => {
                this.contract = result['data'];
            });
        }
    }

    get getCreateDateInfo() {
        return this.utilsService.getCreateDateInfo;
    }

    get ContractStatus() {
        return ContractStatus;
    }

    showImage(imageIndex: number) {
        if (this.contract.files && this.contract.files.length > 0) {
            this.selectedImages = [];
            for (let i = 0; i < this.contract.files.length; i++) {
                const imageURL = (this.contract.files[i]) ?
                    this.contract.files[i] : '../../../assets/img/user-avatar.png';
                this.selectedImages.push(imageURL);
            }
            this.autoRunIndex = imageIndex;
            this.showImageModal.show();
        }
    }

    addUpdateRunIndex(delta: number) {
        this.autoRunIndex += delta;
        if (this.autoRunIndex === -1) {
            this.autoRunIndex = this.selectedImages.length - 1;
        }
        if (this.autoRunIndex === this.selectedImages.length) {
            this.autoRunIndex = 0;
        }
    }
}