import GObject from "../../../../general/GObject";
import Log from "../../../../general/Log";
import { STNull } from "../../../../general/STypes";
import SEvaluate from "../../../../sevaluations/SEvaluate";
import Gadget from "../../Gadget";
export type Toptions = {
    value: string,
    caption: string,
}
export default class DList {
    private _options:Toptions[]=[]
    //*************************************************************************
    private _gadget:Gadget

    //*************************************************************************
    constructor(gadget:Gadget) {
        this._gadget = gadget
        this.set_options_from_string_array(this._gadget.def.options())
    }
    //*************************************************************************
    public set_options_from_string_array(optionArray:string[]|STNull) {
        try {
            this._options=[]
            if (GObject.isValid(optionArray)) {
                for (const opt of optionArray!) {
                    const i=opt.indexOf("=")
                    let value0=opt;
                    let caption0=opt;
                    if (i>=0) {
                        value0=opt.substring(0,i)
                        caption0=opt.substring(i+1,opt.length)
                    }
                    caption0=SEvaluate.Str(caption0)
                    let item:Toptions={caption:caption0, value:value0}
                    this._options.push(item)
                }
            }
        } catch (e) {
            Log.logExc("DList.set_options()",e)
        }
    }
    //*************************************************************************
    public get_options() {
        return this._options
    }
    //*************************************************************************

}