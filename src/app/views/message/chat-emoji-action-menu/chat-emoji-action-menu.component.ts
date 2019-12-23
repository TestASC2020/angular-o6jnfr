import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from '../../../lib/ng-uikit-pro-standard/free/modals';

@Component({
    selector: 'app-chat-emoji-action-menu',
    templateUrl: './chat-emoji-action-menu.component.html',
    styleUrls: ['./chat-emoji-action-menu.component.scss']
})
export class ChatEmojiActionMenuComponent implements OnInit, OnDestroy {
    @Input() disabled: boolean;
    @Output() emotionEmit: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('popContent') popContent: ModalDirective;
    emotionsList: Array<any> = new Array<any>();
    constructor() { }

    ngOnInit() {
        this.emotionsList = [
            'ahaha.jpg', 'bo_tay.gif', 'bo_tay_2.gif', 'buon_ngu.gif',
            'chan_qua.gif', 'chay_nha.gif', 'cho_5_sao.gif', 'cho_doi.webp',
            'cuoi_sac_sua.gif', 'cute.png', 'dap_mat.gif', 'day_ne.gif',
            'dong_y.gif', 'du_quay.gif', 'gian_du.gif', 'goi_anh_nhe.gif',
            'grr.gif', 'hm.gif', 'khong.gif', 'khong_duoc.gif',
            'le_luoi.gif', 'mat_lua_1.gif', 'ngung.gif', 'nguy_hiem.jpg',
            'nhay_mat.gif', 'noi_gi_cha_hieu.gif', 'nuoc_nhe.gif', 'oh_yeah.gif',
            'oh_yeah_2.gif', 'ok.gif', 'o_o.gif', 'phu_phu.gif', 'sad.png',
            'sao_ta.gif', 'smile.png', 'so_1.gif', 'tam_biet.gif',
            'thich_ghe.gif', 'toi_luon.gif', 'troi_oi.gif', 'yeu_ghe.gif', 'yeu_qua.gif'
        ];
    }

    emotionSend(emotionIndex: number) {
        this.emotionEmit.emit({file: './assets/icon-chat/' + this.emotionsList[emotionIndex]});
        this.popContent.hide();
    }

    ngOnDestroy() {
        this.emotionEmit.complete();
    }
}
