import {GENERIC_ENUM_MODEL} from './generic-enums';

export class USER_STATUS extends GENERIC_ENUM_MODEL {
    private static VALUES: Array<USER_STATUS> = [];

    public static NEW = new USER_STATUS('NEW', 0, 'New', '#057987');
    public static ACTIVE = new USER_STATUS('DISABLE', 1, 'Active', '#003b74');
    public static LOCKED = new USER_STATUS('LOCKED', 2, 'Locked', '#ee10ed');
    public static PENDING = new USER_STATUS('PENDING', 3, 'Pending', '#ee220e');
    public static MERGED = new USER_STATUS('MERGED', 3, 'Merged', '#2feea7');
    public static DELETED = new USER_STATUS('DELETED', 3, 'Deleted', '#e7ee26');

    private constructor(key: string, value: boolean | number | string, display: string, color: string) {
        super(key, value, display, color, '');
        USER_STATUS.VALUES.push(this);
    }

    public static valueOf(value: number): USER_STATUS | null {
        if (value === null) {
            return USER_STATUS.NEW;
        }
        return USER_STATUS.VALUES.filter( item => item.value === Math.pow(value, 2))[0];
    }

    public static toArray(): Array< any> {
        return USER_STATUS.VALUES;
    }
}
