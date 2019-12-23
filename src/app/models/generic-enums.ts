export class GENERIC_ENUM_MODEL {
    protected key: string;
    protected value: boolean | number | string;
    protected display: string;
    protected htmlDisplay: string;
    protected color: string;

    protected constructor(key: string, value: boolean | number | string , display: string, color?: string, htmlDisplay?: string) {
        this.key = key;
        this.value = value;
        this.display = display;
        this.htmlDisplay = htmlDisplay;
        this.color = color;
    }

    public getKey(): string {
        return this.key;
    }

    public getValue(): boolean | number | string {
        return this.value;
    }

    public getDisplay(): string {
        return this.display;
    }

    public getHTMLDisplay(): string {
        return this.htmlDisplay;
    }

    public getColor(): string {
        return this.color;
    }
}
