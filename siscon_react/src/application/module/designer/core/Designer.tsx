import Log from "../../../../slibrary/general/Log";
import Designer_Commands from "./Designer_Commands"
import Gen from "../../../../slibrary/general/Gen";
import SCookie from "../../../../slibrary/general/SCookie";
import Gadgets from "../../../../slibrary/framework/gadgets/Gadgets";
import Designer_Constants from "./Designer_Constants";
import Program_Base from "../../../common/entry/Program_Base"
import Constants from "../../../common/entry/Constants";
import Gadget from "../../../../slibrary/framework/gadget/Gadget";
import { STObjectAny } from "../../../../slibrary/general/STypes";
import GObject from "../../../../slibrary/general/GObject";
import Element_Properties_Commands from "../properties/Element_Properties_Commands";
import { KeyManagement } from "../../../../slibrary/general/KeyManagement";
import GPopup_Windows from "../../../../slibrary/framework/components/popup/logic/GPopup_Windows";

export type Tda = {
    designer_mode: Gadget
}

export default class Designer extends Program_Base {
    public static designing_gadgets: Gadgets | null    //This represents the tree of all framework.
    static da:Tda | undefined
    public static commands:Designer_Commands
    constructor() {
        super(Constants.PROGRAM_NAME_DESIGNER)
        try {
            Designer.da=Gadgets.inst().da as Tda

            Designer.commands=new Designer_Commands(this)
            this.set_command_instance(Designer.commands)

            let file = SCookie.getCookie(Designer_Constants.COOKIE_DESIGNER_FILENAME)
            if (!file) file ="{server}.{original}/pages/desk/module/main/main.json"
            if (GObject.isValid(file)) {
                Gadgets.inst().set_value(Designer_Constants.GADGET_PATH, file)
                Designer.commands.c_read_path(null)
            }

            //Setup events.
            KeyManagement.inst().set_keydown_event(this._design_onKeyDown)

        } catch (e) {
            Log.logExc("Designer.constructor", e)
        }
    }
    //*****************************************************
    //*****************************************************
    //*****************************************************
    //*****************************************************
    _design_onKeyDown(event: Event) {
        const key: number = KeyManagement.inst().get_keyCode(event)
        if (key === KeyManagement.KEY_DELETE) {
            if (GPopup_Windows.get_active_count()==0) {
                Designer.commands.c_delete()
            }
        }
    }
    //*****************************************************
    _design_gadgets_area_onclick(event: Event | null, gadget: Gadget): void {
        const clickCount = gadget.event.get_last_area_click_count()
        if (clickCount == 2) {
            //Wait for the gadget selection be activated.
            setTimeout(() => {
                let property_gadget = Designer.designing_gadgets!.selected_get_first()
                if (property_gadget == null) gadget.set_selected(true)
                Designer.commands.c_element_properties()
            }, 20)
        }

    }
    //***************************************************
    _clean_items() {
        if (Designer.designing_gadgets) Designer.designing_gadgets.forEach(0, (gadget: Gadget) => {
            if (gadget.def.children()) 
                if (gadget.def.children()!.length == 0) {
                    delete gadget.def.def().children
            }
        })
    }
   //*****************************************************
    //*****************************************************
    //*****************************************************
    //*****************************************************
}