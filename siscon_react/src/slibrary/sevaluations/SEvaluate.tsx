import Variable from "../../application/common/evaluations/Variable";
import GObject from "../general/GObject";
import GString from "../general/GString";
import Log from "../general/Log";
export default class SEvaluate {
//***************************************************************************
    static OPEN1="["
    static OPEN2="]"
//***************************************************************************
    static Str_null(text: string):string | null {
        if (!GObject.isValid(text)) return null;
        return this.Str(text);
    }
//***************************************************************************
    static Str(text: string): string {
        if (!GObject.isValid(text)) return "";
        if (text == null) return ""
        if (text.indexOf(SEvaluate.OPEN1)<0) return text

        let result=""
        try {
            if (!GString.isStringWithText(text)) return ""
            while (text.length > 0) {
                let i1 = text.indexOf(SEvaluate.OPEN1)
                let i2 = text.indexOf(SEvaluate.OPEN2)
                if ((i1 >= 0) && (i2 > +1)) {
                    result += text.substring(0, i1)
                    let variable = text.substring(i1 + 1, i2)
                    text = text.substring(i2 + 1, text.length)
                    let res = ""
                    if (variable.charAt(0) === '#') {
                        variable = variable.substring(1, variable.length)
                        res = Variable.evaluate(variable)
                        if (res===null) res=""
                    }
                    result += res
                } else {
                    result += text
                    text = ""
                }
            }
        } catch (e) {
            Log.logExc("Error evaluating text: "+text,e)
        }
        return result
    }
//***************************************************************************
}