import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PagerService} from '../../services/pager.service';
import {UtilsService} from '../../services/utils.service';
import {ModalDirective} from '../../lib/ng-uikit-pro-standard/free/modals';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {UserProfile} from '../../models/user-profile';
import {MessageSkypeService} from '../../services/message-skype.service';
import {DatePipe} from '@angular/common';
import {CookieService} from 'ngx-cookie';
import {ChatMemberRole} from '../../models/chat.member.role';
import {ToastService} from '../../lib/ng-uikit-pro-standard/pro/alerts';
import {TranslateService} from '@ngx-translate/core';


@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, AfterViewInit {
    @ViewChild('seenListModal') seenListModal: ModalDirective;
    @ViewChild('userInfoModal') userInfoModal: ModalDirective;
    @ViewChild('createGroupModal') createGroupModal: ModalDirective;
    @ViewChild('editGroupModal') editGroupModal: ModalDirective;
    @ViewChild('editGroupElementRef') editGroupElementRef: ElementRef;
    @ViewChild('GroupMemberModal') GroupMemberModal: ModalDirective;
    @ViewChild('removeGroupModal') removeGroupModal: ModalDirective;
    @ViewChild('groupMembersModal') groupMembersModal: ModalDirective;
    @ViewChild('findContactModal') findContactModal: ModalDirective;
    @ViewChild('showImageModal') showImageModal: ModalDirective;
    @ViewChild('errorModal') errorModal: ModalDirective;
    @ViewChild('confirmSetAdminModal') confirmSetAdminModal: ModalDirective;
    @ViewChild('confirmBanUnBanModal') confirmBanUnBanModal: ModalDirective;
    @ViewChild('messageElement') messageElement: ElementRef;
    @ViewChild('senderRef') senderRef: ElementRef;
    @ViewChild('selectedGroupMembers') selectedGroupMembers: ElementRef;
    @ViewChild('newGroupFileInput') newGroupFileInput: ElementRef;
    @ViewChild('editGroupFileInput') editGroupFileInput: ElementRef;
    showPreviewArea: boolean = false;
    selectedImages: Array<string> = new Array<string>();
    autoRunIndex: number = 0;
    user: UserProfile;
    items: Array<any> = new Array<any>();
    itemsSeen: Array<any> = new Array<any>();
    itemsGroupMembers: Array<any> = new Array<any>();
    selectedItemSigsInGroupMembers: Array<string> = new Array<string>();
    currentPage: number = 1;
    enableMore: boolean = true;
    itemsBusiness: Array<any> = new Array<any>();
    numFilesLimit: number = 5;
    uploadImageForm: FormGroup;
    newMessageForm: FormGroup;
    newGroupForm: FormGroup;
    editGroupForm: FormGroup;
    createNewGroupAble: boolean = false;
    editGroupAble: boolean = false;
    newGroupSelectedMembers: Array<string> = new Array<string>();
    newGroupSelectedMembersSig: Array<string> = new Array<string>();
    searchTextFind: string = '';
    searchTextCreateGroup: string = '';
    searchTextMenu: string = '';
    message: any = {threads: []};
    statusList: Array<any> = new Array<any>();
    contactStep: number = 1;
    urlUpdate: Array<string> = new Array<string>();
    dataUpdate: Array<string> = new Array<string>();
    fileExtUpdate: Array<string> = new Array<string>();
    item: any = {};
    userProfile: any;
    // progress loading
    error: any;
    uploadResponse = { status: '', message: '', filePath: '' };
    selectedThread: any;
    selectedThreadData: Array<any> = new Array<any>();
    enableMoreMessages: boolean = true;
    enableMoreReplies: boolean = true;
    begin: boolean = true;
    selectedThreadIndex: number = -1;
    selectedMessage: any = null;
    selectedRepy: any = null;
    selectedMessageForSeen: any = null;
    enableMoreSeen: boolean = true;
    searchTextSeen: string = '';
    currentPageSeen: number = 1;
    // For group member list
    groupMembersList: Array<any> = new Array<any>();
    enableMoreMembers: boolean = true;
    searchTextMembers: string = '';
    currentPageMembers: number = 1;
    isBan: boolean = false;
    isAdmin: boolean = false;
    memberToView: any;
    modalNeedToClose: ModalDirective;
    isEdit: boolean = false;

    constructor(private pagerService: PagerService,
                private cookieService: CookieService,
                private formBuilder: FormBuilder,
                private datePipe: DatePipe,
                private translate: TranslateService,
                private toastrService: ToastService,
                private utilsService: UtilsService,
                private service: MessageSkypeService) {
        this.uploadImageForm = new FormGroup({
            files: this.formBuilder.array([])
        });
        this.newMessageForm = new FormGroup({
            msg: new FormControl(''),
            threadSig: new FormControl('')
        });
        this.newGroupForm = new FormGroup({
            logoURL: new FormControl(''),
            logoData: new FormControl(''),
            logoFileExt: new FormControl(''),
            name: new FormControl('')
        });
        this.editGroupForm = new FormGroup({
            logoURL: new FormControl(''),
            logoData: new FormControl(''),
            logoFileExt: new FormControl(''),
            name: new FormControl('')
        });
        this.statusList = [
            {
                id: 'status-online',
                value: 1,
                text: 'Online',
                color: '#2ecc71'
            },
            {
                id: 'status-away',
                value: 2,
                text: 'Away',
                active: true,
                color: '#f1c40f'
            },
            {
                id: 'status-busy',
                value: 3,
                text: 'Busy',
                color: '#e74c3c'
            },
            {
                id: 'status-offline',
                value: 4,
                text: 'Offline',
                color: '#95a5a6'
            }
        ];
    }

    autoGenerateDate() {
        const _this = this;
        if (this.message.threads.length > 0) {
            this.message.threads.forEach(threadMessage => {
                if (threadMessage && threadMessage['message'] && threadMessage['message']['lastMsgDate']) {
                    const timeSpentData = _this.utilsService.timeSpent(threadMessage['message']['lastMsgDate']);
                    if (timeSpentData) {
                        if (timeSpentData.days >= 7) {
                            threadMessage['message'].timeSpent = threadMessage['message']['lastMsgDate'];
                            threadMessage['message'].timeSpentMore = '';
                        } else if (timeSpentData.days > 0) {
                            threadMessage['message'].timeSpent = timeSpentData.days;
                            threadMessage['message'].timeSpentMore = (timeSpentData.days > 1) ? 'MESSAGE.days' : 'MESSAGE.day';
                        } else if (timeSpentData.hours > 0) {
                            threadMessage['message'].timeSpent = timeSpentData.hours;
                            threadMessage['message'].timeSpentMore = (timeSpentData.hours > 1) ? 'MESSAGE.hours' : 'MESSAGE.hour';
                        } else {
                            threadMessage['message'].timeSpent = timeSpentData.minutes;
                            threadMessage['message'].timeSpentMore = (timeSpentData.minutes > 1) ? 'MESSAGE.minutes' : 'MESSAGE.minute';
                        }
                    }
                }
                if (threadMessage.message && threadMessage.message.reply.length > 0) {
                    threadMessage.message.reply.forEach(replyItem => {
                        if (replyItem && replyItem['lastMsgDate']) {
                            const timeSpentDataReply = (replyItem['lastMsgDate']) ?
                                _this.utilsService.timeSpent(replyItem['lastMsgDate']) : null;
                            if (timeSpentDataReply && timeSpentDataReply.days >= 7) {
                                replyItem.timeSpent = replyItem['lastMsgDate'];
                                replyItem.timeSpentMore = '';
                            } else if (timeSpentDataReply && timeSpentDataReply.days > 0) {
                                replyItem.timeSpent = timeSpentDataReply.days;
                                replyItem.timeSpentMore = (timeSpentDataReply.days > 1) ? 'MESSAGE.days' : 'MESSAGE.day';
                            } else if (timeSpentDataReply && timeSpentDataReply.hours > 0) {
                                replyItem.timeSpent = timeSpentDataReply.hours;
                                replyItem.timeSpentMore = (timeSpentDataReply.hours > 1) ? 'MESSAGE.hours' : 'MESSAGE.hour';
                            } else if (timeSpentDataReply) {
                                replyItem.timeSpent = timeSpentDataReply.minutes;
                                replyItem.timeSpentMore = (timeSpentDataReply.minutes > 1) ? 'MESSAGE.minutes' : 'MESSAGE.minute';
                            }
                        }
                    });
                }
            });
        }
        if (this.selectedThreadData.length > 0) {
            this.selectedThreadData.forEach(threadMessage => {
                if (threadMessage && threadMessage['lastMsgDate']) {
                    const timeSpentData = _this.utilsService.timeSpent(threadMessage['lastMsgDate']);
                    if (timeSpentData && timeSpentData.days >= 7) {
                        threadMessage.timeSpent = threadMessage['lastMsgDate'];
                        threadMessage.timeSpentMore = '';
                    } else if (timeSpentData && timeSpentData.days > 0) {
                        threadMessage.timeSpent = timeSpentData.days;
                        threadMessage.timeSpentMore = (timeSpentData.days > 1) ? 'MESSAGE.days' : 'MESSAGE.day';
                    } else if (timeSpentData && timeSpentData.hours > 0) {
                        threadMessage.timeSpent = timeSpentData.hours;
                        threadMessage.timeSpentMore = (timeSpentData.hours > 1) ? 'MESSAGE.hours' : 'MESSAGE.hour';
                    } else {
                        threadMessage.timeSpent = timeSpentData.minutes;
                        threadMessage.timeSpentMore = (timeSpentData.minutes > 1) ? 'MESSAGE.minutes' : 'MESSAGE.minute';
                    }
                }
                if (threadMessage.reply.length > 0) {
                    threadMessage.reply.forEach(replyItem => {
                        if (replyItem) {
                            const timeSpentDataReply = (replyItem['lastMsgDate']) ?
                                _this.utilsService.timeSpent(replyItem['lastMsgDate']) : null;
                            if (timeSpentDataReply && timeSpentDataReply.days >= 7) {
                                replyItem.timeSpent = replyItem['lastMsgDate'];
                                replyItem.timeSpentMore = '';
                            } else if (timeSpentDataReply && timeSpentDataReply.days > 0) {
                                replyItem.timeSpent = timeSpentDataReply.days;
                                replyItem.timeSpentMore = (timeSpentDataReply.days > 1) ? 'MESSAGE.days' : 'MESSAGE.day';
                            } else if (timeSpentDataReply && timeSpentDataReply.hours > 0) {
                                replyItem.timeSpent = timeSpentDataReply.hours;
                                replyItem.timeSpentMore = (timeSpentDataReply.hours > 1) ? 'MESSAGE.hours' : 'MESSAGE.hour';
                            } else if (timeSpentDataReply) {
                                replyItem.timeSpent = timeSpentDataReply.minutes;
                                replyItem.timeSpentMore = (timeSpentDataReply.minutes > 1) ? 'MESSAGE.minutes' : 'MESSAGE.minute';
                            }
                        }
                    });
                }
            });
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

    ngAfterViewInit() {
        this.initDropdownAction();
    }

    ngOnInit() {
        const _this = this;
        setTimeout(() => {
            if (_this.message.threads.length > 0) {
                _this.autoGenerateDate();
            }
        }, 30000);
        if (this.showImageModal) {
            this.showImageModal.onShow.subscribe(resp => {
                setTimeout(() => {
                    if (_this.selectedImages.length > 0) {
                        _this.addUpdateRunIndex(1);
                    }
                }, 3000);
            });
        }
        this.GroupMemberModal.onHide.subscribe(hideEvent => {
            if (_this.editGroupElementRef.nativeElement) {
                _this.editGroupElementRef.nativeElement.setAttribute('style', 'opacity: 1');
            }
        });
        this.createGroupModal.onHide.subscribe(hideEvent => {
            _this.resetCreateNewGroupMembers();
        });
        this.findContactModal.onHide.subscribe(hideEvent => {
            _this.searchTextFind = '';
        });
        _this.service.getPermission();
        _this.service.listenMessage();
        _this.service.geMessages().subscribe(messageRaisedData => {
            const threadChangeIndex = _this.message.threads.map(itThread => itThread.id).indexOf(messageRaisedData.threadId);
            if (threadChangeIndex !== -1) {
                _this.message.threads[threadChangeIndex].message.msg = messageRaisedData.item.msg;
                _this.message.threads[threadChangeIndex].message.lastMsgDate = messageRaisedData.item.lastMsgDate;
            }
            if (_this.selectedThreadData && _this.selectedThread) {
                if (messageRaisedData.parentId) {
                    const messageItemIndex = _this.selectedThreadData.map(itemSelectedMessage => itemSelectedMessage.id)
                        .indexOf(messageRaisedData.parentId);
                    if (messageItemIndex !== -1) {
                        const replyItemIndex = _this.selectedThreadData[messageItemIndex].reply.
                        map(itemSelectedReply => itemSelectedReply.id).indexOf(messageRaisedData.messageId);
                        if (replyItemIndex !== -1) {
                            _this.selectedThreadData[messageItemIndex].reply[replyItemIndex] = messageRaisedData.item;
                        } else {
                            _this.selectedThreadData[messageItemIndex].reply = [messageRaisedData.item,
                                ..._this.selectedThreadData[messageItemIndex].reply];
                        }
                    }
                } else {
                    const messageItemIndex = _this.selectedThreadData.map(itemSelectedMessage => itemSelectedMessage.id)
                        .indexOf(messageRaisedData.messageId);
                    if (messageItemIndex !== -1) {
                        _this.selectedThreadData[messageItemIndex] = messageRaisedData.item;
                    } else {
                        _this.selectedThreadData = [messageRaisedData.item, ..._this.selectedThreadData];
                    }
                }
                setTimeout(function () {
                    const idString = (_this.selectedThread.actorType === 2) ? 'chat-group-mode-area' : 'chat-single-mode-area';
                    const element = document.getElementById(idString);
                    if (element) {
                        _this.scrollSmoothToBottom(element);
                    }
                }, 100);
            }
            _this.autoGenerateDate();
        });
        if (this.cookieService.get('auth')) {
            this.userProfile = JSON.parse(this.cookieService.get('auth'));
        }
        _this.service.loadOrg({}).subscribe(res2 => {
            _this.itemsBusiness = res2['data'];
            _this.service.LoadUserList({}).subscribe(res3 => {
                _this.items = res3['data'];
                _this.itemsGroupMembers = res3['data'];
                _this.updateCounter();
            });
        });
    }

    updateCounter(newThreadSig?: string) {
        const _this = this;
        _this.service.loadUserThread({pageNo: _this.currentPage}).subscribe(res1 => {
            _this.uploadResponse = (res1['data']) ? res1 : null;
            if (res1['data']) {
                _this.uploadResponse = null;
                if (_this.begin) {
                    _this.message.threads = [];
                }
                setTimeout(function () {
                    const temp = (res1['data'] && res1['data'].length > 0) ? res1['data'] : [];
                    if (temp.length === 0) {
                        _this.enableMore = false;
                        const ele = document.getElementById('contacts') as HTMLElement;
                        ele.style.height = 'calc(100% - 160px)';
                        _this.enableMore = false;
                        _this.currentPage = -1;
                    } else {
                        if (temp.length < 20) {
                            _this.enableMore = false;
                            _this.currentPage = -1;
                        } else {
                            _this.enableMore = true;
                        }
                        const arr = temp.map(item => item.signature);
                        _this.service.loadUnSeenCount({threadSigs: arr}).subscribe(unSeenDataResponse => {
                            const unSeenData = unSeenDataResponse['data'];
                            if (unSeenData) {
                                unSeenData.forEach(unSeenDataItem => {
                                    const searchIndex = temp.map(si => si.id).indexOf(unSeenDataItem.threadId);
                                    if (searchIndex !== -1) {
                                        temp[searchIndex].unSeenCount = unSeenDataItem.count;
                                    }
                                });
                                temp.forEach(te => {
                                    te.status = _this.statusList[0].text.toLowerCase();
                                    te.color = _this.statusList[0].color;
                                    // for thread date design
                                    if (te.message && te.message.message && te.message.message.length > 0) {
                                        te.message.msg = te.message.message[0].msg;
                                    }
                                    // end thread date design
                                    if (_this.message.threads.length > 0) {
                                        const index = _this.message.threads.map(iiii => iiii.id).indexOf(te.id);
                                        if (index === -1) {
                                            _this.message.threads.push(te);
                                        } else {
                                            _this.message.threads[index] = te;
                                        }
                                    } else {
                                        _this.message.threads.push(te);
                                    }
                                });
                                if (newThreadSig) {
                                    const findIndex = _this.message.threads.map(u => u.signature).indexOf(newThreadSig);
                                    if (findIndex !== -1) {
                                        _this.selectedThreadIndex = findIndex;
                                        _this.selectedThread = _this.message.threads[findIndex];
                                        _this.message.threads[_this.selectedThreadIndex].active = true;
                                        _this.activeThread(_this.selectedThread, findIndex);
                                    }
                                    _this.autoGenerateDate();
                                    _this.begin = false;
                                } else {
                                    if (_this.selectedThreadIndex !== -1) {
                                        _this.message.threads[_this.selectedThreadIndex].active = true;
                                    }
                                    _this.autoGenerateDate();
                                    _this.begin = false;
                                }
                                if (_this.cookieService.get('chatWith')) {
                                    const userIndex = _this.items.map(v => v.id)
                                        .indexOf(JSON.parse(_this.cookieService.get('chatWith')).userId);
                                    if (userIndex !== -1) {
                                        const user = _this.items[userIndex];
                                        if (user.email !== _this.userProfile.email) {
                                            _this.chatWithUser(user, _this.findContactModal);
                                        }
                                    }
                                }
                                if (_this.cookieService.get('chatWithOrg')) {
                                    const org = {
                                        signature: JSON.parse(_this.cookieService.get('chatWithOrg')).orgSig
                                    };
                                    _this.chatWithOrg(org);
                                }
                            }
                        });
                    }
                }, 1000);
            }
        });
    }

    get getCreateDateInfo() {
        return this.utilsService.getCreateDateInfo;
    }

    activeThread(thread, threadIndex) {
        const _this = this;
        if (thread) {
            const liList = document.querySelectorAll('li.contact');
            for (let i = 0; i < liList.length; i++) {
                (liList[i] as HTMLElement).setAttribute('class', 'contact');
            }
            (liList[threadIndex] as HTMLElement).setAttribute('class', 'contact active');
            _this.message.threads.forEach(thr => {
                thr.active = false;
            });
            _this.message.threads[threadIndex].active = true;
            _this.selectedThreadData = new Array<any>();
            _this.selectedThread = thread;
            _this.selectedThreadIndex = threadIndex;
            _this.updateCurrentThread();
            if (_this.selectedThread.actorType === 2) {
                _this.loadGroupMembers();
            }
            _this.autoGenerateDate();
        }
    }

    updateCurrentThread() {
        const _this = this;
        if (_this.selectedThread) {
            const data = {
                threadSig: _this.selectedThread.signature,
                fromMsgSig: ( _this.selectedThreadData.length > 0) ?
                    _this.selectedThreadData[_this.selectedThreadData.length - 1].signature : null
            };
            this.service.loadMessage(data).subscribe(result => {
                if (result['data']) {
                    _this.newMessageForm.get('threadSig').setValue(_this.selectedThread.signature);
                    const temp = (result['data'] && result['data'].length > 0) ? result['data'] : [];
                    if (temp.length === 0) {
                        _this.enableMoreMessages = false;
                    } else {
                        if (temp.length < 20) {
                            _this.enableMoreMessages = false;
                        } else {
                            _this.enableMoreMessages = true;
                        }
                        temp.forEach(te => {
                            _this.selectedThreadData.push(te);
                        });
                        const sendSeenData = {
                            msgSig: temp.map(t => t.signature)
                        };
                        setTimeout(function () {
                            const idString = (_this.selectedThread.actorType === 2) ? 'chat-group-mode-area' : 'chat-single-mode-area';
                            const element = document.getElementById(idString);
                            if (element) {
                                _this.scrollSmoothToBottom(element);
                            }
                        }, 100);
                        _this.service.setMsgSeen(sendSeenData).subscribe(
                            rr => {
                            },
                            err => {},
                            () => {
                                _this.autoGenerateDate();
                            }
                        );
                    }
                }
            });
        }
    }

    initDropdownAction() {
        if (document.getElementById('profile-img')) {
            document.getElementById('profile-img').addEventListener('click', function (event) {
                if (document.getElementById('status-options')) {
                    const active = document.getElementById('status-options').getAttribute('class');
                    if (active === 'active') {
                        document.getElementById('status-options').setAttribute('class', '');
                    } else {
                        document.getElementById('status-options').setAttribute('class', 'active');
                    }
                }
            });
        }
        if (document.querySelector('.expand-button')) {
            document.querySelector('.expand-button').addEventListener('click', function (event) {
                const active1 = document.getElementById('profile').getAttribute('class');
                if (active1 === 'expanded') {
                    document.getElementById('profile').setAttribute('class', '');
                } else {
                    document.getElementById('profile').setAttribute('class', 'expanded');
                }
                const active2 = document.getElementById('contacts').getAttribute('class');
                if (active2 === 'expanded') {
                    document.getElementById('contacts').setAttribute('class', '');
                } else {
                    document.getElementById('contacts').setAttribute('class', 'expanded');
                }
            });
        }
        if (document.querySelector('#status-options ul')) {
            const ulElement = document.querySelector('#status-options ul');
            if (ulElement.querySelectorAll('li')) {
                const liList = ulElement.querySelectorAll('li');
                for (let i = 0; i < liList.length; i++) {
                    if (liList[i]) {
                        liList[i].addEventListener('click', function (event) {
                            document.getElementById('profile-img').setAttribute('class', '');
                            const elm1 = document.getElementById('status-online');
                            elm1.setAttribute('class', elm1.getAttribute('class').replace('active', ''));
                            const elm2 = document.getElementById('status-away');
                            elm2.setAttribute('class', elm2.getAttribute('class').replace('active', ''));
                            const elm3 = document.getElementById('status-busy');
                            elm3.setAttribute('class', elm3.getAttribute('class').replace('active', ''));
                            const elm4 = document.getElementById('status-offline');
                            elm4.setAttribute('class', elm4.getAttribute('class').replace('active', ''));
                            (liList[i] as HTMLElement)
                                .setAttribute('class', ((liList[i] as HTMLElement).getAttribute('class') + ' active'));
                            if (document.getElementById('status-online').getAttribute('class').indexOf('active') !== -1) {
                                document.getElementById('profile-img')
                                    .setAttribute('class', (document
                                        .getElementById('profile-img').getAttribute('class') + ' online'));
                            } else if (document.getElementById('status-away').getAttribute('class').indexOf('active') !== -1) {
                                document.getElementById('profile-img')
                                    .setAttribute('class', (document
                                        .getElementById('profile-img').getAttribute('class') + ' away'));
                            } else if (document.getElementById('status-busy').getAttribute('class').indexOf('active') !== -1) {
                                document.getElementById('profile-img')
                                    .setAttribute('class', (document
                                        .getElementById('profile-img').getAttribute('class') + ' busy'));
                            } else if (document.getElementById('status-offline').getAttribute('class').indexOf('active') !== -1) {
                                document.getElementById('profile-img')
                                    .setAttribute('class', (document
                                        .getElementById('profile-img').getAttribute('class') + ' offline'));
                            } else {
                                document.getElementById('profile-img').setAttribute('class', '');
                            }
                            const elm = document.getElementById('status-options');
                            elm.setAttribute('class', elm.getAttribute('class').replace('active', ''));
                        });
                    }
                }
            }
        }
    }

    gotoTab(tabId) {
        this.contactStep = tabId;
    }

    chooseFileUploadImage() {
        document.getElementById('fileInputUploadImage').click();
    }

    previewFileUploadImage($event) {
        const _this = this;
        this.urlUpdate = [];
        this.dataUpdate = [];
        this.fileExtUpdate = [];
        let chay = 0;
        const numFiles = $event.target.files.length;
        for (let i = 0; i < numFiles && i < this.numFilesLimit; i++) {
            const file: File = $event.target.files[i];
            const reader: FileReader = new FileReader();
            if (file) {
                reader.onloadend = function (e) {
                    if (e.target && e.target['result']) {
                        chay++;
                        const ext = file.name.split('.');
                        const data = {
                            data: e.target['result'].split(',')[1],
                            fileExt: '.' + ext[ext.length - 1],
                            url: e.target['result']
                        };
                        _this.urlUpdate.push(data.url);
                        _this.dataUpdate.push(data.data);
                        _this.fileExtUpdate.push(data.fileExt);
                        if (chay === numFiles || chay === _this.numFilesLimit) {
                            (document.getElementById('fileInputUploadImage') as HTMLInputElement).value = '';
                            _this.initUploadImageFormData();
                        }
                    }
                };
                reader.readAsDataURL(file);
            }
        }
        (document.getElementById('fileInputUploadImage') as HTMLInputElement).value = '';
    }

    initUploadImageFormData() {
        this.uploadImageForm.controls['files'] = this.formBuilder.array([]);
        if (this.urlUpdate.length > 0) {
            const ctrls = (<FormArray>this.uploadImageForm.controls['files']).controls;
            for (let i = 0; i < this.urlUpdate.length; i++) {
                ctrls.push(this.formBuilder.group({
                    fileExt: new FormControl(this.fileExtUpdate[i]),
                    data: new FormControl(this.dataUpdate[i]),
                    url: new FormControl(this.urlUpdate[i])
                }));
            }
            this.showPreviewArea = true;
        }
    }
    openfindContactModal(item?) {
        this.findContactModal.show();
    }
    opencreateGroupModal(item?) {
        this.createGroupModal.show();
    }
    loadEditMessage($event) {
        this.selectedMessage = $event;
        this.isEdit = true;
        this.newMessageForm.get('msg').setValue($event.msg);
        if (this.messageElement) {
            this.messageElement.nativeElement.focus();
        }
    }
    loadEditReplyMessage(message, $event) {
        this.isEdit = true;
        this.selectedMessage = message;
        this.selectedRepy = $event;
        this.newMessageForm.get('msg').setValue($event.msg);
        if (this.messageElement) {
            this.messageElement.nativeElement.focus();
        }
    }
    openseenList($event) {
        this.selectedMessageForSeen = $event;
        const _this = this;
        _this.itemsSeen = [];
        _this.currentPageSeen = 1;
        this.service.loadSeenUser({msgSig: _this.selectedMessageForSeen.signature, pageNo: _this.currentPageSeen}).subscribe(resp => {
            if (resp['data']) {
                const temp = (resp['data'] && resp['data'].length > 0) ? resp['data'] : [];
                if (temp.length === 0) {
                    _this.enableMoreSeen = false;
                    _this.currentPageSeen = -1;
                } else {
                    if (temp.length < 20) {
                        _this.enableMoreSeen = false;
                        _this.currentPageSeen = -1;
                    } else {
                        _this.enableMoreSeen = true;
                    }
                    temp.forEach(te => {
                        const index = _this.itemsSeen.map(u => u.email).indexOf(te.email);
                        if (index !== -1) {
                            _this.itemsSeen.push(te);
                        }
                    });
                }
                _this  .seenListModal.show();
            }
        });
    }
    checkSearch(item) {
        const _this = this;
        if (this.searchTextFind === '') {
            return true;
        } else {
            return (item.name && item.name.toLowerCase().indexOf(_this.searchTextFind.toLowerCase()) >= 0);
        }
    }
    checkSearchName(contact) {
        const _this = this;
        if (this.searchTextMenu === '') {
            return true;
        } else {
            return (contact.actor && contact.actor.name &&
                contact.actor.name.toLowerCase().indexOf(_this.searchTextMenu.toLowerCase()) >= 0);
        }
    }
    checkSearchCreateGroup(item) {
        const _this = this;
        if (this.searchTextCreateGroup === '') {
            return true;
        } else {
            return (item.name && item.name.toLowerCase().indexOf(_this.searchTextCreateGroup.toLowerCase()) >= 0);
        }
    }

    checkSearchEditGroup(item) {
        const _this = this;
        if (this.searchTextMembers === '') {
            return true;
        } else {
            return (item.name && item.name.toLowerCase().indexOf(_this.searchTextMembers.toLowerCase()) >= 0);
        }
    }

    loadRecords() {
        const _this = this;
        if (this.currentPage !== -1) {
            this.currentPage++;
            this.updateCounter();
        } else {
            this.enableMore = false;
            const ele = document.getElementById('contacts') as HTMLElement;
            ele.style.height = 'calc(100% - 160px)';
            _this.uploadResponse = null;
        }
    }

    loadMoreRecords() {
        this.loadRecords();
    }

    loadSeenRecords() {
        const _this = this;
        if (this.enableMoreSeen && this.currentPageSeen !== -1) {
            this.currentPageSeen++;
            const data = {
                msgSig: _this.selectedMessageForSeen.signature,
                pageNo: this.currentPageSeen
            };
            this.service.loadSeenUser(data).subscribe(res1 => {
                if (res1['data']) {
                    const temp = (res1['data'] && res1['data'].length > 0) ? res1['data'] : [];
                    if (temp.length === 0) {
                        _this.enableMoreSeen = false;
                        _this.currentPageSeen = -1;
                    } else {
                        if (temp.length < 20) {
                            _this.enableMoreSeen = false;
                            _this.currentPageSeen = -1;
                        } else {
                            _this.enableMoreSeen = true;
                        }
                        temp.forEach(te => {
                            _this.itemsSeen.push(te);
                        });
                    }
                }
            });
        } else {
            this.enableMoreSeen = false;
        }
    }

    loadMoreSeenRecords() {
        this.loadSeenRecords();
    }

    loadMessagesRecords() {
        const _this = this;
        if (this.enableMoreMessages) {
            const data = {
                threadSig: _this.selectedThread.signature,
                fromMsgSig: _this.selectedThreadData[_this.selectedThreadData.length - 1].signature
            };
            this.service.loadMessage(data).subscribe(res1 => {
                if (res1['data']) {
                    const temp = (res1['data'] && res1['data'].length > 0) ? res1['data'] : [];
                    if (temp.length === 0) {
                        _this.enableMoreMessages = false;
                    } else {
                        if (temp.length < 20) {
                            _this.enableMoreMessages = false;
                        } else {
                            _this.enableMoreMessages = true;
                        }
                        temp.forEach(te => {
                            _this.selectedThreadData.push(te);
                        });
                        const sendSeenData = {
                            msgSig: temp.map(t => t.signature)
                        };
                        _this.service.setMsgSeen(sendSeenData).subscribe(
                            rr => {
                            },
                            err => {},
                            () => {
                                _this.autoGenerateDate();
                            }
                        );
                    }
                }
            });
        }
    }

    loadMoreMessagesRecords() {
        this.loadMessagesRecords();
    }

    loadReplyRecords(message: any, reply: any) {
        const _this = this;
        if (this.enableMoreReplies) {
            const data = {
                msgSig: message.signature,
                fromMsgSig: reply.signature
            };
            this.service.loadReply(data).subscribe(resp => {
                if (resp['data']) {
                    const temp = (resp['data'] && resp['data'].length > 0) ? resp['data'] : [];
                    if (temp.length === 0) {
                        _this.enableMoreReplies = false;
                    } else {
                        if (temp.length < 20) {
                            _this.enableMoreReplies = false;
                        } else {
                            _this.enableMoreReplies = true;
                        }
                        const messageIndex = _this.selectedThreadData.map(sl => sl.id).indexOf(message.id);
                        temp.forEach(te => {
                            _this.selectedThreadData[messageIndex].reply.push(te);
                        });
                        const sendSeenData = {
                            msgSig: temp.map(t => t.signature)
                        };
                        _this.service.setMsgSeen(sendSeenData).subscribe(rr => {
                        });
                    }
                }
            });
        }
    }

    loadMoreReplyRecords(message: any, reply: any) {
        this.loadReplyRecords(message, reply);
    }

    onKeySendMessage($event) {
        const _this = this;
        if ($event.keyCode === 8 && $event.target.value === '') {
            this.resetSender();
        }
        if ($event.keyCode === 13) {
            _this.sendMessage();
        }
    }

    scrollSmoothToBottom (e) {
        e.scrollTop = e.scrollHeight - e.clientHeight;
    }

    showImage(arr, u) {
        this.selectedImages = [];
        for (let k = 0; k < arr.length; k++) {
            const imageURL = (arr[k].url) ?
                arr[k].url : '../../../assets/img/user-avatar.png';
            this.selectedImages.push(imageURL);
        }
        this.autoRunIndex = u;
        this.showImageModal.show();
    }

    showReplyImage(arr, u) {
        this.showImage(arr, u);
    }

    resetSender() {
        const _this = this;
        _this.showPreviewArea = false;
        _this.newMessageForm.get('msg').reset();
        _this.urlUpdate = [];
        _this.dataUpdate = [];
        _this.fileExtUpdate = [];
        _this.selectedMessage = null;
        _this.selectedRepy = null;
        this.uploadImageForm.reset();
        if (this.senderRef) {
            this.senderRef.nativeElement.innerText = '';
            this.senderRef.nativeElement.style.display = 'none';
        }
        this.isEdit = false;
    }

    processSendMessage(result: any, urlUpdate: Array<string>, fileExtUpdate: Array<string>, dataUpdate: Array<string>) {
        const _this = this;
        if (result['data']) {
            const sendSeenData = {
                msgSig: [result['data'].signature]
            };
            if (!this.isEdit && urlUpdate.length > 0 && result['data']['files'].length === urlUpdate.length) {
                urlUpdate.forEach(urlUp => {
                    const tempIndex = urlUpdate.indexOf(urlUp);
                    result['data']['files'][tempIndex].url = urlUp;
                    const data2 = {
                        data: dataUpdate[tempIndex],
                        fileExt: fileExtUpdate[tempIndex],
                        signature: result['data']['files'][tempIndex].signature,
                        msgSig: result['data'].signature
                    };
                    _this.service.addFile(data2).subscribe(resp3 => {
                    });
                });
            }
            _this.service.setMsgSeen(sendSeenData).subscribe(rr => {
            });
        }
    }

    resetData() {
        this.showPreviewArea = false;
        this.newMessageForm.get('msg').reset();
        this.urlUpdate = [];
        this.dataUpdate = [];
        this.fileExtUpdate = [];
        this.selectedMessage = null;
        this.uploadImageForm.reset();
        if (this.senderRef) {
            this.senderRef.nativeElement.innerText = '';
            this.senderRef.nativeElement.style.display = 'none';
        }
    }

    sendMessage() {
        const _this = this;
        const dataFiles = [];
        if (this.urlUpdate.length > 0) {
            for (let i = 0; i < this.urlUpdate.length; i++) {
                dataFiles.push({
                    fileExt: this.fileExtUpdate[i]
                });
            }
        }
        const cloneData = {
            urlUpdate: [],
            fileExtUpdate: [],
            dataUpdate: []
        };
        _this.urlUpdate.forEach(urlUp => {
            const tempIndex = _this.urlUpdate.indexOf(urlUp);
            cloneData.urlUpdate.push(_this.urlUpdate[tempIndex]);
            cloneData.fileExtUpdate.push(_this.fileExtUpdate[tempIndex]);
            cloneData.dataUpdate.push(_this.dataUpdate[tempIndex]);
        });
        if (!this.selectedMessage) {
            const data = {
                msg: _this.newMessageForm.get('msg').value,
                threadSig: _this.newMessageForm.get('threadSig').value
            };
            if (dataFiles.length > 0) {
                data['files'] = dataFiles;
            }
            _this.resetData();
            _this.service.addMessage(data).subscribe(result => {
                _this.processSendMessage(result, cloneData.urlUpdate, cloneData.fileExtUpdate, cloneData.dataUpdate);
            });
        } else if (this.isEdit) {
            const data = {
                signature: '',
                info: _this.newMessageForm.get('msg').value
            };
            if (!_this.selectedRepy) {
                data.signature = _this.selectedMessage.signature;
            } else {
                data.signature = _this.selectedRepy.signature;
            }
            _this.resetData();
            _this.service.updateMessage(data).subscribe(
                result => {
                    _this.isEdit = false;
                    _this.processSendMessage(result, cloneData.urlUpdate, cloneData.fileExtUpdate, cloneData.dataUpdate);
                },
                err => {
                    _this.isEdit = false;
                }
            );
        } else {
            const sender = (_this.senderRef.nativeElement.innerText) ? (_this.senderRef.nativeElement.innerText + ': ') : '';
            const data = {
                msgSig: _this.selectedMessage.signature,
                msg: sender + _this.newMessageForm.get('msg').value
            };
            if (dataFiles.length > 0) {
                data['files'] = dataFiles;
            }
            _this.resetData();
            this.service.addReply(data).subscribe(result => {
                _this.processSendMessage(result, cloneData.urlUpdate, cloneData.fileExtUpdate, cloneData.dataUpdate);
            });
        }
    }

    replyThisMessage(message: any) {
        this.selectedMessage = message;
        this.newMessageForm.get('msg').setValue(' ');
        if (this.senderRef) {
            this.senderRef.nativeElement.style.display = 'block';
            this.senderRef.nativeElement.innerText = message.user.name;
        }
        if (this.messageElement) {
            this.messageElement.nativeElement.focus();
        }
    }

    removeUploadImage(rowIndex: number) {
        const control = (<FormArray>this.uploadImageForm.controls['files']);
        if (control.controls[rowIndex]['controls']['url']) {
            control.removeAt(rowIndex);
            this.urlUpdate.splice(rowIndex, 1);
            this.dataUpdate.splice(rowIndex, 1);
            this.fileExtUpdate.splice(rowIndex, 1);
        }
    }

    sendEmotion(item) {
        const _this = this;
        this.utilsService.loadImage(item.file).subscribe(emotionResp => {
            const dataFiles = [{fileExt: emotionResp.fileExt}];
            _this.urlUpdate =  [emotionResp.url];
            _this.fileExtUpdate = [emotionResp.fileExt];
            _this.dataUpdate = [emotionResp.data];
            const cloneData = {
                urlUpdate: [],
                fileExtUpdate: [],
                dataUpdate: []
            };
            _this.urlUpdate.forEach(urlUp => {
                const tempIndex = _this.urlUpdate.indexOf(urlUp);
                cloneData.urlUpdate.push(_this.urlUpdate[tempIndex]);
                cloneData.fileExtUpdate.push(_this.fileExtUpdate[tempIndex]);
                cloneData.dataUpdate.push(_this.dataUpdate[tempIndex]);
            });
            if (!this.selectedMessage) {
                const data = {
                    msg: '',
                    threadSig: _this.newMessageForm.get('threadSig').value
                };
                if (dataFiles.length > 0) {
                    data['files'] = dataFiles;
                }
                _this.resetData();
                _this.service.addMessage(data).subscribe(result => {
                    _this.processSendMessage(result, cloneData.urlUpdate, cloneData.fileExtUpdate, cloneData.dataUpdate);
                });
            } else {
                const sender = (_this.senderRef.nativeElement.innerText) ? (_this.senderRef.nativeElement.innerText + ': ') : '';
                const data = {
                    msgSig: _this.selectedMessage.signature,
                    msg: ''
                };
                if (dataFiles.length > 0) {
                    data['files'] = dataFiles;
                }
                _this.resetData();
                this.service.addReply(data).subscribe(result => {
                    _this.processSendMessage(result, cloneData.urlUpdate, cloneData.fileExtUpdate, cloneData.dataUpdate);
                });
            }
        });
    }

    // begin - new group form
    chooseNewGroupFileUploadImage() {
        this.newGroupFileInput.nativeElement.click();
    }

    previewNewGroupFileUploadImage($event) {
        const _this = this;
        const file: File = $event.target.files[0];
        const reader: FileReader = new FileReader();
        if (file) {
            reader.onloadend = function (e) {
                if (e.target && e.target['result']) {
                    const ext = file.name.split('.');
                    const data = {
                        data: e.target['result'].split(',')[1],
                        fileExt: '.' + ext[ext.length - 1],
                        url: e.target['result']
                    };
                    _this.newGroupForm.get('logoData').setValue(data.data);
                    _this.newGroupForm.get('logoFileExt').setValue(data.fileExt);
                    _this.newGroupForm.get('logoURL').setValue(data.url);
                    _this.newGroupFileInput.nativeElement.value = '';
                }
            };
            reader.readAsDataURL(file);
        }
    }

    checkCreatable() {
        if (this.newGroupForm.get('name').value && this.newGroupSelectedMembersSig.length > 0) {
            this.createNewGroupAble = true;
        } else {
            this.createNewGroupAble = false;
        }
    }

    updateNewGroupMembers(memberIndex: number) {
        const element = document.getElementById('newGroupMember_' + memberIndex) as HTMLInputElement;
        if (element) {
            const index = this.newGroupSelectedMembersSig.indexOf(element.value);
            if (index === -1) {
                this.newGroupSelectedMembersSig.push(element.value);
                this.newGroupSelectedMembers.push(this.getMemberNameBySignature(element.value));
            } else {
                this.newGroupSelectedMembers.splice(index, 1);
                this.newGroupSelectedMembersSig.splice(index, 1);
            }
            this.selectedGroupMembers.nativeElement.innerHTML = this.shortString(this.newGroupSelectedMembers.join(', '), 50);
            this.selectedGroupMembers.nativeElement.setAttribute('title', this.newGroupSelectedMembers.join(', '));
        }
        this.checkCreatable();
    }

    updateGroupMembers(memberIndex: number) {
        const element = document.getElementById('GroupMember_' + memberIndex) as HTMLInputElement;
        if (element) {
            const index = this.selectedItemSigsInGroupMembers.indexOf(element.value);
            if (index === -1) {
                this.selectedItemSigsInGroupMembers.push(element.value);
            } else {
                this.selectedItemSigsInGroupMembers.splice(index, 1);
            }
        }
    }

    getMemberNameBySignature(sig: string) {
        const index = this.items.map(item => item.signature).indexOf(sig);
        if (index !== -1) {
            return this.items[index].name;
        }
        return this.items[0].name;
    }

    createNewGroup() {
        const _this = this;
        const userIndex = this.groupMembersList.map(u => u.email).indexOf(this.userProfile.email);
        if (userIndex !== -1) {
            if (this.newGroupSelectedMembersSig.filter(u => u === this.groupMembersList[userIndex].signature).length < 0) {
                this.newGroupSelectedMembersSig.push(this.groupMembersList[userIndex].signature);
            }
        }
        const data = {
            name: this.newGroupForm.get('name').value,
            memSigs: this.newGroupSelectedMembersSig
        };
        this.service.addGroup(data).subscribe(resp => {
            const dataRsp = resp['data'];
            dataRsp.actorType = 2;
            dataRsp.memCount = data.memSigs.length;
            dataRsp.message = '';
            dataRsp.actor = {
                name: data.name
            };
            if (_this.newGroupForm.get('logoData').value) {
                const dataSend = {
                    data: _this.newGroupForm.get('logoData').value,
                    fileExt: _this.newGroupForm.get('logoFileExt').value,
                    threadSig: resp['data'].signature
                };
                _this.service.uploadGrpLogo(dataSend).subscribe(result => {
                    _this.newGroupForm.reset();
                    _this.createGroupModal.hide();
                    dataRsp.actor.avatarURL = result['data']['data'];
                    _this.message.threads = [dataRsp, ..._this.message.threads];
                });
            } else {
                _this.createGroupModal.hide();
                _this.message.threads = [dataRsp, ..._this.message.threads];
            }
        });
    }

    resetCreateNewGroupMembers() {
        for (let i = 0; i < this.items.length; i++) {
            const element = document.getElementById('newGroupMember_' + i) as HTMLInputElement;
            if (element) {
                element.checked = false;
            }
        }
        this.selectedGroupMembers.nativeElement.innerHTML = '';
        this.newGroupSelectedMembersSig = [];
        this.newGroupSelectedMembers = [];
        if (this.newGroupForm) {
            this.newGroupForm.reset();
        }
    }

    cancelCreateNewGroup() {
        this.createGroupModal.hide();
    }

    get shortString() {
        return this.utilsService.shortString;
    }
    // end   - new group form
    // begin - edit group form
    updateAdmin(member: any, value: boolean) {
        this.memberToView = member;
        this.isAdmin = value;
        this.confirmSetAdminModal.show();
    }

    ConfirmSetAdmin() {
        if (this.selectedThread) {
            const _this = this;
            const dataSend = {
                userSig: _this.memberToView.signature,
                threadSig: _this.selectedThread.signature
            };
            _this.service.addAdmin(dataSend).subscribe(result => {
                const arr = _this.groupMembersList.filter(it => it.id === _this.memberToView.id);
                if (arr.length > 0) {
                    arr.forEach(arItem => {
                        arItem.role = 2;
                    });
                }
                _this.confirmSetAdminModal.hide();
            });
        }
    }

    ConfirmUnSetAdmin() {
        if (this.selectedThread) {
            const _this = this;
            const dataSend = {
                userSig: _this.memberToView.signature,
                threadSig: _this.selectedThread.signature
            };
            _this.service.removeAdmin(dataSend).subscribe(result => {
                const arr = _this.groupMembersList.filter(it => it.id === _this.memberToView.id);
                if (arr.length > 0) {
                    arr.forEach(arItem => {
                        arItem.role = 3;
                    });
                }
                _this.confirmSetAdminModal.hide();
            });
        }
    }

    removeGroupModalConfirm(thread: any, modal?: ModalDirective) {
        this.selectedThread = thread;
        if (modal) {
            this.modalNeedToClose = modal;
        } else {
            this.modalNeedToClose = null;
        }
        this.removeGroupModal.show();
    }

    removeGroup() {
        const _this = this;
        if (this.selectedThread) {
            const dataSend = {
                threadSig: [_this.selectedThread.signature]
            };
            _this.service.removeThreadChat(dataSend).subscribe(
                result => {
                    if (_this.modalNeedToClose) {
                        _this.modalNeedToClose.hide();
                    }
                    const indx = _this.message.threads.map(ii => ii.id).indexOf(this.selectedThread.id);
                    _this.removeGroupModal.hide();
                    _this.selectedThread = null;
                    _this.selectedThreadIndex = -1;
                    _this.selectedThreadData = [];
                    _this.message.threads.splice(indx, 1);
                },
                err => {
                    _this.removeGroupModal.hide();
                    _this.error = {
                        text: 'MESSAGE.NotAllow',
                        action: (this.selectedThread.actorType === 2) ? 'MESSAGE.NameList.ExitGroup' : 'MESSAGE.NameList.Delete'
                    };
                    _this.errorModal.show();
                }
            );
        }
    }

    removeMember(member: any) {
        if (this.selectedThread) {
            const _this = this;
            const dataSend = {
                memSigs: [member.signature],
                threadSig: _this.selectedThread.signature
            };
            _this.service.removeGrpMember(dataSend).subscribe(result => {
                _this.selectedThread.memCount--;
                const index = _this.groupMembersList.map(u => u.signature).indexOf(member.signature);
                if (index !== -1) {
                    _this.groupMembersList.splice(index, 1);
                }
            });
        }
    }

    ConfirmBan() {
        const data = {
            threadSig: this.selectedThread.signature,
            userSig: this.memberToView.signature
        };
        this.service.banUser(data).subscribe(result => {
            const arr = this.groupMembersList.filter(it => it.id === this.memberToView.id);
            if (arr.length > 0) {
                arr.forEach(arItem => {
                    arItem.settings = 2;
                });
            }
            this.memberToView = null;
            this.confirmBanUnBanModal.hide();
        });
    }

    ConfirmUnBan() {
        const data = {
            threadSig: this.selectedThread.signature,
            userSig: this.memberToView.signature
        };
        this.service.unBanUser(data).subscribe(result => {
            const arr = this.groupMembersList.filter(it => it.id === this.memberToView.id);
            if (arr.length > 0) {
                arr.forEach(arItem => {
                    arItem.settings = 0;
                });
            }
            this.memberToView = null;
            this.confirmBanUnBanModal.hide();
        });
    }

    loadGroupMembers() {
        this.service.loadGrpMember({
            pageNo: this.currentPageMembers,
            threadSig: this.selectedThread.signature
        }).subscribe(
            result => {
                const temp = (result['data'] && result['data'].length > 0) ? result['data'] : [];
                if (temp.length === 0) {
                    this.enableMoreMembers = false;
                    this.currentPageMembers = -1;
                } else {
                    const len = this.groupMembersList.length;
                    temp.forEach(te => {
                        if (this.groupMembersList.map(m => m.id).indexOf(te.id) < 0) {
                            this.groupMembersList.push(te);
                        }
                    });
                    if (len === this.groupMembersList.length) {
                        this.enableMoreMembers = false;
                    }
                }
            },
            err => {
                this.error = {
                    text: 'Load More Group Members List error: ' + err.text
                };
                this.errorModal.show();
            }
        );
    }

    loadMoreRecordsMembers() {
        this.loadRecordsMembers();
    }

    loadRecordsMembers() {
        if (this.currentPageMembers !== -1) {
            this.currentPageMembers++;
            this.loadGroupMembers();
        } else {
            this.enableMoreMembers = false;
        }
    }

    openConfirmBan_Unban(item, isBan) {
        this.isBan = isBan;
        this.memberToView = item;
        this.confirmBanUnBanModal.show();
    }

    chooseEditGroupFileUploadImage() {
        this.editGroupFileInput.nativeElement.click();
    }

    previewEditGroupFileUploadImage($event) {
        const _this = this;
        const file: File = $event.target.files[0];
        const reader: FileReader = new FileReader();
        if (file) {
            reader.onloadend = function (e) {
                if (e.target && e.target['result']) {
                    const ext = file.name.split('.');
                    const data = {
                        data: e.target['result'].split(',')[1],
                        fileExt: '.' + ext[ext.length - 1],
                        url: e.target['result']
                    };
                    const dataSend = {
                        data: data.data,
                        fileExt: data.fileExt,
                        threadSig: _this.selectedThread.signature
                    };
                    _this.service.uploadGrpLogo(dataSend).subscribe(result => {
                        _this.editGroupForm.get('logoData').setValue(data.data);
                        _this.editGroupForm.get('logoFileExt').setValue(data.fileExt);
                        _this.editGroupForm.get('logoURL').setValue(data.url);
                        _this.editGroupFileInput.nativeElement.value = '';
                        _this.selectedThread.actor.avatarURL = result['data'];
                        const indx = _this.message.threads.map(iiiii => iiiii.signature).indexOf(_this.selectedThread.signature);
                        _this.message.threads[indx]['actor']['avatarURL'] = result['data'];
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    }

    checkEditable() {
        if (this.editGroupForm.get('name').value) {
            this.editGroupAble = true;
        } else {
            this.editGroupAble = false;
        }
    }

    checkEditRole() {
        if (this.groupMembersList.length > 0) {
            const itemIndex = this.groupMembersList.map(u => u.email).indexOf(this.userProfile.email);
            if (itemIndex !== -1 && this.groupMembersList[itemIndex].role !== 3) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    getRole() {
        if (this.groupMembersList.length > 0) {
            const itemIndex = this.groupMembersList.map(u => u.email).indexOf(this.userProfile.email);
            if (itemIndex !== -1) {
                return this.groupMembersList[itemIndex].role;
            } else {
                return JSON.parse(ChatMemberRole.GUEST.getValue().toString());
            }
        }
        return JSON.parse(ChatMemberRole.GUEST.getValue().toString());
    }

    updateGroup() {
        const _this = this;
        const data = {
            name: this.editGroupForm.get('name').value,
            threadSig: this.selectedThread.signature
        };
        this.service.updateGroup(data).subscribe(resp => {
            const groupIndex = _this.message.threads.map(u => u.signature).indexOf(data.threadSig);
            _this.selectedThread['actor']['name'] = data.name;
            _this.message.threads[groupIndex]['actor']['name'] = data.name;
        });
    }

    initEditGroupForm() {
        if (this.selectedThread) {
            this.editGroupForm.get('name').setValue(this.selectedThread.actor.name);
            this.editGroupForm.get('logoURL').setValue(this.selectedThread.actor.avatarURL);
            this.editGroupModal.show();
        }
    }
    // end - edit group form
    get ChatMemberRole() {
        return ChatMemberRole;
    }
    loadMoreGroup() {
        if (this.currentPage !== -1) {
            this.currentPage++;
            this.service.loadGrpMember({pageNo: this.currentPageMembers,
                threadSig: this.selectedThread.signature}).subscribe(result => {
                const temp = (result['data'] && result['data'].length > 0) ? result['data'] : [];
                if (temp.length === 0) {
                    this.enableMore = false;
                    this.currentPage = -1;
                } else {
                    temp.forEach(te => {
                        this.items.push(te);
                    });
                }
            });
        } else {
            this.enableMore = false;
        }
    }

    // begin - chat with user
    chatWithUser(user: any, modal: ModalDirective) {
        const data = {
            userSig: user.signature
        };
        this.service.loadUserPrivateChat(data).subscribe(resp => {
            const temp = resp['data'];
            temp.status = this.statusList[0].text.toLowerCase();
            if (this.message.threads.map(u => u.id).indexOf(temp.id) === -1) {
                this.message.threads = [resp['data'], ...this.message.threads];
                this.selectedThread = this.message.threads[0];
                this.activeThread(this.selectedThread, 0);
            } else {
                const ind = this.message.threads.map(u => u.id).indexOf(temp.id);
                this.selectedThread = this.message.threads[ind];
                this.activeThread(this.selectedThread, ind);
            }
            if (modal) {
                modal.hide();
            }
        });
    }
    // end - chat with user

    // begin - chat with org
    chatWithOrg(org: any, modal?: ModalDirective) {
        const data = {
            orgSig: org.signature
        };
        this.service.loadBusinessChat(data).subscribe(resp => {
            const temp = resp['data'];
            temp.status = this.statusList[0].text.toLowerCase();
            if (this.message.threads.map(u => u.id).indexOf(temp.id) === -1) {
                this.message.threads = [resp['data'], ...this.message.threads];
                this.selectedThread = this.message.threads[0];
                this.activeThread(this.selectedThread, 0);
            } else {
                const ind = this.message.threads.map(u => u.id).indexOf(temp.id);
                this.selectedThread = this.message.threads[ind];
                this.activeThread(this.selectedThread, ind);
            }
            if (modal) {
                modal.hide();
            }
        });
    }
    // end - chat with org
    loadUserInfo(thread: any) {
        const _this = this;
        const dataSend = {
            threadSig: thread.signature,
            userSig: thread.actor.signature
        };
        this.service.getUserProfile(dataSend).subscribe(resp => {
            _this.memberToView = resp['data'];
            _this.memberToView.signature = dataSend.userSig;
            _this.userInfoModal.show();
        });
    }

    loadUserInfo2(user: any) {
        const _this = this;
        this.memberToView = user;
        _this.userInfoModal.show();
    }

    checkRemove() {
        if (this.groupMembersList.length > 0) {
            const itemIndex = this.groupMembersList.map(u => u.email).indexOf(this.userProfile.email);
            if (itemIndex !== -1 && this.groupMembersList[itemIndex].role !== 3) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    followMe(user: any) {
        this.service.followUser({userSig: user.signature}).subscribe(
            resp => {
                this.translate.get('MESSAGE.NameList.Followed_user').subscribe(
                    followText => {
                        this.translate.get('MESSAGE.NameList.DoActionSuccess',
                            {
                                color: 'action-success',
                                action: followText}
                        ).subscribe(resultMessage => {
                            this.memberToView.settings = 1;
                            resultMessage = resultMessage.replace('<span class=\'action-success\'>', '');
                            resultMessage = resultMessage.replace('</span>', '');
                            this.toastrService.success(resultMessage);
                            const elem = document.querySelector('#notificationNail').getBoundingClientRect();
                            (document.querySelector('#toast-container') as HTMLElement).style.top = elem.bottom + 'px';
                            (document.querySelector('#toast-container') as HTMLElement).style.left = (elem.left + 35) + 'px';
                        });
                    });
            },
            err => {
                this.translate.get('MESSAGE.NameList.Followed_user').subscribe(
                    followText => {
                        this.translate.get('MESSAGE.NameList.DoActionFailed',
                            {
                                color: 'action-failed',
                                action: followText}
                        ).subscribe(resultMessage => {
                            resultMessage = resultMessage.replace('<span class=\'action-failed\'>', '');
                            resultMessage = resultMessage.replace('</span>', '');
                            this.toastrService.error(resultMessage);
                            const elem = document.querySelector('#notificationNail').getBoundingClientRect();
                            (document.querySelector('#toast-container') as HTMLElement).style.top = elem.bottom + 'px';
                            (document.querySelector('#toast-container') as HTMLElement).style.left = (elem.left + 35) + 'px';
                        });
                    });
            }
        );
    }

    unFollowMe(user: any) {
        this.service.unFollowUser({userSig: user.signature}).subscribe(
            resp => {
                this.translate.get('MESSAGE.NameList.UnFollowed_user').subscribe(
                    unFollowText => {
                        this.translate.get('MESSAGE.NameList.DoActionSuccess',
                            {
                                color: 'action-success',
                                action: unFollowText}
                        ).subscribe(resultMessage => {
                            this.memberToView.settings = 0;
                            resultMessage = resultMessage.replace('<span class=\'action-success\'>', '');
                            resultMessage = resultMessage.replace('</span>', '');
                            this.toastrService.success(resultMessage);
                            const elem = document.querySelector('#notificationNail').getBoundingClientRect();
                            (document.querySelector('#toast-container') as HTMLElement).style.top = elem.bottom + 'px';
                            (document.querySelector('#toast-container') as HTMLElement).style.left = (elem.left + 35) + 'px';
                        });
                    });
            },
            err => {
                this.translate.get('MESSAGE.NameList.UnFollowed_user').subscribe(
                    unFollowText => {
                        this.translate.get('MESSAGE.NameList.DoActionFailed',
                            {
                                color: 'action-failed',
                                action: unFollowText}
                        ).subscribe(resultMessage => {
                            resultMessage = resultMessage.replace('<span class=\'action-failed\'>', '');
                            resultMessage = resultMessage.replace('</span>', '');
                            this.toastrService.error(resultMessage);
                            const elem = document.querySelector('#notificationNail').getBoundingClientRect();
                            (document.querySelector('#toast-container') as HTMLElement).style.top = elem.bottom + 'px';
                            (document.querySelector('#toast-container') as HTMLElement).style.left = (elem.left + 35) + 'px';
                        });
                    });
            }
        );
    }

    showGroupMember() {
        if (this.editGroupElementRef.nativeElement) {
            this.editGroupElementRef.nativeElement.setAttribute('style', 'opacity: 0');
        }
        // loai bo nhung user co trong groupMembersList ra khoi itemsGroupMembers
        if (this.groupMembersList.length > 0) {
            this.groupMembersList.forEach(item => {
                const index = this.itemsGroupMembers.map(u => u.email).indexOf(item.email);
                if (index !== -1) {
                    this.itemsGroupMembers.splice(index, 1);
                }
            });
        }
        this.GroupMemberModal.show();
    }

    updateSelectedItemsInGroupMember() {
        // cap nhat members vao groupMembersList
        const _this = this;
        if (this.selectedItemSigsInGroupMembers.length > 0) {
            const dataSend = {
                memSigs: this.selectedItemSigsInGroupMembers,
                threadSig: this.selectedThread.signature};
            this.service.addGrpMember(dataSend).subscribe( resp => {
                _this.selectedItemSigsInGroupMembers.forEach(itemSig => {
                    const index = _this.itemsGroupMembers.map(u => u.signature).indexOf(itemSig);
                    if (index !== -1) {
                        _this.groupMembersList.push(_this.itemsGroupMembers[index]);
                    }
                });
                _this.GroupMemberModal.hide();
            });
        }
    }
}
