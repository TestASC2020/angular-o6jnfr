import {GENERIC_ENUM_MODEL} from './generic-enums';

export class COURSECONTRACTSTATUS extends GENERIC_ENUM_MODEL {
    private static VALUES: Array<COURSECONTRACTSTATUS> = [];

    public static PENDING = new COURSECONTRACTSTATUS('Pending', 1, 'MESSAGE.PENDING', '#3b7eff');
    public static FAILED = new COURSECONTRACTSTATUS('Failed', 2, 'MESSAGE.FAILED', '#ff2551');
    public static ENABLE = new COURSECONTRACTSTATUS('Enable', 3, 'MESSAGE.ENABLE', '#62ff0e');
    public static DISABLE = new COURSECONTRACTSTATUS('Disable', 4, 'MESSAGE.DISABLE', '#8f5a15');
    public static CLOSED = new COURSECONTRACTSTATUS('Closed', 5, 'MESSAGE.CLOSED', '#684170');
    private constructor(key: string, value: boolean | number | string, display: string, color: string) {
        super(key, value, display, color, '');
        COURSECONTRACTSTATUS.VALUES.push(this);
    }

    public static valueOf(value: boolean): COURSECONTRACTSTATUS | null {
        if (value == null) {
            return COURSECONTRACTSTATUS.PENDING;
        }
        return COURSECONTRACTSTATUS.VALUES.filter( item => item.value === value)[0];
    }

    public static toArray(): Array< any> {
        return COURSECONTRACTSTATUS.VALUES;
    }
}