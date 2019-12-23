import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {MessageComponent} from './message.component';
import {MessageRoutingModule} from './message-routing.module';
import {PagerService} from '../../services/pager.service';
import {UtilsService} from '../../services/utils.service';
import {TranslateModule} from '@ngx-translate/core';
import {MDBBootstrapModulesPro, ToastService} from '../../lib/ng-uikit-pro-standard';
import {NgbTabsetModule} from '@ng-bootstrap/ng-bootstrap';
import {PopoverModule} from 'ngx-popover';
import {GroupEditActionMenuComponent} from './group-edit-action-menu/group-edit-action-menu.component';
import {ChatActionMenuComponent} from './chat-action-menu/chat-action-menu.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MessageActionMenuComponent} from './message-action-menu/message-action-menu.component';
import {EmojiActionMenuComponent} from './emoji-action-menu/emoji-action-menu.component';
import {MessageSkypeService} from '../../services/message-skype.service';
import {NgxSpinnerModule} from 'ngx-spinner';
import {CookieService} from 'ngx-cookie';
import {ChatEmojiActionMenuComponent} from './chat-emoji-action-menu/chat-emoji-action-menu.component';
import {UserNotificationActionMenuComponent} from './user-notification-action-menu/user-notification-action-menu.component';

@NgModule({
    declarations: [
        MessageComponent,
        GroupEditActionMenuComponent,
        ChatActionMenuComponent,
        MessageActionMenuComponent,
        EmojiActionMenuComponent,
        ChatEmojiActionMenuComponent,
        UserNotificationActionMenuComponent
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        TranslateModule,
        MessageRoutingModule,
        MDBBootstrapModulesPro.forRoot(),
        NgbTabsetModule,
        NgxSpinnerModule,
        PopoverModule
    ],
    providers: [
        PagerService,
        CookieService,
        UtilsService,
        DatePipe,
        ToastService,
        MessageSkypeService
    ]
})
export class MessageModule { }
