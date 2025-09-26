import Commands from "../../../../slibrary/framework/general/Commands";
import Ajax_Monitor from "./Ajax_Monitor";

export default class Ajax_Monitor_Commands extends Commands {
    //***************************************************************************
    private _master:Ajax_Monitor
    //***************************************************************************
    constructor(master:Ajax_Monitor) {
        super()
        this._master=master
    }
    //***************************************************************************
    public c_convert_escape() {
        //Convert escape characters
        Ajax_Monitor.get_audit_instance()?.convert_escape()
    }
    //***************************************************************************
    public c_clear_history() {
        //Clear history
        Ajax_Monitor.get_audit_instance()?._history?.body().clear(false)
        Ajax_Monitor.get_audit_instance()?.update_controls()
    }
    //***************************************************************************
}