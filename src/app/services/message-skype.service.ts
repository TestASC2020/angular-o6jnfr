import { Injectable } from '@angular/core';
import 'firebase/messaging';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/take';
import { environment } from '../../environments/environment';
import { HttpService } from '../shared/http/service/http.service';
import { map } from 'rxjs/operators';
import { HttpEventType } from '@angular/common/http';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ClientEventService } from './client-event.service';

@Injectable({
    providedIn: 'root'
})
export class MessageSkypeService {
    messaging: any;

    constructor(private http: HttpService,
        private afAuth: AngularFireAuth,
        private db: AngularFirestore,
        private clientEventService: ClientEventService) {
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

    checkExists(arr: Array<any>, item: any): boolean {
        if (arr.map(it => it['date']).indexOf(item['date']) !== -1 &&
            arr.map(it => it['msg']).indexOf(item['msg']) !== -1) {
            return true;
        }
        return false;
    }

    listenMessage() {
        const _this = this;
        this.receiveMessage().subscribe(reals => {
            reals.forEach(real => {
                if (real['type'] === 'modified') {
                    const lastMsgId = real['payload']['doc']['_document']['proto']['fields']['LastMsgId']['stringValue'];
                    const parentId = real['payload']['doc']['_document']['proto']['fields']['ParentId']['stringValue'];
                    const names = (real['payload']['doc']['_document']['proto']['name']) ?
                        real['payload']['doc']['_document']['proto']['name'].split('/') : [];
                    const threadId = (names.length > 0) ? names[names.length - 1] : null;
                    _this.loadMessageById({ msgId: lastMsgId }).subscribe(realMessageData => {
                        _this.clientEventService.BroadcastEvent('MESSAGE_RAISED', {
                            messageId: lastMsgId,
                            parentId: parentId,
                            item: realMessageData['data'],
                            threadId: threadId
                        });
                    });
                }
            });
        });
    }

    geMessages(): Observable<any> {
        return this.clientEventService.GetEvent('MESSAGE_RAISED');
    }

    // Load seen users list
    // params:
    // msgSig: string - message signature
    loadSeenUser(data): Observable<any> {
        return this.http.post<any>(
            environment.serverUrl + 'Chat/LoadSeenUser',
            data,
            {
                reportProgress: true,
                observe: 'events'
            }
        ).pipe(map((event) => {
            switch (event.type) {
                case HttpEventType.UploadProgress:
                    const progress = Math.round(100 * event.loaded / event.total);
                    return { status: 'progress', message: progress };

                case HttpEventType.Response:
                    return event.body;
                default:
                    return `Unhandled event: ${event.type}`;
            }
        })
        );
    }
    // Set as seen message
    // params:
    // msgSig: string - message signature
    setMsgSeen(data): Observable<any> {
        return this.http.post<any>(
            environment.serverUrl + 'Chat/SetMsgSeen',
            data
        );
    }
    // Add new group
    // params:
    // memSigs: Array<string> - list of members signature
    // name: string - group name
    addGroup(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/AddGroup', data);
    }
    // Add new group member
    // params:
    // memSigs: Array<string> - list of members signature
    // threadSig: string - thread signature
    addGrpMember(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/AddGrpMember', data);
    }
    // Load users list thread
    // params:
    // pageNo: number - page number
    loadUserThread(data): Observable<any> {
        return this.http.post<any>(
            environment.serverUrl + 'Chat/LoadUserThread',
            data,
            {
                reportProgress: true,
                observe: 'events'
            }
        ).pipe(map((event) => {
            switch (event.type) {
                case HttpEventType.UploadProgress:
                    const progress = Math.round(100 * event.loaded / event.total);
                    return { status: 'progress', message: progress };

                case HttpEventType.Response:
                    return event.body;
                default:
                    return `Unhandled event: ${event.type}`;
            }
        })
        );
    }
    // Load unseen threads count
    // params:
    // threadSigs: Array<string> - list of thread signatures
    loadUnSeenCount(data): Observable<any> {
        return this.http.post<any>(
            environment.serverUrl + 'Chat/LoadUnSeenCount', data);
    }
    addMessage(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/AddMessage', data);
    }
    updateMessage(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/UpdateMsg', data);
    }
    addFile(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/AddFile', data);
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
    checkBanCrsUser(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Lms/CheckBanUser', data);
    }
    unBanUser(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/UnBanUser', data);
    }
    banUser(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/BanUser', data);
    }
    loadReply(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/LoadReply', data);
    }
    removeGrpMember(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/RemoveGrpMember', data);
    }
    removeThreadChat(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/RemoveThreadChat', data);
    }
    removeAdmin(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/RemoveAdmin', data);
    }
    addAdmin(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/AddAdmin', data);
    }
    revokeGroupAccess(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/RevokeGroupAccess', data);
    }
    revokeUserAccess(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/RevokeUserAccess', data);
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
    uploadGrpLogo(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/UploadGrpLogo', data);
    }
    loadUserPrivateChat(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/LoadUserPrivateChat', data);
    }
    loadBusinessChat(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/LoadBusinessChat', data);
    }
    getUserProfile(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/GetUserProfile', data);
    }
    updateGroup(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/UpdateGroup', data);
    }
    followUser(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/FollowUser', data);
    }
    unFollowUser(data): Observable<any> {
        return this.http.post(environment.serverUrl + 'Chat/UnFollowUser', data);
    }
}
