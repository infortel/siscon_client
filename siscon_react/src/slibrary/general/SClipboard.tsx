import { STNull } from "./STypes"

export default class SClipboard{
    static _text:string|STNull=null
    static get():string | STNull {
        return SClipboard._text
    }
    static set(text: string | STNull) {
        SClipboard._text=text
    }
}