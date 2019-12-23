import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-cms-creator-curriculum-edit',
    templateUrl: './curriculum-edit.component.html',
    styleUrls: ['./curriculum-edit.component.scss']
})
export class CurriculumEditComponent implements OnInit {
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;
    fourthFormGroup: FormGroup;
    firthFormGroup: FormGroup;
    templates: Array<any>;
    types: Array<any>;

    constructor() {
        this.templates = [
            {
                name: 'Trading Template 1',
                value: 0,
                data: [
                    {
                        name: '1. Learning Objectives',
                        description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.' +
                            ' Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque ' +
                            'penatibus et magnis dis parturient montes, nascetur ridiculus mus.'
                    },
                    {
                        name: '2. Goals and Expectations',
                        description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.' +
                            ' Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque ' +
                            'penatibus et magnis dis parturient montes, nascetur ridiculus mus.'
                    },
                    {
                        name: '3. Curriculum Units',
                        unit: [
                            {
                                name: 'Unit 1',
                                title: 'Lorem ipsum',
                                description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.' +
                                    ' Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque ' +
                                    'penatibus et magnis dis parturient montes, nascetur ridiculus mus.'
                            },
                            {
                                name: 'Unit 2',
                                title: 'Lorem ipsum',
                                description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.' +
                                    ' Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque ' +
                                    'penatibus et magnis dis parturient montes, nascetur ridiculus mus.'
                            },
                            {
                                name: 'Excercises',
                                title: '',
                                description: ''
                            }
                        ]
                    },
                    {
                        name: '4. Assessments',
                        unit: [
                            {
                                name: 'Quiz',
                                title: 'Basic'
                            },
                            {
                                name: 'Quiz',
                                title: 'Intermediate'
                            },
                            {
                                name: 'Quiz',
                                title: 'Advamced'
                            }
                        ]
                    },
                    {
                        name: '5. Materials',
                        unit: [
                            {
                                name: 'Textbook'
                            },
                            {
                                name: 'Hyperlink'
                            }
                        ]
                    }
                ]
            },
            {
                name: 'Trading Template 2',
                value: 1,
                data: [
                    {
                        name: '1. Learning Objectives',
                        description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.' +
                            ' Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque ' +
                            'penatibus et magnis dis parturient montes, nascetur ridiculus mus.'
                    },
                    {
                        name: '2. Goals and Expectations',
                        description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.' +
                            ' Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque ' +
                            'penatibus et magnis dis parturient montes, nascetur ridiculus mus.'
                    },
                    {
                        name: '3. Curriculum Units',
                        unit: [
                            {
                                name: 'Unit 1',
                                title: 'Lorem ipsum',
                                description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.' +
                                    ' Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque ' +
                                    'penatibus et magnis dis parturient montes, nascetur ridiculus mus.'
                            },
                            {
                                name: 'Unit 2',
                                title: 'Lorem ipsum',
                                description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.' +
                                    ' Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque ' +
                                    'penatibus et magnis dis parturient montes, nascetur ridiculus mus.'
                            },
                            {
                                name: 'Excercises',
                                title: '',
                                description: ''
                            }
                        ]
                    }
                ]
            },
            {
                name: 'Education Template 1',
                value: 2,
                data: [
                    {
                        name: '1. Goals and Expectations',
                        description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.' +
                            ' Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque ' +
                            'penatibus et magnis dis parturient montes, nascetur ridiculus mus.'
                    },
                    {
                        name: '2. Curriculum Units',
                        unit: [
                            {
                                name: 'Unit 1',
                                title: 'Lorem ipsum',
                                description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.' +
                                    ' Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque ' +
                                    'penatibus et magnis dis parturient montes, nascetur ridiculus mus.'
                            },
                            {
                                name: 'Unit 2',
                                title: 'Lorem ipsum',
                                description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.' +
                                    ' Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque ' +
                                    'penatibus et magnis dis parturient montes, nascetur ridiculus mus.'
                            },
                            {
                                name: 'Excercises',
                                title: '',
                                description: ''
                            }
                        ]
                    },
                    {
                        name: '3. Assessments',
                        unit: [
                            {
                                name: 'Quiz',
                                title: 'Basic'
                            },
                            {
                                name: 'Quiz',
                                title: 'Intermediate'
                            },
                            {
                                name: 'Quiz',
                                title: 'Advamced'
                            }
                        ]
                    },
                    {
                        name: '4. Materials',
                        unit: [
                            {
                                name: 'Textbook',
                                title: ' '
                            },
                            {
                                name: 'Hyperlink',
                                title: ' '
                            }
                        ]
                    }
                ]
            }
        ];
        this.types = [
            {
                value: 0,
                name: 'Business'
            },
            {
                value: 1,
                name: 'Theater'
            },
            {
                value: 2,
                name: 'Education'
            },
            {
                value: 3,
                name: 'Worker'
            }
        ];
    }

    ngOnInit() {
        this.firstFormGroup = new FormGroup({
            template: new FormControl(this.templates[0].value, [Validators.required])
        });
        this.secondFormGroup = new FormGroup({
            type: new FormControl(this.types[0].value, [Validators.required]),
            title: new FormControl('Forex Trading', [Validators.required]),
            learning_objective: new FormControl('Technical analysis helps you to organize the overall' + '' +
                'market picture while it lays the path to rule based trading. ' +
                'Having a technical approach will be very important, specially ' +
                'during your first attempts to develop a personal trading style.', [Validators.required]),
            goals_and_expectations: new FormControl('Third-year Commerce standing', [Validators.required]),
            materials: new FormControl('')
        });
        this.thirdFormGroup = new FormGroup({
        });
        this.fourthFormGroup = new FormGroup({
        });
        this.firthFormGroup = new FormGroup({
        });
    }

    get template() { return this.firstFormGroup.get('template'); }

    onSubmit() {
        // do something here
    }
    save() {
        // do something here
    }
}