import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/messaging';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import 'rxjs/add/operator/take';
import { AngularFirestore } from '@angular/fire/firestore';
import { CoursesService } from './courses.service';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    messaging: any;
    currentMessage = new BehaviorSubject(null);

    constructor(private afAuth: AngularFireAuth, private db: AngularFirestore, private service: CoursesService) {
        try {
            this.messaging = firebase.messaging();
        } catch (e) {
            console.log('Unable to Instantiate Firebase Messaing', e);
        }
    }

    getPermission() {
        try {
            this.messaging.requestPermission()
                .then(() => {
                    //
                })
                // .then(token => {
                //     this.updateToken(token);
                // })
                .catch((err) => {
                    console.log('Unable to get permission to notify.', err);
                });
        } catch (err) { }
    }

    receiveMessage(collection?: string, doc?: string): Observable<any> {
        if (collection && doc) {
            return this.db.collection(collection).doc(doc)
                .valueChanges();
        }
    }
}
