import {GENERIC_ENUM_MODEL} from './generic-enums';

export class REQUESTQUOTESSTATUS extends GENERIC_ENUM_MODEL {
    private static VALUES: Array<REQUESTQUOTESSTATUS> = [];

    public static QUOTED = new REQUESTQUOTESSTATUS('QUOTED', 5, 'Quoted', '#003d5a');
    public static ACCEPTED = new REQUESTQUOTESSTATUS('ACCEPTED', 2, 'Accepted', '#176F45');
    public static REJECTED = new REQUESTQUOTESSTATUS('REJECTED', 1, 'Rejected', '#ee220e');
    public static NEW = new REQUESTQUOTESSTATUS('NEW', 20, 'New', '#0027ff');
    public static IGNORED = new REQUESTQUOTESSTATUS('IGNORED', 3, 'Ignored', '#ee950b');
    public static COMPLETED = new REQUESTQUOTESSTATUS('COMPLETED', 4, 'C', '#1E8EEB');

    private constructor(key: string, value: number | string, display: string, color: string) {
        super(key, value, display, color, '');
        REQUESTQUOTESSTATUS.VALUES.push(this);
    }

    public static valueOf(value: number): REQUESTQUOTESSTATUS | null {
        if (value === null) {
            return REQUESTQUOTESSTATUS.NEW;
        }
        return REQUESTQUOTESSTATUS.VALUES.filter( item => item.value === value)[0];
    }

    public static toArray(): Array< any> {
        return REQUESTQUOTESSTATUS.VALUES;
    }
}
