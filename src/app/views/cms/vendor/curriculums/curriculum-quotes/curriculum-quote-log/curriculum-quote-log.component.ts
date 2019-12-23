import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {CurriculumsService} from '../../../../../../services/curriculums.service';
import {CookieService} from 'ngx-cookie';

@Component({
    selector: 'app-cms-vendor-curriculum-quote-log',
    templateUrl: './curriculum-quote-log.component.html',
    styleUrls: ['./curriculum-quote-log.component.scss']
})
export class CurriculumQuoteLogComponent implements OnInit {
    firstFormGroup: FormGroup;
    taskForm: FormGroup;
    unitsList: Array<any>;
    items: Array<any>;
    task: any;
    decideList: Array<any>;
    cvSig: any;
    cv: any;

    constructor(private route: ActivatedRoute,
                private cookieService: CookieService,
                private service: CurriculumsService) {
        this.cvSig = this.route.snapshot.paramMap.get('curriculumId');
        this.firstFormGroup = new FormGroup({
            unit: new FormControl('', [Validators.required]),
        });
        this.taskForm = new FormGroup({
            decide: new FormControl('', [Validators.required]),
            message: new FormControl('', [Validators.required])
        });
    }

    ngOnInit() {
        this.items = [
            {
                date: '01-Aug-18 20:10',
                description: 'Just complete. Please feedback',
                vendor: 'Multi-media service Ltd.',
                status: 'Submited'
            },
            {
                date: '02-Aug-18 20:10',
                description: 'Just complete. Please feedback',
                vendor: 'Multi-media service Ltd.',
                status: 'Rejected'
            },
            {
                date: '03-Aug-18 20:10',
                description: 'Just complete. Please feedback',
                vendor: 'Multi-media service Ltd.',
                status: 'Submited'
            },
            {
                date: '04-Aug-18 20:10',
                description: 'Just complete. Please feedback',
                vendor: 'Multi-media service Ltd.',
                status: 'Submited'
            },
        ];
        this.decideList = [
            {
                value: 1,
                display: 'Accepted',
                message: 'this quotation is accepted and closed'
            },
            {
                value: 0,
                display: 'Rejected',
                message: 'this item need to be reworked'
            }
        ];
        this.task = {
            decide: this.decideList[0].value,
            message: 'Bla bla bla bla bla bla bla bla bla bla bla bla \n' +
                'bla bla bla bla',
            title: 'Unit 1 : Introduction to Forex'
        };
        this.taskForm.get('decide').setValue(this.task.decide);
        this.taskForm.get('message').setValue(this.task.message);


        this.cv = JSON.parse(this.cookieService.get('cvInfo'));
        this.service.LoadCvQuoteProgress({cvSig: this.cv.signature}).subscribe(result => {
            const temp = result['data'];
            this.service.loadCvUnitNameList({cvSig: this.cv.signature}).subscribe(resp => {
                const temp2 = resp['data'].units;
                temp2.forEach(it => {
                    const unit = {
                        value: it.signature,
                        name: it.name
                    };
                    this.unitsList.push(unit);
                });
                this.firstFormGroup.get('unit').setValue(this.unitsList[0].value);
            });
        });
    }

    get template() {
        return this.firstFormGroup.get('template');
    }

    onSubmit() {
        // do something here
    }

    save() {
        // do something here
        const results = {
            decide: Number.parseInt(this.taskForm.get('decide').value.toString(), 10),
            message: this.taskForm.get('message').value
        };
        this.service.AddTaskFeedback({description: results.message, status: results.decide}).subscribe(result => {
            const temp = result['data'];
        });
    }
}
