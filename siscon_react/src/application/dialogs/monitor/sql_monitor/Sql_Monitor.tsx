import Gadget from "../../../../slibrary/framework/gadget/Gadget";
import GPopup_Window from "../../../../slibrary/framework/components/popup/logic/GPopup_Window";
import { STNull, STObjectAny } from "../../../../slibrary/general/STypes";
import GPopup_Windows from "../../../../slibrary/framework/components/popup/logic/GPopup_Windows";
import T from "../../../../slibrary/translate/T";
import Ajax from "../../../common/system/ajax/Ajax";
import Log from "../../../../slibrary/general/Log";
import { $tag } from "../../../common/system/$tag";
import SCookie from "../../../../slibrary/general/SCookie";
import { Utility } from "../../../../slibrary/framework/general/Utility";
import { Sql_Monitor_Commands } from "./Sql_Monitor_Commands";
import Page_Name from "../../../common/generals/Page_Name";
import Param from "../../../common/Param";
import { DGrid } from "../../../../slibrary/framework/components/grid/logic/DGrid";


export type Tda = {
    history: Gadget
    queries: Gadget
    panel_history: Gadget
    panel_details: Gadget
    panel_result: Gadget
    filter: Gadget
    request_count: Gadget
    result: Gadget
    result_count: Gadget
 }
export default class Sql_Monitor {

    static COOKIE_QUERY_="sql_monitor.query."
    static TAG_QUERY="query"
    static _instance: Sql_Monitor | null=null

    _popup_window!: GPopup_Window|STNull

    da!: Tda
    _history: DGrid | STNull
    _result: DGrid | STNull
    _is_auditing:boolean=false
    _commands!:Sql_Monitor_Commands
    //***************************************************************************
    static _audit_instance:Sql_Monitor|null
    static get_audit_instance(): Sql_Monitor |null {
        return Sql_Monitor._audit_instance
    }
    //***************************************************************************
    constructor(is_auditing:boolean) {
        try {
            if (is_auditing) Sql_Monitor._audit_instance=this
            this._is_auditing=is_auditing
            this._open()
        } catch (e) {
            Log.logExc("Audit Sql", e)
        }
    }
    //***************************************************************************
    _open() {
        let title=T.t("Sql Monitor");
        if (this._is_auditing) title=T.t("Sql Audit")
        this._commands=new Sql_Monitor_Commands(this)
        GPopup_Windows.open(title, Page_Name.MONITOR_SQL, this._commands,false, (popup_window) => {
            this._popup_window = popup_window
            this._popup_window?.set_on_close(this._on_close.bind(this))
            this.da = popup_window!.gadgets.da as Tda
            popup_window?.gadgets.validate_da(Page_Name.MONITOR_SQL, ["history", "result", "queries", "filter"])
            popup_window?.move_to_zone(false,1,1)
            this._history = this.da.history.dgrid()
            this._result = this.da.result.dgrid()
            this._commands.c_clear_history()
            let heading:any=[]
            heading.push({command: T.t("Command"),activity: T.t("Activity"),details: T.t("Details"), sql_summary: T.t("Sql")})
            this._history!.head().set_all_rows(heading,true, false)           
            Sql_Monitor._instance = this

            this.da.history.set_on_selected(() => { this._on_select() })
            this.update_controls()
            this.da.panel_result.hide(true)

            this._retrieve_previous_queries()
        })
    }
    //***************************************************************************
    public get_sql() {
        return this.get_sql_index(this.da.queries.dtabs()!.get_active_index())
    }
    //***************************************************************************
    public set_sql(text:string|null) {
        return this.set_sql_index(this.da.queries.dtabs()!.get_active_index(),text)
    }
    //***************************************************************************
    public get_sql_index(index:number):string|null {
        const gad=this.da.queries.get_children()[index]
        if (gad) {
            const gadget=gad.get_child_tag(Sql_Monitor.TAG_QUERY)
            if (gadget) return gadget.get_value()
        }
        return null
    }
    //***************************************************************************
    public set_sql_index(index:number, text:string|null):void {
        const gad=this.da.queries.get_children()[index]
        if (gad) {
            const gadget=gad.get_child_tag(Sql_Monitor.TAG_QUERY)
            if (gadget) gadget.set_value(text)
        }
    }
    //***************************************************************************
    private _retrieve_previous_queries() {
        for (let i=0; i<this.da.queries.get_children().length; i++) {
            const text=SCookie.getCookie(Sql_Monitor.COOKIE_QUERY_+i)
            this.set_sql_index(i,text)
        }
    }
    //***************************************************************************
    private _on_close() {
        for (let i=0; i<this.da.queries.get_children().length; i++) {
            let text=this.get_sql_index(i)
            if (!text) text=""
            SCookie.setCookie365(Sql_Monitor.COOKIE_QUERY_+i, text)
            if (this._is_auditing) Sql_Monitor._audit_instance=null
        }
    }
    //***************************************************************************
    private _on_select() {
        const row:number=this._history?.body().get_first_selected_row() || 0;
        const sql = this._history?.body().get(row, "sql");
        this.set_sql(sql);
        this.update_controls();
    }
    public convert_escape() {
        //...
    }
    //***************************************************************************
    public report(ajax: Ajax) :void {
        try {
            const row:number=this._history?.body().get_next_free_row()!
            const SIZE=100
            const traceSql:string[]=ajax.getResponse()[$tag.I_TRACE_SQL]
            if (!traceSql) return

            for (const sql of traceSql) {
                let ok:boolean=true
                let filter:string=this.da.filter.get_value()
                if (filter) {
                    if (filter!=="*") {
                        ok=false
                        filter=filter.toLowerCase()
                        if (this._report_check(filter, sql as string)) ok=true
                    }
                }

                if (ok) {
                    let sql_summary=sql.replace(/\\n/g, '\n')
                    if (sql_summary.length>SIZE) sql_summary=sql_summary.substring(0,SIZE-1)+"..."
                    const body=this._history!.body()
                    body.set(row,"command",ajax.getCommand())
                    body.set(row,"activity",ajax.getTitle())
                    body.set(row,"details",Param.p.system.data()?.company_code)
                    body.set(row,"sql_summary",sql_summary)
                    body.set(row,"sql",sql)
                }
            }
        } catch (e) {
            Log.logExc("Sql_Monitor.report",e)
        }
    }
    private _report_check(filter:string, value:string|null):boolean {
        if (!value) return false
        return (value.toLocaleLowerCase().indexOf(filter)>=0)
    }   
    //***************************************************************************
    public is_auditing():boolean {
        return this._is_auditing
    }
    //***************************************************************************
    public update_controls() {
        let hideHis=false
        let hideDet=false
        let hideRes=false
        if (this._is_auditing) {
            hideDet=(this._history?.body().get_next_free_row()===0)
        } else {
            hideHis=true
        }
        this.da.panel_history.hide(hideHis)
        this.da.panel_details.hide(hideDet)

    }
    //***************************************************************************
    public get_filter():string | null {
        if (this.da && this.da.filter) return this.da.filter!.get_value()
        return null
    }
    //***************************************************************************
    }
