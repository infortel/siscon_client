import Designer from "../core/Designer";
import Log from "../../../../slibrary/general/Log"
import GPopup_Windows from "../../../../slibrary/framework/components/popup/logic/GPopup_Windows";
import Commands from "../../../../slibrary/framework/general/Commands";
import Properties_Library from "./Properties_Library";
import Commands_General from "../../../common/commands/Commands_General";
import Gadget from "../../../../slibrary/framework/gadget/Gadget";
import GPopup_Window from "../../../../slibrary/framework/components/popup/logic/GPopup_Window";
import { STAjaxPacket, STNull, STObjectAny } from "../../../../slibrary/general/STypes";
import Gadgets from "../../../../slibrary/framework/gadgets/Gadgets";
import Page_Name from "../../../common/generals/Page_Name";
import { Grid_Selector } from "../../../dialogs/grid_selector/Grid_Selector";
import T from "../../../../slibrary/translate/T";
import { $general$files$read_relative_file } from "../../../common/system/ajax/$definitions/general/files/$general$files$read_relative_file";
import Ajax from "../../../common/system/ajax/Ajax";
import { DGrid } from "../../../../slibrary/framework/components/grid/logic/DGrid";

export default class Element_Properties_Commands extends Commands_General {
    //***************************************************************************
    // This method processes all local commands. It inherits general commands.
    private _master:Designer
    //***************************************************************************
    constructor(master:Designer) {
        super()
        this._master=master
    }
    //***************************************************************************
    c_ok():void {
        //OK: Accept the change(s).
        if (Designer.designing_gadgets) {

            Designer.designing_gadgets.forEach(Gadgets.LEVEL_BASIC, (designing_gadget:Gadget) => {
                if (designing_gadget.is_selected()) {
                    const initialType = designing_gadget.def.type()
                    const popup = GPopup_Windows.get(Page_Name.DESIGNER_ELEMENT_PROPERTIES)
                    popup!.gadgets.gadgets_to_data(Properties_Library._TABLE_EDIT, designing_gadget.def.def())
                    if (initialType!==designing_gadget.def.type()) {
                        designing_gadget.re_construct()
                    }

                    designing_gadget.update_data_from_def()
                    designing_gadget.update_metrics_from_def()

                    designing_gadget.com().st.update_state_from_gadget()
                    designing_gadget.reset_react_children_elements()
                    if (designing_gadget.get_parent()) {
                        designing_gadget.get_parent()!.reset_react_children_elements()
                        designing_gadget.get_parent()!.forceUpdate()
                    } else {
                        designing_gadget.forceUpdate()
                    }
                }
            })
            const popup: GPopup_Window |STNull = GPopup_Windows.get(Page_Name.DESIGNER_ELEMENT_PROPERTIES)
            if (popup) popup.close()
        }
    }
    //***************************************************************************
    c_cancel():void {
        //Cancel changes.
        try {
            const modal=GPopup_Windows.get(Page_Name.DESIGNER_ELEMENT_PROPERTIES)
            if (modal) modal.close()
        } catch (e) {
            Log.logExc("Element_Properties_Commands.cancel",e)
        }
    }
    //***************************************************************************
    c_help_script() {
        //Get help selecting a script command from a list (grid). Note: Page properties must indicate a program ID for this option to include specific application options.
        const $=$general$files$read_relative_file
        const request:STAjaxPacket={}
        request[$.I_PATH]=Page_Name.HELP_SCRIPT_FUNCTIONS
        new Ajax().call("Getting help file from server: " + this.page_or_definition, $.COMMAND, request, (ajax: Ajax) => {
            try {
                new Grid_Selector(T.t("Select script entry"),Page_Name.DESIGNER_SCRIPT_SELECTOR,
                    (grid:DGrid)=>{//On grid mounted.
                        const content=ajax.getResponse()[$.O_CONTEXT]
                        const data=JSON.parse(content)
                        const rows=data.script_functions
                        let rows2:STObjectAny[]=[]
                        const programId=Designer.designing_gadgets?.get_definition_head("program_id")
                        //Filter using this program.
                        for (const row of rows) {
                            let inc=false
                            const row_id_value=Properties_Library.extractModuleId_from_GroupPath(row.group)
                            if (row.function.indexOf("app.a_")>=0) inc=true
                            else if (row.function.indexOf("app.b_")>=0) inc=true
                            else if (row_id_value===programId && programId) inc=true
                            if (inc) rows2.push(row)
                        }
                        grid.body().set_all_rows(rows2,true,true)
                    }
                    ,(row:STObjectAny)=>{//On selection.
                        const value=row.function
                        const callingGadget=Commands.get_gadget_global()
                        if (callingGadget) {
                            callingGadget.set_value(value) 
                            callingGadget.register_modification()
                        }
                    }
                )

            } catch (e) {
                Log.logExc("call_server. " + this.page_or_definition, e)
            }
        })
    }
    //***************************************************************************
}