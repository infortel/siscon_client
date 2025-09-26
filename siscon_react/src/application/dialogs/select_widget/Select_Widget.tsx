import CPanel from "../../../slibrary/framework/components/cpanel/CPanel"
import { CTreeItem, TListFromServer } from "../../../slibrary/framework/components/ctree/CTree_Inter"
import CWidgetpanel_Definitions from "../../../slibrary/framework/components/cwidgetpanel/CWidgetpanel_Definitions"
import Gadget from "../../../slibrary/framework/gadget/Gadget"
import Gadgets from "../../../slibrary/framework/gadgets/Gadgets"
import GPopup_Window from "../../../slibrary/framework/popup_windows/GPopup_Window"
import GPopup_Windows from "../../../slibrary/framework/popup_windows/GPopup_Windows"
import Log from "../../../slibrary/general/Log"
import { STAjaxPacket, STCallBack_String, STNull, STObjectAny } from "../../../slibrary/general/STypes"
import T from "../../../slibrary/translate/T"
import Page_Name from "../../common/generals/Page_Name"
import Server_Command from "../../common/generals/Server_Command"
import Metrics from "../../common/metrics/Metrics"
import { $report$get_list } from "../../common/system/ajax/$definitions/report/$report$get_list"
import Ajax from "../../common/system/ajax/Ajax"
import Select_Widget_Commands from "./Select_Widget_Commands"

type TG_Select_Widget = {
    tree: Gadget,
    search: Gadget
}

export default class Select_Widget {
    _callback!: STCallBack_String
    popup_window!: GPopup_Window
    da!: TG_Select_Widget
    //***************************************************************************
    constructor(callback: STCallBack_String) {
        this._callback=callback
        try {
            this._open()
        } catch (e) {
            Log.logExc("Select_Widget.constructor", e)
        }
    }
    //*****************************************************
    private _open(): void {
        GPopup_Windows.open("Select Widget", Page_Name.DIALOG_SELECT_WIDGET, new Select_Widget_Commands(this), true, (popup_window) => {

            //Common dialog assignments
            this.popup_window = popup_window!
            this.da = this.popup_window.gadgets.da as TG_Select_Widget

            if (this.popup_window) {
                if (this.da.search) this.da.search.event.set_on_dynamic_change(this._search_modified_event)
                    //this.c_tree.set_item_clicked_event(this._item_clicked_event)
                    this.da.tree.event.set_onclick(this._item_clicked_event)
                    this._get_tree_data_from_server()
            }
        })

    }
    //*****************************************************
    _get_tree_data_from_server() {
        const $=$report$get_list
        const request: STAjaxPacket = {}
        request[$.I_PATH_PREFIX] = Page_Name.PAGES_PREFIX+ Metrics.WIDGETS_DIRECTORY
        new Ajax().call("Get tee content", $.COMMAND, request, (ajax: Ajax) => {
            if (ajax.ok()) {
                try {
                    const list = ajax.getResponse().data as TListFromServer[]
                    this._remove_prefix_from_server_list(list)
                    if (list) this.da.tree.gtree()!.inter.populate_tree_from_list(list)
                    else Log.alert(T.t("The server has no data for this collection"))
                } catch (e) {
                    Log.logExc(T.t("Error getting tree"), e)
                }

            }
        })
    }
    //------------------------------
    _remove_prefix_from_server_list(list: TListFromServer[]): void {
        const PREFIX_DROP = Page_Name.PAGES_PREFIX + Metrics.WIDGETS_DIRECTORY
        const SUFFIX_DROP = ".json"
        for (let i = 0; i < list.length; i++) {
            let st = list[i].name
            if (st.startsWith(PREFIX_DROP)) st = st.substring(PREFIX_DROP.length, st.length)
            if (st.endsWith(SUFFIX_DROP)) st = st.substring(0, st.length - SUFFIX_DROP.length)
            list[i].name = st
        }

    }
    //*****************************************************
    _search_modified_event = (gadget: Gadget, value: string|STNull) => {
        if (this.da.tree.gtree()) this.da.tree.gtree()!.inter.search(value)
    }
    //*****************************************************
    _item_clicked_event = (event: STObjectAny | STNull, gadget: Gadget) => {
        if (this._callback) this._callback(gadget.get_value())
        this.popup_window!.close()
    }
    //*****************************************************
}