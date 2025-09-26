import Commands_General from "../../common/commands/Commands_General"
import { Grid_Selector } from "./Grid_Selector"

export default class Grid_Selector_Commands extends Commands_General {
    //***************************************************************************
    private _master:Grid_Selector
    //***************************************************************************
    constructor(master:Grid_Selector) {
        super()
        this._master=master
    }
    //***************************************************************************
    public c_ok() {
        //Proceed with the selection from the grid.
        this._master._process_ok()
    }
    //***************************************************************************
    public c_cancel() {
        //Cancel the selection.
        this._master.popup_window?.close()
    }
    //***************************************************************************
}