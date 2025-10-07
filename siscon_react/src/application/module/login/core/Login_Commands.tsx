import Commands_General from "../../../common/commands/Commands_General";
import Log from "../../../../slibrary/general/Log";
import Param from "../../../common/Param";
import Gadgets from "../../../../slibrary/framework/gadgets/Gadgets";
import { STAjaxPacket, STNull } from "../../../../slibrary/general/STypes";
import Ajax from "../../../common/system/ajax/Ajax";
import Metrics from "../../../common/metrics/Metrics";
import { $general$system$change_password } from "../../../common/system/ajax/$definitions/general/system/$general$system$change_password";
import GObject from "../../../../slibrary/general/GObject";
import GPopup_Windows from "../../../../slibrary/framework/components/popup/logic/GPopup_Windows";
import Page_Name from "../../../common/generals/Page_Name";
import SCookie from "../../../../slibrary/general/SCookie";
import Login_Constants, { T_Login_da } from "./Login_Constants";
import { $general$system$login } from "../../../common/system/ajax/$definitions/general/system/$general$system$login";
import T from "../../../../slibrary/translate/T";
import { $tag } from "../../../common/system/$tag";
import Login_Popup from "../../../dialogs/login/Login_Popup";

export class Login_Commands extends Commands_General {
    //***************************************************************************
    public static _instance: Login_Commands
    public static test1="Ferdi"
    //***************************************************************************
    public static inst(): Login_Commands {
         if (!Login_Commands._instance) new Login_Commands()
       return Login_Commands._instance
    }
    //***************************************************************************
    constructor() {
        super()
        Login_Commands._instance=this
    }
    //***************************************************************************
    /* //This was with normal login.
    process_login():void {
        const comm=Login_Popup_Commands.inst()
        comm._login((error) => {
            if (error === null) {
                window.open("./" + Metrics.inst().get_default_index_html(), "_self");
                } else {
                    Log.alert(error!)
                }
            })
    }
            */
    //***************************************************************************
    c_process_login() {
        //Execute login
        this._login((error) => {
            if (GObject.isInvalid(error)) {
                if (GPopup_Windows.get_open_window(Page_Name.DIALOG_POPUP_LOGIN)) {
                    GPopup_Windows.close(Page_Name.DIALOG_POPUP_LOGIN)
                    Param.p.refresh_all_reading_system_data(null)
                    if (Login_Popup.inst().callOnLogin) Login_Popup.inst().callOnLogin!(GObject.isInvalid(error))
                } else {
                    window.open("./" + Metrics.inst().get_default_index_html(), "_self");
                }
            } else {
                Log.alert(error!)
            }
            //
        })
     }
    //***************************************************************************
    c_change_password():void {
        //Change password
        const $=$general$system$change_password
        const request: STAjaxPacket = {}
        request[$.I_PREVIOUS_PASSWORD]=Gadgets.inst().get_value("old_password")
        request[$.I_NEW_PASSWORD]=Gadgets.inst().get_value("new_password")
        new Ajax().call("Change password",$.COMMAND, request,(ajax:Ajax)=>{
            if (ajax.ok()) {
                Log.alert(ajax.getResponse().message)
                Gadgets.inst().clear_modifications()
                window.open("./" + Metrics.inst().get_default_index_html(), "_self");
            }
        })
    }
    //***************************************************************************
    _login(onFinish: (error: string | STNull)=>void) {
        
        let gadgets=null
        if (this.get_gadget()) gadgets=this.get_gadget()!.gadgets();
        if (!gadgets) gadgets = Gadgets.inst();

        const da = gadgets.da as T_Login_da
        let company = da.company.get_value() 
        let username = da.username.get_value() 
        let password = da.password.get_value()
        
        if ((GObject.isValid(username)) && (username.length>0) && (GObject.isValid(password)) && (password.length>0)) {
            const $=$general$system$login
            let request: STAjaxPacket={};
            request[$tag.I_COMMAND]=$.COMMAND
            request[$.I_COMPANY]=company
            request[$.I_LOGIN]=username
            request[$.I_PASSWORD]=password

            let error: string | null = null;
            new Ajax().to_omit_login().call("Login", $.COMMAND, request, (ajax :Ajax) => {
                if (ajax.ok()) {
                    const result: number = ajax.getNumber("result")
                    if (result > 0) {
                        SCookie.setCookie(Login_Constants.COOKIE_COMPANY, company)
                        SCookie.setCookie(Login_Constants.COOKIE_USERNAME, username)
                        /*
                        let user: TUser = {} as TUser
                        user!.code = ajax_monitor.getRes().code
                        user!.name = ajax_monitor.getRes().code
                        user!.access = ajax_monitor.getRes().code
                        user!.code = ajax_monitor.getRes().code

                        Param.p.set_user(user)
                        */
                    } else {
                        error = T.t("Illegal value")
                        switch (result) {
                            case 0: error=T.t("Invalid"); break;
                             case -1: error = T.t("Expired"); break;
                             case -2: error = T.t("Suspended"); break;
                             case -3: error = T.t("System Error"); break;
                             case -4: error = T.t("Illegal Branch Code"); break;
                             case -5: error = T.t("Sessions Exceeded"); break;
                             case -6: error = T.t("Invalid Password"); break;
                             case -7: error = T.t("Remote IP not allowed"); break;
                             case -8: error = T.t("No allowed for previous periods"); break;
                             case -9: error = T.t("No allowed for this period"); break;
                             case -10: error = T.t("Not allowed (state)"); break;
                             case -11: error = T.t("Not allowed for this date"); break;
                             case -12: error = T.t("Not allowed for companies"); break;
                             case -13: error = T.t("Not allowed for this setup"); break;
                             case -14: error = T.t("Not allowed to replace position"); break;
                             case -15: error = T.t("Not allowed to replace user"); break;
                             case -16: error = T.t("No Access were indicated"); break;
                             case -17: error = T.t("The alternate user was not found"); break;
                        }
                     }
                }
                if (onFinish) onFinish(error)
            })
        } else {
            if (onFinish) onFinish("Please indicate valid login and password")
        }
    }
    //***************************************************************************
    //***************************************************************************
}