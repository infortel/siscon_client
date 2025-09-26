import Commands from "../../../../slibrary/framework/general/Commands"
import { Utility } from "../../../../slibrary/framework/general/Utility"
import GObject from "../../../../slibrary/general/GObject"
import Log from "../../../../slibrary/general/Log"
import { STAjaxPacket } from "../../../../slibrary/general/STypes"
import T from "../../../../slibrary/translate/T"
import { $database$query_open } from "../../../common/system/ajax/$definitions/database/$database$query_open"
import Ajax from "../../../common/system/ajax/Ajax"
import Sql_Monitor from "./Sql_Monitor"

export class Sql_Monitor_Commands extends Commands {
    //***************************************************************************
    private _master:Sql_Monitor
    //***************************************************************************
    constructor(master:Sql_Monitor) {
        super()
        this._master=master
    }
    //***************************************************************************
    public c_clear_history() {
        //Clear History
        if (this._master._history) {
            this._master._history.body().clear(false)
            this._master.update_controls()
        }
    }
    //***************************************************************************
    private c_open() {
        //Open query
        const sql=this._master.get_sql()
        if (GObject.isInvalid(sql) || sql==="") {
            Log.alert(T.t("No source code was indicated"))
            return
        }

        const $=$database$query_open
        const request: STAjaxPacket = {}
        request[$.I_NAME]="sqlmonitor_"+Utility.timestamp_unique_string()
        request[$.I_SQL]=sql
        request[$.I_COUNT]=this._master.da.request_count.get_value() //Return count row limitation.
        request[$.I_RETURN_ROWS]=1 //Return data
        request[$.I_SUMMARIZE_RESULTS]=1
        request[$.I_DO_AUDIT]=1
        new Ajax().set_omit_sql_audit().call("Open Query", $.COMMAND, request, (ajax: Ajax) => {
            if (ajax.ok()) {
                try {
                    const matrix:Object=ajax.getResponse()[$.O_ROWS]
                    this._master.da.result.dgrid()?.body().set_all_rows(matrix,true,true)
                    this._master.update_controls()
                    if (this._master.da.panel_result.is_hidden()) this._master.da.panel_result.hide(false)

                    const count=ajax.getStr($.O_COUNT)
                    this._master.da.result_count.set_value(count)
                } catch (e) {
                    Log.logExc("Sql_Monitor_Commands.open()",e)
                }
            }
        })

    }
    //***************************************************************************
    public c_clear_result() {
        //Clear results
        this._master._result?.body().clear(true)
        this._master.da.result_count.set_value(null)
    }
    //***************************************************************************
}