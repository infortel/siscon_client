import GString from "./GString";

export default class GObject {
    //*****************************************************
    static isTrue(variable: any) {
        if (!GObject.isValid(variable)) return false;
        if (GString.isString(variable)) {
            let num: number = GObject.toNumber(variable)
            return (num > 0.5)
        } else if (variable instanceof Number) {
            return (variable > 0.5)
        } else return false
    }
    //*****************************************************
    static isValid(variable: any): boolean {
        try {
            if (variable === null) return false
            if (variable === undefined) return false
            if (Number.isNaN(variable)) return false
        } catch (e) {
            return false
        }
        return true
    }
    //*****************************************************
    static isInvalid(variable: any): boolean {
        return (!GObject.isValid(variable))
    }
    //*****************************************************
    static getObjectValue(obj: { [key: string]: any }, keyname: string): any {
        const getObjectValue2 = <T extends object, U extends keyof T>(obj: T) => (key: U) => obj[key];
        return getObjectValue2(obj)(keyname)
    }
    //*****************************************************
    static setObjectValue(obj: { [key: string]: any }, keyname: string, data_value: any) {
        const setObjectValue2 = <T extends object, U extends keyof T>(obj: T) => (key: U, data: any) => obj[key] = data;
        setObjectValue2(obj)(keyname, data_value)
    }
    //*****************************************************
    static toNumber(value: any): number {
        if (GString.isStringWithText(value)) {
            try {
                return parseInt(value!)
            } catch (e) {
                //Do nothing.
            }
        } else if (typeof value === "number") {
            return value
        } else if (typeof value === "boolean") {
            if (value) return 1; else return 0
        }
        return 0
    }
    //*****************************************************
}