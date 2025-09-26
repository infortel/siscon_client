import Log from "./Log"
import { STNull } from "./STypes"

export default class GString {
    //*****************************************************
    static getDataString(data: any): string | null {
        if (data === null) return null
        if (data === undefined) return null
        if (typeof data === "number" && isNaN(data)) return null
        return data
    }
    //*****************************************************
    static isString(variable: any): boolean {
        return ((typeof variable === "string") || (variable instanceof String))
    }
    //*****************************************************
    static isStringWithText(variable: any): boolean {
        if ((typeof variable === "string") || (variable instanceof String)) {
            if (variable.length > 0) return true; else return false;
        }
        return false
    }
    //*****************************************************
    static hasOnlyNumericDigits(s: string): boolean {
        if (typeof s !== "string") {
            return false
        }
        for (let i = s.length - 1; i >= 0; i--) {
            const d = s.charCodeAt(i);
            if (d < 48 || d > 57) return false
        }
        return true
    }
    //*****************************************************
    static getUrlParameter(name: string): string {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        let results = regex.exec(window.location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };
    //*****************************************************
    static nullToText(st: string | STNull): string {
        if (GString.isStringWithText(st)) return st as string
        return ""
    }
    //*****************************************************
    static getNumericHtmlEquivalent(st:string|null): number|null {

        if (st===null) return null

        if (typeof st==="number") return st

        //convert px or otherwise.
        try {
            st=st.replace(/[^0-9]/g, '');
        } catch (e) {
            //Do nothing.
        }

        try {
            return Number(st)
        } catch (e) {
            return 0
        }
    }
    //*****************************************************
}