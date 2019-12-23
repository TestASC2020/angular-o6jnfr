import { ValidatorFn, AbstractControl, FormGroup } from '@angular/forms';

export class CustomControlValidator {

    /**
     * @description
     * Validator that requires the control have a non-special character.
     *
     * @usageNotes
     *
     * ### Validate that the field is non-special character
     *
     * @returns An error map with the `nonSpecialCharacter` property
     * if the validation check fails, otherwise `null`.
     *
     */
    static nonSpecialCharacter(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const nonSpecialCharacterReg = new RegExp('[^A-Za-z0-9\\s]'); //^[_A-z0-9]*((\\s)*[_A-z0-9])*$ --> detect space in the end
            const forbidden = nonSpecialCharacterReg.test(control.value);
            return forbidden ? { 'nonSpecialCharacter': { value: control.value } } : null;
        }
    }

    /**
     * @description
     * Validator that requires the control have a non-space character.
     *
     * @usageNotes
     *
     * ### Validate that the field is non-space character
     *
     * @returns An error map with the `nonSpaceCharacter` property
     * if the validation check fails, otherwise `null`.
     *
     */
    static nonSpaceCharacter(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const nonSpecialCharacterReg = new RegExp('[\\s\\t\\n]');
            const forbidden = nonSpecialCharacterReg.test(control.value);
            return forbidden ? { 'nonSpaceCharacter': { value: control.value } } : null;
        }
    }

    /**
     * @description
     * Validator that requires the control must be a multiples of specific number.
     *
     * @usageNotes
     *
     * ### Validate that the field is multiples of specific number
     *
     * @returns An error map with the `multiplesOfNumber` property
     * if the validation check fails, otherwise `null`.
     *
     */
    static multiplesOfNumber(divisor: number): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (control.value) {
                const value = Number.parseInt(control.value);
                if (value % divisor !== 0) {
                    return { 'multiplesOfNumber': true };
                }
                return null;
            }
            return null;
        }
    }

    /**
     * @description
     * Validator that requires the control must be number.
     *
     * @usageNotes
     *
     * ### Validate that the field is multiples of specific number
     *
     * @returns An error map with the `notNumber` property
     * if the validation check fails, otherwise `null`.
     *
     */
    static notNumber(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (control.value) {
                const notNumberReg = new RegExp('[^0-9]');
                const forbidden = notNumberReg.test(control.value);
                return forbidden ? { 'notNumber': { value: control.value } } : null;
            } else {
                return null;
            }
        }
    }
}
