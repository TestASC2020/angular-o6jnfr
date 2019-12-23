import {GENERIC_ENUM_MODEL} from './generic-enums';

export class CURRICULUMQUOTESSTATUS extends GENERIC_ENUM_MODEL {
    private static VALUES: Array<CURRICULUMQUOTESSTATUS> = [];

    public static QUOTED = new CURRICULUMQUOTESSTATUS('Quoted', 0, 'Quoted', '#057987');
    public static DECLINED = new CURRICULUMQUOTESSTATUS('Declined', 1, 'Declined', '#003b74');
    public static ACCEPTED = new CURRICULUMQUOTESSTATUS('Accepted', 2, 'Accepted', '#ee220e');

    private constructor(key: string, value: boolean | number | string, display: string, color: string) {
        super(key, value, display, color, '');
        CURRICULUMQUOTESSTATUS.VALUES.push(this);
    }

    public static valueOf(value: boolean): CURRICULUMQUOTESSTATUS | null {
        if (value == null) {
            return CURRICULUMQUOTESSTATUS.DECLINED;
        }
        return CURRICULUMQUOTESSTATUS.VALUES.filter( item => item.value === value)[0];
    }

    public static toArray(): Array< any> {
        return CURRICULUMQUOTESSTATUS.VALUES;
    }
}