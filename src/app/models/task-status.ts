import {GENERIC_ENUM_MODEL} from './generic-enums';

export class TASKSTATUS extends GENERIC_ENUM_MODEL {
    private static VALUES: Array<TASKSTATUS> = [];
    public static PENDING = new TASKSTATUS('PENDING', 1, 'MESSAGE.PENDING', '#0027ff');
    public static SUBMIT = new TASKSTATUS('SUBMIT', 2, 'MESSAGE.SUBMIT', '#003d5a');
    public static ACCEPT = new TASKSTATUS('ACCEPT', 3, 'MESSAGE.ACCEPT', '#00e72a');
    public static REJECT = new TASKSTATUS('REJECT', 4, 'MESSAGE.REJECT', '#ee220e');

    private constructor(key: string, value: number | string, display: string, color: string) {
        super(key, value, display, color, '');
        TASKSTATUS.VALUES.push(this);
    }

    public static valueOf(value: number | undefined | null | string): TASKSTATUS | null {
        if (!value) {
            return TASKSTATUS.PENDING;
        }
        return TASKSTATUS.VALUES.filter( item => item.value === value)[0];
    }

    public static toArray(): Array< any> {
        return TASKSTATUS.VALUES;
    }
}
