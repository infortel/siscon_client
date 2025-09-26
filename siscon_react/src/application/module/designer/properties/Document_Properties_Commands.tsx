import Param from "../../../common/Param"
import Designer from "../core/Designer";
import Log from "../../../../slibrary/general/Log"
import GPopup_Windows from "../../../../slibrary/framework/popup_windows/GPopup_Windows";
import Commands from "../../../../slibrary/framework/general/Commands";
import Designer_Constants from "../core/Designer_Constants";
import Gadgets from "../../../../slibrary/framework/gadgets/Gadgets";
import Commands_General from "../../../common/commands/Commands_General";
import Designer_Commands from "../core/Designer_Commands";
import Properties_Library from "../properties/Properties_Library";
import Page_Name from "../../../common/generals/Page_Name";
import { $general$files$read_relative_file } from "../../../common/system/ajax/$definitions/general/files/$general$files$read_relative_file";
import Ajax from "../../../common/system/ajax/Ajax";
import { STAjaxPacket, STObjectAny } from "../../../../slibrary/general/STypes";
import { Grid_Selector } from "../../../dialogs/grid_selector/Grid_Selector";
import T from "../../../../slibrary/translate/T";
import { DGrid } from "../../../../slibrary/framework/gadget/gadget_data/dgrid/DGrid";

export default class Document_Properties_Commands extends Commands_General {
    //***************************************************************************
    private _master:Designer

    //***************************************************************************
    constructor(master:Designer) {
        super()
        this._master=master
    }
    //***************************************************************************
    c_ok(): void {
        //OK: Accept the change(s)
        if (Designer.designing_gadgets) {
            Designer.designing_gadgets!._css = null
            const popup = GPopup_Windows.get(Page_Name.DESIGNER_DOCUMENT_PROPERTIES)
            Properties_Library.editing_to_gadgets(popup!, Designer.designing_gadgets._definition.head)
            if (GPopup_Windows.get(Page_Name.DESIGNER_DOCUMENT_PROPERTIES)) {
                GPopup_Windows.get(Page_Name.DESIGNER_DOCUMENT_PROPERTIES)!.close()
            }
            Designer.commands.c_refresh(0)
        }

        //(Gadgets.get_instance().command_instance as Designer_Commands).refresh()
    }
    //***************************************************************************
    c_cancel():void {
        //Cancel: Abort the changes
        try {
            let modal=GPopup_Windows.get(Page_Name.DESIGNER_DOCUMENT_PROPERTIES)
            if (modal) modal.close()
        } catch (e) {
            Log.logExc("Document_Properties_Commands.cancel",e)
        }
    }
    //***************************************************************************
    c_select_program_id() {
        //Get script command from a list (grid)
        const $=$general$files$read_relative_file
        const request:STAjaxPacket={}
        request[$.I_PATH]=Page_Name.HELP_SCRIPT_FUNCTIONS
        new Ajax().call("Getting program ID: " + this.page_or_definition, $.COMMAND, request, (ajax: Ajax) => {
            try {
                new Grid_Selector(T.t("Select script entry"),Page_Name.DESIGNER_SCRIPT_SELECTOR,
                    (grid:DGrid)=>{//On grid mounted.
                        const content=ajax.getResponse()[$.O_CONTEXT]
                        const data=JSON.parse(content)
                        const rows=data.script_functions
                        const ids:STObjectAny[]=[]

                        //Group ID's to show only one out of the group.
                        for (const row of rows) {

                            let found=false
                            for (const id of ids) {
                                if (id.group===row.group) {
                                    found=true
                                    break
                                }
                            }

                            //Sort
                            ids.sort((a, b) => {
                                return a.id.localeCompare(b.id, "en", { sensitivity: 'base' });
                            });

                            if (!found) {
                                const row_id_value=Properties_Library.extractModuleId_from_GroupPath(row.group)
                                ids.push({id:row_id_value, group:row.group}) 
                            }
                        }
                        grid.body().set_all_rows(ids,true,true)
                    }
                    ,(row:STObjectAny)=>{//On selection.
                        const value=row.id
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