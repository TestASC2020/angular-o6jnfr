import {GENERIC_ENUM_MODEL} from './generic-enums';

export class ORG_USER_ROLES extends GENERIC_ENUM_MODEL {
    private static VALUES: Array<ORG_USER_ROLES> = [];

    public static MEMBER = new ORG_USER_ROLES('MEMBER', 1, 'MESSAGE.MEMBER', '#3570ef');
    public static ADMIN = new ORG_USER_ROLES('ADMIN', 2, 'MESSAGE.ADMIN', '#00be00');

    private constructor(key: string, value: boolean | number | string, display: string, color: string) {
        super(key, value, display, color, '');
        ORG_USER_ROLES.VALUES.push(this);
    }

    public static valueOf(value: boolean | number | string): ORG_USER_ROLES | null {
        if (value === null) {
            return ORG_USER_ROLES.MEMBER;
        }
        return ORG_USER_ROLES.VALUES.filter( item => item.value === value)[0];
    }

    public static toArray(): Array< any> {
        return ORG_USER_ROLES.VALUES;
    }
}
