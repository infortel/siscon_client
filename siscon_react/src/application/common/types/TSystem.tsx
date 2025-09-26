import GString from "../../../slibrary/general/GString"
import SCookie from "../../../slibrary/general/SCookie"
import SMetrics from "../../../slibrary/general/SMetrics"
import { STAjaxPacket, STCallBack_Error_String, STCallBack_Success, STObjectAny } from "../../../slibrary/general/STypes"
import Server_Command from "../generals/Server_Command"
import Param from "../Param"
import Ajax from "../system/ajax/Ajax"
import T from "../../../slibrary/translate/T"
import Gen from "../../../slibrary/general/Gen"
import { $general$system$evaluate } from "../system/ajax/$definitions/general/system/$general$system$evaluate"

//*************************************************************************************
type TSystemData = {
    baseid: string
    server_version: string
    group:string
    server: string
    database: string
    company_code: string
    branch_code: string
    company_name: string
    company_logo_url: string
    branch_id: string
    login_login: string
    login_code: string
    login_name: string
    login_access: string
    language: string
    daily_rate: string
    format_money: string
    format_inventory: string
    format_short_date: string
    suggest_characters_activate: string
    suggest_time_type_activate: string
    suggest_max_time_search: string
    suggest_max_items: string
    session_id:string
} | null
//*************************************************************************************
export default class TSystem {
//*************************************************************************************
    private _data: TSystemData = {} as TSystemData
    static _group:string|null = null //"infortel"
//*************************************************************************************
    data():TSystemData { return this._data }
//*************************************************************************************
    static getGroup(): string | null {
        return TSystem._group
    }
//*************************************************************************************
    constructor(callbackReady: STCallBack_Error_String) {
        const $=$general$system$evaluate
        const request:STAjaxPacket={}
        request[$.I_GET]={
                 "server_version": "[system.version]"
                , "baseid": "[system.baseid]"
                , "group": "[system.group]"
                , "server": "[system.server]"
                , "database": "[system.database]"
                , "company_code": "[system.company]"
                , "company_name": "[tab.empresa.nombre]"
                , "company_logo_url": "[system.company_logo_url]"
                , "branch_code": "[system.branch_code]"
                , "branch_id": "[system.branch_id]"
                , "login_login": "[system.login.login]"
                , "login_code": "[system.login.code]"
                , "login_name": "[system.login.name]"
                , "login_access": "[system.login.access]"
                , "language": "[system.language]"
                , "daily_rate": "[inisetup.tasa_1]"
                , "format_money": "[ff.m]"
                , "format_inventory": "[ff.i]"
                , "format_short_date": "[ff.sd]"
                , "suggest_characters_activate": "[inisetup.suggest_characters_activate]"
                , "suggest_time_type_activate": "[inisetup.suggest_time_type_activate]"
                , "suggest_max_time_search": "[inisetup.suggest_max_time_search]"
                , "suggest_max_items": "[inisetup.suggest_max_items]"
                , "session_id": "[system.session_id]"
        }
        new Ajax().call(T.t("Reading system data"), $.COMMAND, request, (ajax:Ajax) => {
            this._data = ajax.getObj("get") as TSystemData;
            if (GString.isStringWithText(this._data!.group)) TSystem._group = this._data!.group
            if (Gen.DEVELOPMENT()) {
                SCookie.setCookie(SCookie.DEVELOPMENT_SESSION_ID, this._data!.session_id)
            }

            if (callbackReady) callbackReady(ajax.getError())

        })

    }
//*************************************************************************************
    //getVersion(): string | null {
     //   return Gen.getDataString(this.data.server_version)
    //}
    
//*************************************************************************************
}