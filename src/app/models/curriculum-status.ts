import {GENERIC_ENUM_MODEL} from './generic-enums';

export class CURRICULUMSTATUS extends GENERIC_ENUM_MODEL {
    private static VALUES: Array<CURRICULUMSTATUS> = [];

    public static COMPLETE = new CURRICULUMSTATUS('COMPLETE', 1, 'MESSAGE.Complete', '#0ea91c');
    public static DISABLE = new CURRICULUMSTATUS('DISABLE', 2, 'MESSAGE.DISABLE', '#003b74');
    public static PENDING = new CURRICULUMSTATUS('PENDING', 3, 'MESSAGE.PENDING', '#ee10ed');
    public static DELETED = new CURRICULUMSTATUS('DELETED', 4, 'MESSAGE.DELETED', '#ee220e');
    public static ENABLE = new CURRICULUMSTATUS('ENABLE', 5, 'MESSAGE.ENABLE', '#057987');

    private constructor(key: string, value: boolean | number | string, display: string, color: string) {
        super(key, value, display, color, '');
        CURRICULUMSTATUS.VALUES.push(this);
    }

    public static valueOf(value: number): CURRICULUMSTATUS | null {
        if (value == null) {
            return CURRICULUMSTATUS.PENDING;
        }
        return CURRICULUMSTATUS.VALUES.filter( item => item.value === value)[0];
    }

    public static toArray(): Array< any> {
        return CURRICULUMSTATUS.VALUES;
    }
}
