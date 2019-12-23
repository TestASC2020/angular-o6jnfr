import {GENERIC_ENUM_MODEL} from './generic-enums';

export class ORG_USER_STATUS extends GENERIC_ENUM_MODEL {
    private static VALUES: Array<ORG_USER_STATUS> = [];

    public static ENABLE = new ORG_USER_STATUS('ENABLE', 1, 'MESSAGE.ENABLE', '#2feea7');
    public static DISABLE = new ORG_USER_STATUS('DISABLE', 2, 'MESSAGE.DISABLE', '#ee220e');
    public static NOT_DEFINED1 = new ORG_USER_STATUS('NOT_DEFINED1', 3, 'MESSAGE.NOT_DEFINED', '#efb206');
    public static NOT_DEFINED2 = new ORG_USER_STATUS('NOT_DEFINED2', 4, 'MESSAGE.NOT_DEFINED', '#efb206');
    public static EMPTY = new ORG_USER_STATUS('EMPTY', null, 'MESSAGE.EMPTY', '#006c00');

    private constructor(key: string, value: boolean | number | string, display: string, color: string) {
        super(key, value, display, color, '');
        ORG_USER_STATUS.VALUES.push(this);
    }

    public static valueOf(value: boolean | number | string): ORG_USER_STATUS | null {
        if (value === null) {
            return ORG_USER_STATUS.EMPTY;
        }
        return ORG_USER_STATUS.VALUES.filter( item => item.value === value)[0];
    }

    public static toArray(): Array< any> {
        return ORG_USER_STATUS.VALUES;
    }
}
