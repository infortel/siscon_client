import GString from "../general/GString";
import { STNull } from "../general/STypes";

export default class T {
    public static DEFAULT_LANGUAGE = 1 //1 for english, 0 for spanish.
    //******************************************************************
    //This is used mostly in source code development.
    static t(st: string): string {
        return this.translate(this.DEFAULT_LANGUAGE, st)
    }
    //******************************************************************
    static translate(sourceLanguage:number, sourceText:string):string {
        let res=GString.nullToText(sourceText);
        if (res!=="") {
            //Do translation.
            return res;
        }
        return res;
    }
    //******************************************************************
}