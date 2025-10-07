import Gadget from "../../../../slibrary/framework/gadget/Gadget";
import GPopup_Window from "../../../../slibrary/framework/components/popup/logic/GPopup_Window";
import {STNull} from "../../../../slibrary/general/STypes";
import Log from "../../../../slibrary/general/Log";
import GPopup_Windows from "../../../../slibrary/framework/components/popup/logic/GPopup_Windows";
import Ajax_Monitor_Commands from "./Ajax_Monitor_Commands";
import T from "../../../../slibrary/translate/T";
import Ajax from "../../../common/system/ajax/Ajax";
import Page_Name from "../../../common/generals/Page_Name";
import { DGrid } from "../../../../slibrary/framework/components/grid/logic/DGrid";

export type Tda = {
    history: Gadget
    content: Gadget
    panel_details: Gadget
    panel_history: Gadget
    filter: Gadget
 }
export default class Ajax_Monitor {
    static _audit_instance: Ajax_Monitor | null=null
    
    static OUT_DIRECTION="Out";
    static IN_DIRECTION="Inc";

    static OUT_STYLE={background: "#f9eecdff"};
    static IN_STYLE={background: "#def5ff"};

    _popup_window!: GPopup_Window|STNull
    _is_auditing:boolean=false

    da!: Tda
    _history: DGrid | STNull
    //***************************************************************************
    static get_audit_instance(): Ajax_Monitor |null {
        return Ajax_Monitor._audit_instance
    }
    //***************************************************************************
    constructor(_is_auditing:boolean) {
        try {
            this._is_auditing = _is_auditing
            if (this._is_auditing) Ajax_Monitor._audit_instance=this
            this._open()
        } catch (e) {
            Log.logExc("Audit Ajax", e)
        }
    }
    //***************************************************************************
    private _on_close() {
        this._history?.body().clear(true);
        if (this._is_auditing) Ajax_Monitor._audit_instance = null
    }
    //***************************************************************************
    _open() {
        GPopup_Windows.open("Ajax Audit", Page_Name.MONITOR_AJAX_MONITOR, new Ajax_Monitor_Commands(this),false, (popup_window) => {
            this._popup_window = popup_window
            this._popup_window?.set_on_close(this._on_close.bind(this))
            this.da = popup_window!.gadgets.da as Tda
            popup_window?.gadgets.validate_da(Page_Name.MONITOR_AJAX_MONITOR, ["history", "content", "filter"])
            popup_window?.move_to_zone(false,1,1)
            this._history = this.da.history.dgrid()
            let heading:any=[]
            heading.push({id:T.t("Id"),command: T.t("Command"),title: T.t("Title"),packet_details: T.t("Packet")})
            this._history!.head().set_all_rows(heading,true,false)           
            Ajax_Monitor._audit_instance = this

            this._history?.add_row_style_difinition(Ajax_Monitor.IN_DIRECTION,Ajax_Monitor.IN_STYLE);
            this._history?.add_row_style_difinition(Ajax_Monitor.OUT_DIRECTION,Ajax_Monitor.OUT_STYLE);
            this.da.history.set_on_selected(() => { this._on_select() })
            this.da.content.set_value(null)
            this.update_controls();
        })
    }
    //***************************************************************************
    private _on_select() {
        const row:number=this._history?.body().get_first_selected_row() || 0;
        const packet = this._history?.body().get(row, "packet");
        this.da.content.set_value(JSON.stringify(packet, null, 2));
        this.update_controls();
    }
    public convert_escape() {
        let text=this.da.content.get_value();
        text=text.replace(/\\'/g, "'")
        text=text.replace(/\\"/g, '"')
        text=text.replace(/\\n/g, '\n')
        this.da.content.set_value(text)
    }
    //***************************************************************************
    public report(is_request:boolean, ajax: Ajax, packet: Object) :void {
        try {
            if (!this.da) return
            const row:number=this._history?.body().get_next_free_row()!
            let packet_details=JSON.stringify(packet,null,0)
            const SIZE=100

            let id
            if (is_request) {
                id=Ajax_Monitor.OUT_DIRECTION+ajax.getId()
                this._history?.set_row_style_name(row,Ajax_Monitor.OUT_DIRECTION)
            } else {
                id=Ajax_Monitor.IN_DIRECTION+ajax.getId()
                this._history?.set_row_style_name(row,Ajax_Monitor.IN_DIRECTION)
            }

            let ok:boolean=true
            let filter:string=""
            if (this.da.filter) this.da.filter.get_value()
            if (filter) {
                if (filter!=="*") {
                    ok=false
                    filter=filter.toLowerCase()
                    if (this._report_check(filter,ajax.getCommand())) ok=true
                    else if (this._report_check(filter,ajax.getTitle())) ok=true
                    if (this._report_check(filter,packet_details)) ok=true
                }
            }

            if (ok) {
                if (packet_details.length>SIZE) packet_details=packet_details.substring(0,SIZE-1)+"..."
                const body=this._history!.body()
                body.set(row,"id",id)
                body.set(row,"command",ajax.getCommand())
                body.set(row,"title",ajax.getTitle())
                body.set(row,"packet_details",packet_details)
                body.set(row,"packet",packet)
            }
        } catch (e) {
            Log.logExc("Ajax_Monitor.report",e)
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
        if (this._is_auditing) {
            hideDet=(this._history?.body().get_next_free_row()===0)
        } else {
            hideHis=true
        }
        this.da.panel_history.hide(hideHis)
        this.da.panel_details.hide(hideDet)

    }
    //***************************************************************************
    }
