import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/messaging';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import 'rxjs/add/operator/take';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class RegisterService {
    messaging: any;
    currentMessage = new BehaviorSubject(null);

    constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) {
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
        } catch (e) {
        }
    }

    receiveMessage(userToken?): Observable<any> {
        if (userToken) {
            return this.db.collection('TEN-USER').doc(userToken)
                .valueChanges();
        }
    }
}
