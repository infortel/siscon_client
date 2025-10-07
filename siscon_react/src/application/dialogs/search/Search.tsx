import CGrid from "../../../slibrary/framework/components/grid/comp/CGrid"
import Gadget from "../../../slibrary/framework/gadget/Gadget"
import { DGrid } from "../../../slibrary/framework/components/grid/logic/DGrid"
import { TGridRowData } from "../../../slibrary/framework/components/grid/logic/DGrid_data_base"
import GPopup_Window from "../../../slibrary/framework/components/popup/logic/GPopup_Window"
import GPopup_Windows from "../../../slibrary/framework/components/popup/logic/GPopup_Windows"
import GObject from "../../../slibrary/general/GObject"
import GString from "../../../slibrary/general/GString"
import Log from "../../../slibrary/general/Log"
import { STAjaxPacket, STCallBack_String, STGadget_event, STNull, STObjectAny } from "../../../slibrary/general/STypes"
import Page_Name from "../../common/generals/Page_Name"
import Server_Command from "../../common/generals/Server_Command"
import { $general$search$master } from "../../common/system/ajax/$definitions/general/search/$general$search$master"
import Ajax from "../../common/system/ajax/Ajax"
import Search_Commands from "./Search_Commands"

export type Tda = {
    pattern: Gadget,
    grid: Gadget,
 }

export default class Search {
    static _instance: Search
    _popup_window!: GPopup_Window|STNull
    da!: Tda

    _grid: DGrid|STNull
    _on_response: STCallBack_String | STNull = null
    _pattern: string | null=null
    _tablename: string = ""
    _keyfield:string=""
    _last_count:number=0
    //***************************************************************************
    constructor() {
        try {
        } catch (e) {
            Log.logExc("Search", e)
        }
    }
    //***************************************************************************
    search(tablename: string, keyfield: string, pattern:string, on_response: STCallBack_String) {
        this._tablename = tablename
        this._keyfield=keyfield
        this._pattern=pattern
        this._on_response = on_response
        this._execute_search()
    }   
    //***************************************************************************
    _execute_search() {
        const SEARCH_LIMIT = 200
        if (GString.isStringWithText(this._pattern)) {

            const $=$general$search$master
            const request: STAjaxPacket = {}
            request[$.I_TABLE]=this._tablename
            request[$.I_PATTERN]=this._pattern
            request[$.I_LIMIT]=SEARCH_LIMIT.toString()
            new Ajax().call("Search Master", $.COMMAND, request, (ajax: Ajax) => {
                if (ajax.ok()) {
                    try {
                        this._last_count = GObject.toNumber(ajax.getResponse().count)
                        if (this._last_count == 1) {
                            const row = ajax.getResponse().data[0]
                            this._execute_response(Object.values(row)[0] as string)
                        } else {
                            this._populate(ajax.getResponse().data as TGridRowData)
                        }
                    } catch (e) {
                        Log.logExc("Search._execute_search()",e)
                    }
                }
            })
        } else {
            if (this._popup_window) {
                //Do nothing.
            } else {
                this._open_window([])
            }
        }
    }
    //***************************************************************************
    _open_window(data: TGridRowData) {
        GPopup_Windows.open("Document Properties", Page_Name.DIALOG_SEARCH, new Search_Commands(this), true, (popup_window) => {
            this._popup_window = popup_window
            this.da = popup_window!.gadgets.da as Tda
            popup_window?.gadgets.validate_da(Page_Name.DIALOG_SEARCH, ["pattern", "grid"])
            this._grid = this.da.grid.dgrid() as DGrid

            this._populate_now(data)
            this.da.pattern.set_value(this._pattern)
            this.da.pattern.event.set_onKeyDown(this._eventKeyDown)
            this.da.pattern.set_focus()
            this.da.grid.set_on_selected(() => {
                const row = this._grid!.body().get_first_selected_row()
                if (row) {
                    let code:string=this._grid!.body().get(row,0)
                    this._execute_response(code)
                }
            })
        })
    }
    //***************************************************************************
    private _eventKeyDown = (event: STObjectAny | STNull, gadget: Gadget) => {
        //if (event) console.log('Key down event:', event.key);
        if (event) {
            let direction=0
            if (event.key==="ArrowDown") direction=1
            else if (event.key==="ArrowUp") direction=-1
            else if (event.key==="Enter") {
                if (this._grid) {
                    const row = this._grid.body().get_first_selected_row()
                    if (row) {
                        let code:string=this._grid.body().get(row,this._keyfield)
                        this._execute_response(code)
                    }
                }
            } else if (event.key==="Escape") {
                this._execute_response(null)
            }
            if (direction!=0) {
                this._grid!.body().roll_selection(direction)
                event.preventDefault()
            }
        }
    }
    //***************************************************************************
    private _populate(data: STObjectAny) {
        try {
            if (GObject.isValid(this._popup_window)) {
                this._populate_now(data)
            } else {
                this._open_window(data)
            }
        } catch (e) {
            Log.logExc("_Search._populate()",e)
        }
       
    }
    //***************************************************************************
    private _populate_now(data: TGridRowData) {
        try {
            if (data) {
                this._grid!.display().set_general_filter_display(this._pattern)
                this._grid!.body().set_all_rows(data,true,true)
                this._grid!.body().set_selection_count(1)
                this._grid!.body().set_selected(true,0)
                this.da.grid.forceUpdate()
            } else {
                this._grid!.body().clear(true)
            }
        } catch (e) {
            Log.logExc("Search._populate_now()", e)
        }
    }
    //***************************************************************************
    _execute_response(result:string|STNull) {
        if (this._popup_window) {
            this._popup_window.close()
            this._popup_window = null
        }
        if (this._on_response) this._on_response(result)
    }
    //***************************************************************************
}