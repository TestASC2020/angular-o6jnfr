import {GENERIC_ENUM_MODEL} from './generic-enums';

export class ReportPeriods extends GENERIC_ENUM_MODEL {
    private static VALUES: Array<ReportPeriods> = [];
    public static Week = new ReportPeriods('Week', 1, 'MESSAGE.Week', '#35a2ff');
    public static Month = new ReportPeriods('Month', 2, 'MESSAGE.Month', '#79d657');
    public static Quarter = new ReportPeriods('Quarter', 3, 'MESSAGE.Quarter', '#e76858');
    public static Year = new ReportPeriods('Year', 4, 'MESSAGE.Year', '#bd6ee7');

    private constructor(key: string, value: number | string, display: string, color: string) {
        super(key, value, display, color, '');
        ReportPeriods.VALUES.push(this);
    }

    public static valueOf(value: number | undefined | null | string): ReportPeriods | null {
        if (value === undefined || value === null) {
            return ReportPeriods.Week;
        }
        return ReportPeriods.VALUES.filter( item => item.value === value)[0];
    }

    public static toArray(): Array< any> {
        return ReportPeriods.VALUES;
    }
}
