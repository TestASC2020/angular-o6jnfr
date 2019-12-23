import {GENERIC_ENUM_MODEL} from './generic-enums';

export class ChatMemberRole extends GENERIC_ENUM_MODEL {
    private static VALUES: Array<ChatMemberRole> = [];
    public static OWNER = new ChatMemberRole('OWNER', 1, 'MESSAGE.RoleList.Owner', '#6a1b1b');
    public static ADMIN = new ChatMemberRole('ADMIN', 2, 'MESSAGE.RoleList.Admin', '#1c7a0a');
    public static GUEST = new ChatMemberRole('GUEST', 3, 'MESSAGE.RoleList.Guest', '#05c6f8');

    private constructor(key: string, value: number | string, display: string, color: string) {
        super(key, value, display, color, '');
        ChatMemberRole.VALUES.push(this);
    }

    public static valueOf(value: number | undefined | null | string): ChatMemberRole | null {
        if (!value) {
            return ChatMemberRole.GUEST;
        }
        return ChatMemberRole.VALUES.filter( item => item.value === value)[0];
    }

    public static toArray(): Array< any> {
        return ChatMemberRole.VALUES;
    }
}
