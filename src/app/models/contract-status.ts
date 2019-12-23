import {GENERIC_ENUM_MODEL} from './generic-enums';

export class ContractStatus extends GENERIC_ENUM_MODEL {
    private static VALUES: Array<ContractStatus> = [];
    public static PENDING = new ContractStatus('PENDING', 1, 'MESSAGE.PENDING', '#0027ff');
    public static ACTIVE = new ContractStatus('ACTIVE', 2, 'MESSAGE.ACTIVE', '#00e72a');
    public static CANCEL = new ContractStatus('CANCEL', 3, 'MESSAGE.CANCEL', '#ee220e');

    private constructor(key: string, value: number | string, display: string, color: string) {
        super(key, value, display, color, '');
        ContractStatus.VALUES.push(this);
    }

    public static valueOf(value: number | undefined | null | string): ContractStatus | null {
        if (!value) {
            return ContractStatus.PENDING;
        }
        return ContractStatus.VALUES.filter( item => item.value === value)[0];
    }

    public static toArray(): Array< any> {
        return ContractStatus.VALUES;
    }
}
