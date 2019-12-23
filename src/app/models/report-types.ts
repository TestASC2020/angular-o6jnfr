import {GENERIC_ENUM_MODEL} from './generic-enums';

export class ReportTypes extends GENERIC_ENUM_MODEL {
    private static VALUES: Array<ReportTypes> = [];
    public static Enroll = new ReportTypes('Enroll', 1, 'MESSAGE.Enroll', '#35a2ff');
    public static Discussion = new ReportTypes('Discussion', 2, 'MESSAGE.Discussion', '#9724ca');
    public static Feedback = new ReportTypes('Feedback', 3, 'MESSAGE.Feedback', '#e76858');

    private constructor(key: string, value: number | string, display: string, color: string) {
        super(key, value, display, color, '');
        ReportTypes.VALUES.push(this);
    }

    public static valueOf(value: number | undefined | null | string): ReportTypes | null {
        if (!value) {
            return ReportTypes.Enroll;
        }
        return ReportTypes.VALUES.filter( item => item.value === value)[0];
    }

    public static toArray(): Array< any> {
        return ReportTypes.VALUES;
    }
}
