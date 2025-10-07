import GPopup_Windows from "../../../slibrary/framework/components/popup/logic/GPopup_Windows"
import Log from "../../../slibrary/general/Log"
import { STAjaxPacket } from "../../../slibrary/general/STypes"
import T from "../../../slibrary/translate/T"
import Commands_General from "../../common/commands/Commands_General"
import Page_Name from "../../common/generals/Page_Name"
import Metrics from "../../common/metrics/Metrics"
import { $report$update_list } from "../../common/system/ajax/$definitions/report/$report$update_list"
import Ajax from "../../common/system/ajax/Ajax"
import Select_Widget from "./Select_Widget"

export default class Select_Widget_Commands extends Commands_General {
    //***************************************************************************
    _master:Select_Widget
   //***************************************************************************
    constructor(master:Select_Widget) {
        super()
        this._master=master
    }
    //***************************************************************************
    c_select() {
        //Select widget
        this.c_close()
        this._master._callback('desk/widgets/inspect/inventory')
    }
    //***************************************************************************
    c_expand_all(logic: boolean, depth:number) {
        //Expand all
        if (this.m.da.tree.gtree()) this.m.da.tree.gtree()!.inter.expand_all(logic, depth)
    }
    //***************************************************************************
    c_close() {
        //Close
        GPopup_Windows.close(Page_Name.DIALOG_SELECT_WIDGET)
    }
    //***************************************************************************
    c_update() {
        //Update
        const request: STAjaxPacket = {}
        const $=$report$update_list
        request["path_prefix"] = Page_Name.PAGES_PREFIX+Metrics.WIDGETS_DIRECTORY
        new Ajax().call("Get tee content", $.COMMAND, request, (ajax: Ajax) => {
            if (ajax.ok()) {
                try {
                    this._master._get_tree_data_from_server()
                    Log.autoclose_popup("Widget list updated")
                } catch (e) {
                    Log.logExc(T.t("Error getting tree"), e)
                }

            }
        })
    }
    //***************************************************************************
}