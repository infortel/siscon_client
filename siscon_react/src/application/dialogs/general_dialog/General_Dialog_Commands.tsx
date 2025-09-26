import Commands_General from "../../common/commands/Commands_General"
import General_Dialog from "./General_Dialog"

export default class General_Dialog_Commands extends Commands_General {
    private _master:General_Dialog
    //***************************************************************************
    constructor(master:General_Dialog) {
        super()
        this._master=master
    }
    //***************************************************************************
}