import Commands_General from "../../../common/commands/Commands_General";
import Gadgets from "../../../../slibrary/framework/gadgets/Gadgets";
import Param from "../../../common/Param";
import Log from "../../../../slibrary/general/Log";
import { STAjaxPacket, STNull, STObjectAny } from "../../../../slibrary/general/STypes";
import Ajax from "../../../common/system/ajax/Ajax";
import GObject from "../../../../slibrary/general/GObject";
import { $master$read } from "../../../common/system/ajax/$definitions/master/$master$read";
import { $master$write } from "../../../common/system/ajax/$definitions/master/$master$write";
import Master from "./Master";

export default class Master_Commands extends Commands_General {
    private _master:Master
    //***************************************************************************
    constructor(master:Master) {
        super()
        this._master=master
    }
    //***************************************************************************
    c_read():void {
        //Read record from database
        const $=$master$read
        const request:STAjaxPacket={}
        Gadgets.inst().forEach(Gadgets.LEVEL_BASIC, (gadget)=>{
            let table: string|STNull = gadget.def.table()
            let field: string|STNull= gadget.def.field0()
            if ((table) && (field)) {
                //if (!(datas[table])) datas[table]=[]
                if (!(GObject.getObjectValue(request, table))) GObject.setObjectValue(request,table,[])
                //datas[table].push(field)
                GObject.getObjectValue(request, table).push(field)
                }
            })
        new Ajax().call("Create Directory",$.COMMAND, request,(ajax:Ajax)=>{
            if (ajax.ok()) {
                this._read_assign_result(ajax.getResponse())
            }
        })
    }
    //*************************************
    _read_assign_result(result: STObjectAny): void {
        let datas=result["datas"]
        Gadgets.inst().forEach(Gadgets.LEVEL_BASIC, (gadget)=>{
            let table=gadget.def.table()
            let field = gadget.def.field0()
            if ((table)&&(field)) {
                if (datas[table]) {
                    let value=datas[table][field]
                    gadget.set_value(value)
                }
            }
        })
    }
    //***************************************************************************
    c_save():void {
        //Save record into database
        const $=$master$write
        let request:STAjaxPacket={}
        Gadgets.inst().forEach(Gadgets.LEVEL_BASIC, (gadget)=>{
            let table = gadget.def.table()
            let field = gadget.def.field0()
            if ((table) && (field)) if (gadget.get_modifications() > 0) {
                //if (!(datas[table])) datas[table] = {}
                if (!(GObject.getObjectValue(request, table))) GObject.setObjectValue(request, table, {})
                //datas[table][field] = gadget.get_value()
                const datasTable: STObjectAny = GObject.getObjectValue(request, table)
                GObject.setObjectValue(datasTable,field,gadget.get_value())
            }
        })
        new Ajax().call("Create Directory",$.COMMAND,request,(ajax:Ajax)=>{
            if (ajax.ok()) {
                ajax.instant_message()
                Gadgets.inst().clear_modifications()
            }
        })
    }
    //***************************************************************************
}