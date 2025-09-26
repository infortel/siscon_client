import Gen from "./Gen";
import { STException, STNull } from "./STypes";
export default class Log {
//*********************************************************
    static _log(text:string):void {
        Log.alert(text)
    }
    //*********************************************************
    static log(text: string):void {
        Log.logDet(text, null, false);
    }
    //*********************************************************
    static logExc(text: string, e: STException):void {
        Log.logDet(text, e, false);
    }
//*********************************************************
    static logDet(text: string, e: STException, omitStackDetail: boolean):void {
        if (e) {
            let doThrow=false
            try {
                let st=text+" / "+e.message
                if (Gen.DEVELOPMENT()) {
                    st+=e.stack



                    Log._log(st)
                } else {
                    Log._log(st)
                }
            } catch(e1) {
                Log._log("Detail: "+text+" / "+"Error in error message")
            }
            //if (Gen.DEVELOPMENT()) throw e
        } else {
            Log._log(text)
        }
    }
//*********************************************************
    static count=0;
//*********************************************************
    static logWindowCaption(text:string):void {
        document.title=Log.count+": "+text
        Log.count++
    }
//*********************************************************
    static debug(text:string):void {
        try {
            console.log("Debug: " + text)
        } catch (e: STException) {
            console.log("Debug: ... error in display: "+e.message())
        }
    }
//*********************************************************
    static alert(text:string) :void {
        alert(text)
    }
//*********************************************************
    static autoclose_popup(message:string):void {
        let w: Window | STNull = window.open('', '', 'width=400,height=100')
        if (w) {
            w.document.write(message)
            w.focus()
            setTimeout(function () {
                (w as Window).close();
            }, 2000)
        }
    }
//*********************************************************
    static prompt(message: string, default_value: string|null, onResult: (success: boolean, result: string | STNull)=>any) :void {
        if (default_value===null) default_value=""
        let result: string | STNull=prompt(message,default_value)
        if (onResult) onResult(true,result)
    }
//*********************************************************
}