import GPopup_Windows from "../../../../slibrary/framework/components/popup/logic/GPopup_Windows";
import Log from "../../../../slibrary/general/Log";
import GString from "../../../../slibrary/general/GString";
import { STObjectAny } from "../../../../slibrary/general/STypes";
import Gadgets from "../../../../slibrary/framework/gadgets/Gadgets";
import GObject from "../../../../slibrary/general/GObject";
import GArray from "../../../../slibrary/general/GArray";
import GPopup_Window from "../../../../slibrary/framework/components/popup/logic/GPopup_Window";

export default class Properties_Library {
    static _TABLE_EDIT="edit"

    //*****************************************************
    static show_hide_gadgets(popup:GPopup_Window) {
        try {
            if (popup) {
                const type_value = popup.gadgets.get_value_tab(this._TABLE_EDIT, "type")
                let gadgets = popup.gadgets
                gadgets.forEach(Gadgets.LEVEL_BASIC, (gadget) => {
                    if (gadget.def.table() === this._TABLE_EDIT) {

                        let hide = false
                        const element_type = gadget.def.notes()
                        if (GString.isStringWithText(element_type)) {
                            const types = element_type!.split("\n")
                            const index = GArray.get_index(types, type_value)
                            hide = (index < 0)
                        }
                        gadget.hide(hide)

                    }
                })
                popup.gadgets.root_gadget.forceUpdate()
                //popup.framework.root_gadget.activate_rendering()
            }
        } catch (e) {
            Log.logExc("Properties_Library.editing_to_gadgets", e)
        }
    }
    //***************************************************************************
    public static extractModuleId_from_GroupPath(text:string):string {
        const i=text.lastIndexOf("/");
        if (i>=0) text=text.substring(i+1,text.length)

        //Extract suffix _Commands
        const s=text.lastIndexOf("_Commands")
        if (s>0) text=text.substring(0,s)

        return text
    }
    //*****************************************************
}
