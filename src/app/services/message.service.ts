import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/messaging';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import 'rxjs/add/operator/take';
import { AngularFirestore } from '@angular/fire/firestore';
import { CoursesService } from './courses.service';
import { ClientEventService } from './client-event.service';
import { environment } from '../../environments/environment';
import { HttpService } from '../shared/http/service/http.service';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    messaging: any;
    currentMessage = new BehaviorSubject(null);
    items: Array<any> = new Array<any>();

    constructor(private afAuth: AngularFireAuth,
        private db: AngularFirestore,
        private courseService: CoursesService,
        private clientEventService: ClientEventService,
        private http: HttpService) {
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
                })
                .catch((err) => {
                    console.log('Unable to get permission to notify.', err);
                });
        } catch (err) { }
    }

    receiveMessage(): Observable<any> {
        return this.db.collection('TEN-CHAT').snapshotChanges();
    }

    lisenMessage(items: Array<any>) {
        const _this = this;
        this.receiveMessage().subscribe(reals => {
            reals.forEach(real => {
                if (real['type'] === 'modified') {
                    const lastMsgId = real['payload']['doc']['_document']['proto']['fields']['LastMsgId']['stringValue'];
                    _this.courseService.loadMessageById({ msgId: lastMsgId }).subscribe(realMessageData => {
                        const tempData = items.map(it => {
                            return { date: it.lastMsgDate, msg: it.msg };
                        });
                        if (!_this.checkExists(
                            tempData, { date: realMessageData['data']['lastMsgDate'], msg: realMessageData['data']['msg'] }
                        )) {
                            items.push(realMessageData['data']);
                            _this.items = items;
                            _this.clientEventService.BroadcastEvent('MESSAGE_RECEIVED', items);
                        }
                    });
                }
            });
        });
    }

    removeMessge(itemIndex: number) {
        this.items.splice(itemIndex, 1);
        this.clientEventService.BroadcastEvent('MESSAGE_RECEIVED', this.items);
    }

    getItemsList(): Observable<any> {
        return this.clientEventService.GetEvent('MESSAGE_RECEIVED');
    }

    checkExists(arr: Array<any>, item: any): boolean {
        if (arr.map(it => it['date']).indexOf(item['date']) !== -1 &&
            arr.map(it => it['msg']).indexOf(item['msg']) !== -1) {
            return true;
        }
        return false;
    }
    loadSeenUser(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/LoadSeenUser', data);
    }
    addGroup(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/AddGroup', data);
    }
    addGrpMember(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/AddGrpMember', data);
    }
    addMessage(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/AddMessage', data);
    }
    addReply(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/AddReply', data);
    }
    loadGrpMember(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/LoadGrpMember', data);
    }
    loadMessage(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/LoadMessage', data);
    }
    loadMessageById(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/LoadMessageById', data);
    }
    loadReply(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/LoadReply', data);
    }
    removeGrpMember(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/RemoveGrpMember', data);
    }
    revokeGroupAccess(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/RevokeGroupAccess', data);
    }
    revokeUserAccess(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/RevokeUserAccess', data);
    }
    setMsgSeen(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/SetMsgSeen', data);
    }
    LoadUserList(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'User/LoadUserList', data);
    }
    loadOrg(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Org/LoadOrg', data);
    }
    loadUserProfile(): Observable<any> {
        return this.http.post(environment.serverUrl + 'User/LoadUserProfile', {});
    }
}
