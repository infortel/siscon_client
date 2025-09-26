import LServer from "../../slibrary/server_interface/LServer";
import Gen from "../../slibrary/general/Gen";
import Gadgets from "../../slibrary/framework/gadgets/Gadgets";
import Login_Popup from "../dialogs/login/Login_Popup";
import Log from "../../slibrary/general/Log";
import SEvaluate from "../../slibrary/sevaluations/SEvaluate";
import Program_Base from "./entry/Program_Base";
import { STCallBack_Error_String, STNull, STObjectAny } from "../../slibrary/general/STypes";
import Metrics from "./metrics/Metrics";
import TSystem from "./types/TSystem";
import Ajax from "./system/ajax/Ajax";


export default class Param {
    //*****************************************************
    static p:Param
    //refresh=null
    //_user: TUser=null
    _program!: Program_Base //The ! tells typescript that I am certain that the variable is going to be initialized.
    static DEVELOPMENT_URL="http://localhost:8080/automate1_server/"
    static SERVICE_URL_SUFFIX="service"
    static PORTAL_URL_SUFFIX = "portal"
    system: TSystem;
    //*****************************************************
    constructor(returnReady: STCallBack_Error_String) {

        if (Gen.DEVELOPMENT()) {
            console.log("*****************************************************************")
            console.log("**************************** DEVELOPING *************************")
            console.log("*****************************************************************")
        }

        Param.p = this
        new Metrics()
        new LServer()

        this.system = new TSystem((error: string | null) => {
            if (returnReady) returnReady(error)
        })
      }
    //*****************************************************
    set_program(program:Program_Base):void {this._program=program}
    get_program():Program_Base {return this._program}
    //*****************************************************
    adjust_url(url:string):string {
        if (Gen.DEVELOPMENT()) {
            if (url.startsWith(Param.PORTAL_URL_SUFFIX+"/")) {
                url=Param.DEVELOPMENT_URL+url
            }
        }
        return url
    }
    //*****************************************************
    /*
    get_user():TUser {
        return this._user
    }
    //*****************************************************
    set_user(user:TUser):void {
        this._user=user;
        if (GObject.isValid(user)) Gadgets.set_user_access(user!.access)
        //alert("user = "+JSON.stringify(this._user))
    }
    */
    //*****************************************************
    evaluateStr(text:string):string | null{
        return SEvaluate.Str(text)
    }
    //*****************************************************
    refresh_all_reading_system_data(returnReady: STCallBack_Error_String|STNull) {
        this.system = new TSystem((error: string | null) => {
        Gadgets.inst().update_state_and_evaluations()
            if (returnReady) {
                returnReady(error)
            }
        })
        //Gadgets.clear_complete_react_cache_data()
        //Gadgets.inst().forEach(Gadgets.LEVEL_DEEP, (gadget) => {
        //    gadget.activate_rendering()
        //})
    }
    //*****************************************************
    //*****************************************************
}