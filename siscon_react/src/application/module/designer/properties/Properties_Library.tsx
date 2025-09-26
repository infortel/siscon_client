import GPopup_Windows from "../../../../slibrary/framework/popup_windows/GPopup_Windows";
import Log from "../../../../slibrary/general/Log";
import GString from "../../../../slibrary/general/GString";
import { STObjectAny } from "../../../../slibrary/general/STypes";
import Gadgets from "../../../../slibrary/framework/gadgets/Gadgets";
import GObject from "../../../../slibrary/general/GObject";
import GArray from "../../../../slibrary/general/GArray";
import GPopup_Window from "../../../../slibrary/framework/popup_windows/GPopup_Window";

export default class Properties_Library {
    static _TABLE_EDIT="edit"
    //*****************************************************
    static gadgets_to_editing(popup: GPopup_Window, definition: STObjectAny): void {
        try {
             if (popup) {
                let gadgets = popup.gadgets
                gadgets.forEach(Gadgets.LEVEL_BASIC, (gadget) => {
                    gadget.clear_modifications()
                    if (gadget.def.table() === this._TABLE_EDIT) {
                        const field = gadget.def.field()
                        if (field) {
                            let val = definition[field]
                            gadget.set_value(null) //Set null to activate state with new value.
                            if (GObject.isValid(val)) {
                                if (val instanceof Object) {
                                    val = JSON.stringify(val)
                                }
                                gadget.set_value(val)
                            }
                        }
                    }
                })
            }

            this.show_hide_gadgets(popup)

        } catch (e) {
            Log.logExc("Properties_Library.gadgets_to_editing",e)
        }
    }
    //*****************************************************
    static editing_to_gadgets(popup: GPopup_Window, definition: STObjectAny):void {
        try {
             if (popup) {
                let gadgets = popup.gadgets
                gadgets.forEach(Gadgets.LEVEL_BASIC, (gadget) => {
                    if (gadget.def.table() === this._TABLE_EDIT) if (gadget.get_modifications() > 0) {
                        let val = gadget.get_value()
                        if (val === "") val = null
                        if (gadget.isGCheckbox()) if (!GObject.isTrue(val)) val = null
                        if (gadget.isGToggle()) if (!GObject.isTrue(val)) val = null
                        const field = gadget.def.field()
                        if (field) {
                            if (GObject.isValid(val)) {
                                definition[field] = val
                            } else {
                                delete definition[field]
                            }
                        }
                    }
                })
            }
        } catch (e) {
        Log.logExc("Properties_Library.editing_to_gadgets",e)
        }
    }
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
