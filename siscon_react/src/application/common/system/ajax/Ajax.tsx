import {STAjaxPacket, STNull, STObjectAny} from "../../../../slibrary/general/STypes";
import GString from "../../../../slibrary/general/GString";
import TSystem from "../../types/TSystem";
import LServer from "../../../../slibrary/server_interface/LServer";
import GObject from "../../../../slibrary/general/GObject";
import Log from "../../../../slibrary/general/Log";
import T from "../../../../slibrary/translate/T";
import Login_Popup from "../../../dialogs/login/Login_Popup";
import SMetrics from "../../../../slibrary/general/SMetrics";
import Ajax_Monitor from "../../../dialogs/monitor/ajax_monitor/Ajax_Monitor";
import Sql_Monitor from "../../../dialogs/monitor/sql_monitor/Sql_Monitor";
import { $tag } from "../$tag";

type TypeOnResponseServer = (ajax:Ajax) => void

//*****************************************************
class CallParameters {
    title:string|null=null
    par: STObjectAny = {}
    request: STObjectAny | null = null
    error: string | null = null
    response: STObjectAny = {}
    onResponse: TypeOnResponseServer | null = null
}
//*****************************************************
export default class Ajax {

    static _PROGRESS_TIME_PERIOD=2000
    static _last_baseid: string|null=null
    private _baseid: string | null = null
    private _title: string | null = null
    private _request: STAjaxPacket = {}
    private _response: STAjaxPacket = {}
    private _options: STObjectAny = {}
    private _onResponse: TypeOnResponseServer|null=null
    private _error: string | null = null
    private _could_not_contact_server:boolean=false
    private _command: string | null = null
    private static _count:number=0
    private _id:number
    private _omit_sql_audit=false
    //private _progress_processid: string | null=null
    //*****************************************************
    //private _progressWaitingResponse: TypeOnResponseServer|null=null
    //*****************************************************
    //***************************************************************************
    constructor() {
        this._id=Ajax._count
        Ajax._count++
    }
    //*****************************************************
    public to_omit_error(): Ajax {
        this._options = { ...this._options, omit_error: true }
        return this
    }
    //*****************************************************
    public to_omit_login(): Ajax {
        this._options = { ...this._options, omit_login: true }
        return this
    }
    //*****************************************************
    //par.omit_error, par.omit_login
    public call(title: string, command:string, request: STObjectAny, onResponse: TypeOnResponseServer|null) {
        this._title = title
        this._command = command
        this._request = request
        this._onResponse = onResponse
        this._response = {}

        this._request[$tag.I_COMMAND]=command
        this._request[$tag.I_GROUP]=GString.nullToText(TSystem.getGroup())

        this._callServer()
    }
    //*****************************************************
    public set_omit_sql_audit():Ajax {
        this._omit_sql_audit=true
        return this
    }
    //*****************************************************
    private _callServer() {
        this._processBeforeCall()
        LServer.inst().call(GString.nullToText(this._title), this._request, false, (error: string | null, response: STObjectAny) => {
            this._error = error;
            this._response = response
            this._processServerResponse()
        })
    }
    //*****************************************************
    private _processBeforeCall() {
        try {
            
            //Add baseid.
            if (Ajax.getLastBaseid() != null) if (this._baseid == null) {
                this._request[$tag.O_BASEID]=Ajax.getLastBaseid()
            }

            //Add sql_monitor request if needed.
            if (Sql_Monitor.get_audit_instance() && (!this._omit_sql_audit)) {
                this._request[$tag.I_TRACE_SQL]=Sql_Monitor.get_audit_instance()?.get_filter()
            }


            if (Ajax_Monitor.get_audit_instance()) Ajax_Monitor.get_audit_instance()!.report(true,this,this._request)

        } catch (e) {
            Log.logExc("Ajax._processBeforeCall", e)
        }
    }
    //*****************************************************
    private _processAfterCallAudit() {
        if (Sql_Monitor.get_audit_instance() && (!this._omit_sql_audit)) {
            Sql_Monitor.get_audit_instance()?.report(this)
        }
        if (Ajax_Monitor.get_audit_instance()) Ajax_Monitor.get_audit_instance()!.report(false,this,this._response)
    }
    //*****************************************************
    private _processServerResponse(): void {

        if (this._error === null) {

             //Verify if error and report.
            if (GObject.isValid(this._response.error)) {
                this._error = T.t("Error from Server. - ") + this._response.error + "\n\n" + JSON.stringify(this._request)
            }

            
            //Verify progress report.
            let unterminated = false
            if (this._error === null) {
                this._processAfterCallAudit()
                if (GObject.isValid(this._response.unterminated))
                    if (GObject.isTrue(this._response.unterminated))
                        if (GObject.isValid(this._response.processid)) {
                            const processid = this._response.processid
                            unterminated = true
                            this._openContinueProgress_wait(processid)
                }
            }

            if (!unterminated) {
                 //Verify login status.
                let processing_login = false
                if (this._login_is_required()) {
                    processing_login = true
                     this._execute_login()
                }

                if (this._error === null) {

                    //Extract baseid
                    if (this._response.baseid) {
                        this._baseid = this._response.baseid
                        Ajax._last_baseid = this._baseid
                    }

                    if (GObject.isValid(this._response.alert)) {
                        Log.alert(T.t("Alert from server:")+"\n\n"+this._response.alert)
                    }

                } else {
                    if ((!(this._options.omit_error)) && (!processing_login)) Log.alert(this._error)
                }

                if (!processing_login) {
                    if (this._onResponse) this._onResponse(this)
                }
            }


        } else {
            this._could_not_contact_server = true
            this._returnWithError(this._request)
        }
    }
    //*****************************************************
    private _login_is_required() {
        if (this._error) if (!(this._options.omit_login)) {
            if (this._error.search("//{login required}") >= 0) {
                return true
            }
        }
        return false

    }
    //*****************************************************
    private _execute_login() {
       Login_Popup.inst().open(null, (success: boolean) => {
            if (success) {
                this._callServer()
            }
        })
    }
    //*****************************************************
    private _openContinueProgress_wait(processid:string): void {
        setTimeout(() => { this._openContinueProgress(processid)},Ajax._PROGRESS_TIME_PERIOD)
    }
   //*****************************************************
    private _openContinueProgress(processid:string): void {
        const request: STObjectAny = {
            command: "general.system.progress",
            processid: processid,
            group: GString.nullToText(TSystem.getGroup())
        }
        LServer.inst().call("Calling progress", request, false, (error: string | null, response: STObjectAny) => {
            if (error === null) {

                //Verify if error and report.
                if (GObject.isValid(response.error)) {
                    //Error from server.
                    this._reportProgressClose(processid);
                    this._error = T.t("Error from progress window connection...") + " " + response.error
                    this._returnWithError(request)
                } else {
                    //No error from server.
                    if (GObject.isValid(response.ready)) {
                        if (response.ready === "1") {
                            //Valid data received
                            this._reportProgressClose(processid);
                            this._response=response
                            this._processServerResponse()
                        } else {
                            //Continue with progress.
                            this._reportProgressClose(processid);
                            this._error = T.t("Error in progress response (ready!=1)")
                            this._returnWithError(this._request)
                        }
                    } else {
                        //Continue with progress check.
                        this._reportProgress(response,processid)
                        this._openContinueProgress_wait(processid)
                    }
                }
            } else {
                this._error=error
                this._returnWithError(request)
            }
        })       
    }
    //*****************************************************
    private _returnWithError(request: STObjectAny) {
        let sterror = this._error + "\n\nRequest: " + JSON.stringify(request)
        if (this._could_not_contact_server) sterror = T.t("Could not connect to server:") + " " + SMetrics.inst().get_server_url_service()
        if (!(this._options.omit_error)) Log.alert("Error on server call (progress): " + this._title
            + "\n\nError detail: " + sterror         
        )
        if (this._onResponse) this._onResponse(this)
    }
    //*****************************************************
    private _reportProgress(response: STObjectAny, processid: string) {
        console.log("//## Reporting Progress: "+processid)
        if (response.readings) {
            for (let i: number = 0; i < response.readings.length; i++) {
                const read: STObjectAny = response.readings[i]
                console.log("Progress: "+read.title)
            }
        }
    }
    //*****************************************************
    private _reportProgressClose(processid: string) {
        console.log("//## End of progress: "+processid)
    }
    //*****************************************************
    public static getLastBaseid(): string | null {
        return Ajax._last_baseid

    }
    //*****************************************************
    public getBaseid(): string | null {
        return this._baseid

    }
   //*****************************************************
    public ok(): boolean {
        if (this._error === null) return true
        return false
    }
    //*****************************************************
    public getError(): string |null {
        return this._error
    }
    //*****************************************************
    getResponse(): STObjectAny {
        return this._response
    }
    //*****************************************************
    public addOptions(opt: STObjectAny): void {
        this._options = { ...this._options, ...opt }
    }
    //*****************************************************
    public getStr(name: string): string | null {
        let result: string | null = null
        if (this._response) {
            if (GString.isString(this._response[name])) {
                result = this._response[name]
            }
        }

        return result
    }
    //*****************************************************
    public getNumber(name: string): number {
        let result: number = 0
         if (this._response) {
             const obj: any = this._response[name]
             if (GObject.isValid(obj)) {
                 if (GString.isString(obj)) result = GObject.toNumber(obj)
                 else if (obj.is(Number)) result=obj
             }
        }
        return result
    }
    //*****************************************************
    public getObj(name: string): STObjectAny {
        let result: STObjectAny = {}
        if (this._response) {
            if (this._response[name] instanceof Object) {
                result = this._response[name] as Object
            }
        }

        return result
    }
    //*****************************************************
    public instant_message() {
        if (this._response) if (this._response.message) {
            Log.autoclose_popup(this._response.message)
        }
    }
    //*****************************************************
    public instant_text(text:string) {
        Log.autoclose_popup(text)
    }
   //*****************************************************
   public getCommand(): string|null {
       return this._command
   }
   //*****************************************************
   public getTitle(): string|null {
       return this._title
   }
   //*****************************************************
   public getId(): number {
       return this._id
   }
   //*****************************************************

}