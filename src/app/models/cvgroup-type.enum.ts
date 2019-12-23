import {GENERIC_ENUM_MODEL} from './generic-enums';

export class CURRICULUM_GROUP_TYPE extends GENERIC_ENUM_MODEL {
    private static VALUES: Array<CURRICULUM_GROUP_TYPE> = [];

    public static LESSON = new CURRICULUM_GROUP_TYPE('LESSON', 0, 'Lesson', '#057987');
    public static EXERCISE = new CURRICULUM_GROUP_TYPE('EXERCISE', 1, 'Exercise', '#003b74');
    public static QUIZ = new CURRICULUM_GROUP_TYPE('QUIZ', 2, 'Quiz', '#ee10ed');

    private constructor(key: string, value: boolean | number | string, display: string, color: string) {
        super(key, value, display, color, '');
        CURRICULUM_GROUP_TYPE.VALUES.push(this);
    }

    public static valueOf(value: number): CURRICULUM_GROUP_TYPE | null {
        if (value === null) {
            return CURRICULUM_GROUP_TYPE.LESSON;
        }
        return CURRICULUM_GROUP_TYPE.VALUES.filter( item => item.value === value - 1)[0];
    }

    public static toArray(): Array< any> {
        return CURRICULUM_GROUP_TYPE.VALUES;
    }
}
