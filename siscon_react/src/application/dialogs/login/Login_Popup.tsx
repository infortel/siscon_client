import Program_Base from "../../common/entry/Program_Base";
import SCookie from "../../../slibrary/general/SCookie";
import Gen from "../../../slibrary/general/Gen";
import Gadgets from "../../../slibrary/framework/gadgets/Gadgets";
import Log from "../../../slibrary/general/Log";
import Login_Constants, { T_Login_da } from "../../module/login/core/Login_Constants";
import GPopup_Windows from "../../../slibrary/framework/components/popup/logic/GPopup_Windows";
import Param from "../../common/Param";
import Page_Name from "../../common/generals/Page_Name";
import { STCallBack_Success, STNull } from "../../../slibrary/general/STypes";
import Gadget from "../../../slibrary/framework/gadget/Gadget";
import GPopup_Window from "../../../slibrary/framework/components/popup/logic/GPopup_Window";
import GObject from "../../../slibrary/general/GObject";
import { Login_Commands } from "../../module/login/core/Login_Commands";




export default class Login_Popup {

    static _instance: Login_Popup
    popup_window!: GPopup_Window
    da!: T_Login_da

    callOnLogin: STCallBack_Success | STNull
    //***************************************************************************
    static inst():Login_Popup {
        if (!Login_Popup._instance) new Login_Popup()
        return Login_Popup._instance
    }
    //***************************************************************************
    constructor() {
        Login_Popup._instance=this
        try {
         } catch (e) {
            Log.logExc("Login_Popup.constructor",e)
        }
    }
    //*****************************************************
    open(page_name:string|STNull, callOnLogin:STCallBack_Success|STNull):void {
        //Param.p.set_user(null)
        if (!page_name) page_name = Page_Name.DIALOG_POPUP_LOGIN
        GPopup_Windows.open("Login_Popup Dialog", page_name!, Login_Commands.inst(), true, (popup_window) => {
            this.popup_window = popup_window!
            this.da = this.popup_window.gadgets.da as T_Login_da

            let company = SCookie.getCookie(Login_Constants.COOKIE_COMPANY)
            let username = SCookie.getCookie(Login_Constants.COOKIE_USERNAME)
            if (GObject.isValid(company)) this.da.company.set_value(company) 
            if (GObject.isValid(username)) this.da.username.set_value(username) 
            
        })

    }
    //*****************************************************
}