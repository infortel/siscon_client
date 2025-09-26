import T from "../../translate/T"
import Log from "../../general/Log"
import { STNull, STObjectAny } from "../../general/STypes"
import Gadget from "../gadget/Gadget"
import Gadgets from "../gadgets/Gadgets"
import GObject from "../../general/GObject"
/*
Instructions:
Commands that are executed from forms should start like this:
    a_  For all commands specific to framework library.
    b_  For all commands that are global to all modules.
    c_  For module commands or dialogs specific to a module.
*/
export default class Commands {
    [x: string]: any //This tells typescript to allow execution of any function even if it does not exist.
    //***************************************************************************
    private _calling_gadget:Gadget|STNull
    private static _calling_gadget_global:Gadget|STNull
    //private _event: STObjectAny|STNull
    private _result:any=null //This would be the result of the calling script.

    //***************************************************************************
    constructor() {

    }
    //***************************************************************************
    clear_result():void {
        this._result=null
    }
    //***************************************************************************
    embedded_close(): void {

        if (this._calling_gadget != null) {
            this._calling_gadget.def.embedded__open_parent(false)
        }
    }
    //***************************************************************************
    set_calling_gadget(/*event: GComponentEvent,*/ calling_gadget:Gadget) {
        //this._event=event
        this._calling_gadget=calling_gadget
        Commands._calling_gadget_global=calling_gadget
    }
    //***************************************************************************
    get_gadget():Gadget|STNull {
        if (this._calling_gadget) return this._calling_gadget
        return Gadgets.inst().get_root_gadget()
    }
    //***************************************************************************
    public static get_gadget_global():Gadget|STNull {
        if (Commands._calling_gadget_global) return Commands._calling_gadget_global
        return null
    }
    //***************************************************************************
    set_result(result:any):void {
        this._result=result
    }
    //***************************************************************************
    get_result():any {
        return this._result
    }
    //***************************************************************************
    //***************************************************************************
    //***************************************************************************
    //***************************************************************************
    // target: _blank=new tab, _self=same tab.
    a_goto_url(pagename: string, target: string): void {
        //Goto url
        if (GObject.isInvalid(target)) target = "_self"
        window.open(pagename, target);
    }
    //***************************************************************************
    a_branch_close(): void {
        //Close branch (make invisible)
        if (this._calling_gadget != null) {
            this._calling_gadget.def.root__visible(false)
        }
    }
    //***************************************************************************
    a_branch_expand(logic: boolean): void {
        //Expand branch. Show or hide children
        if (this._calling_gadget != null) {
            const root:Gadget|STNull = this._calling_gadget.def.root__get_root()
            if (root) {
                root.def.show_hide_children__all(logic)
            }
        }
    }
    //***************************************************************************
    a_under_development(key: string) {
        //Option is under development
        Log.alert(T.t("This application is under development"))
    }
    //***************************************************************************
    a_show_hide_gadget(key: string) {
        //Show or hide the element indicated by the key
        let gadget = this.get_gadget()
        let target = gadget!.gadgets().get(key)
        if (target != null) target.def.show_hide_children__toggle()
    }
    //***************************************************************************
}