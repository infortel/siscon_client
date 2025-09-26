import Gadget from "../../../../slibrary/framework/gadget/Gadget"

export type T_Login_da = {
    company: Gadget,
    username: Gadget,
    password: Gadget
}
export default class Login_Constants {
    //Page names.

    static COOKIE_COMPANY = "login_company"
    static COOKIE_USERNAME = "login_username"
}