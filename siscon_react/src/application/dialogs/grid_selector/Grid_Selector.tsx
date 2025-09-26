import Gadget from "../../../slibrary/framework/gadget/Gadget";
import { DGrid } from "../../../slibrary/framework/gadget/gadget_data/dgrid/DGrid";
import GPopup_Window from "../../../slibrary/framework/popup_windows/GPopup_Window";
import GPopup_Windows from "../../../slibrary/framework/popup_windows/GPopup_Windows";
import Log from "../../../slibrary/general/Log";
import { STCallBack_String, STNull, STObjectAny } from "../../../slibrary/general/STypes";
import T from "../../../slibrary/translate/T";
import Grid_Selector_Commands from "./Grid_Selector_Commands";

export type Tda = {
    grid: Gadget,
    ok: Gadget
    cancel: Gadget
}

export type TGrid_Selector_OnPopulate = (grid: DGrid) => void
export type TGrid_Selector_OnSelection = (row: STObjectAny) => void

export class Grid_Selector {
    private _title:string
    private _pagename:string
    private _on_populate:TGrid_Selector_OnPopulate|null
    private _on_selection:TGrid_Selector_OnSelection|null

    public popup_window:GPopup_Window|STNull
    private da!:Tda
    private _grid!:DGrid

    //***************************************************************************
    constructor (title:string, pagename:string, on_populate:TGrid_Selector_OnPopulate, on_selection: TGrid_Selector_OnSelection) {
        this._title=title
        this._pagename = pagename
        this._on_populate=on_populate
        this._on_selection=on_selection


        this._open_window()
    }
    //***************************************************************************
    _open_window() {
        GPopup_Windows.open(this._title, this._pagename, new Grid_Selector_Commands(this), true, (popup_window) => {
            this.popup_window = popup_window
            this.da = popup_window!.gadgets.da as Tda
            popup_window?.gadgets.validate_da(this._pagename, ["grid"])
            this._grid = this.da.grid.dgrid() as DGrid
            this._grid.body().set_selection_count(1)
            this.da.grid.event.set_onclick((event: STObjectAny|STNull, gadget:Gadget)=>{
                this._process_ok()
            })

            if (this._on_populate) this._on_populate(this._grid)
            popup_window?.move_to_zone(true,1,1)
        })
    }
    //***************************************************************************
    _process_ok() {
        if (this._on_selection) {
            const row=this._grid.body().get_first_selected_row()
            if (row<0) {
                Log.alert(T.t("You need to make your selection first"))
            } else {
                if (this._on_selection) {
                    const rowData=this._grid.body().get_row_data(row)
                    if (rowData) this._on_selection(rowData); else Log.alert(T.t("Invalid row information selected"))
                }
            }
        }
        this.popup_window?.close()

    }
    //***************************************************************************
}