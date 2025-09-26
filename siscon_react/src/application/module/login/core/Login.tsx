import SCookie from "../../../../slibrary/general/SCookie";
import Login_Constants, { T_Login_da } from "./Login_Constants";
import Gadgets from "../../../../slibrary/framework/gadgets/Gadgets";
import GObject from "../../../../slibrary/general/GObject";
import Gen from "../../../../slibrary/general/Gen";
import Log from "../../../../slibrary/general/Log";
import Program_Base from "../../../common/entry/Program_Base";
import Constants from "../../../common/entry/Constants";
import Metrics from "../../../common/metrics/Metrics";
import { Login_Commands } from "./Login_Commands";

export class Login extends Program_Base {
    da!: T_Login_da
    constructor() {
        super(Constants.PROGRAM_NAME_LOGIN)
        try {
            Gadgets.inst().validate_da("login", ["company","username","password"])
            this.da = Gadgets.inst().da as T_Login_da
            this.set_command_instance(Login_Commands.inst())

            let company = SCookie.getCookie(Login_Constants.COOKIE_COMPANY)
            let username = SCookie.getCookie(Login_Constants.COOKIE_USERNAME)
            if (GObject.isValid(company)) this.da.company.set_value(company)
            if (GObject.isValid(username)) this.da.username.set_value(username)

            if (Gen.DEVELOPMENT()) this._automaticLogin()
        } catch (e) {
            Log.logExc("Designer.constructor",e)
        }
    }
    //*****************************************************
    _automaticLogin() {
        setTimeout(() => {
            this.da.company.set_value(Metrics.DEBUG_LOGIN_COMPANY)
            this.da.username.set_value(Metrics.DEBUG_LOGIN_USERNAME)
            this.da.password.set_value(Metrics.DEBUG_LOGIN_PASSWORD)
            setTimeout(() => {
                Login_Commands.inst().c_process_login()
            }, 200)
        },200)

}
    //*****************************************************
}