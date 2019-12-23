import {GENERIC_ENUM_MODEL} from './generic-enums';

export class QUOTATIONSTATUS extends GENERIC_ENUM_MODEL {
    private static VALUES: Array<QUOTATIONSTATUS> = [];
    public static PENDING = new QUOTATIONSTATUS('PENDING', 1, 'MESSAGE.PENDING', '#0027ff');
    public static SENT = new QUOTATIONSTATUS('SENT', 2, 'MESSAGE.SENT', '#003d5a');
    public static ACCEPT = new QUOTATIONSTATUS('ACCEPT', 3, 'MESSAGE.ACCEPT', '#00e72a');
    public static DECLINE = new QUOTATIONSTATUS('DECLINE', 4, 'MESSAGE.DECLINE', '#ee220e');
    public static TERMINATE = new QUOTATIONSTATUS('TERMINATE', 5, 'MESSAGE.TERMINATE', '#ee950b');

    private constructor(key: string, value: number | string, display: string, color: string) {
        super(key, value, display, color, '');
        QUOTATIONSTATUS.VALUES.push(this);
    }

    public static valueOf(value: number): QUOTATIONSTATUS | null {
        if (value === null) {
            return QUOTATIONSTATUS.PENDING;
        }
        return QUOTATIONSTATUS.VALUES.filter( item => item.value === value)[0];
    }

    public static toArray(): Array< any> {
        return QUOTATIONSTATUS.VALUES;
    }
}
