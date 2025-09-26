import Param from "../Param";
import Gadgets from "../../../slibrary/framework/gadgets/Gadgets";
import Main from "../../module/main/core/Main";
import Designer from "../../module/designer/core/Designer";
import Log from "../../../slibrary/general/Log";
import Master from "../../module/master/core/Master";
import Constants from "./Constants";
import Startup_Screen from "./Startup_Screen";
import { STNull } from "../../../slibrary/general/STypes";
import Metrics from "../metrics/Metrics";
import GString from "../../../slibrary/general/GString";
import GObject from "../../../slibrary/general/GObject";
import { Login } from "../../module/login/core/Login";



export default class Startup {
//*********************************************************************
   constructor() {

        //ReactDOM.render(<Startup_Screen />, document.getElementById('root'));
        Gadgets.createReactRoot("root")
        //const container = document.getElementById("root")
        //const reactRoot = createRoot(container!)
        Gadgets.getReactRoot().render(<Startup_Screen />)

        setTimeout(() => {
            try {
                Param.p = new Param((error: string | null) => {
                    if (error===null) this._continue_constructor01()
                })

                } catch (e) {
                Log.logExc("Startup",e)
            }
            //let st=Page_definition_test()
        }, 1000)
    }
//*********************************************************************
    _continue_constructor01() {
        let page: string | STNull = GString.getUrlParameter("page")

        if (page === "") page = null
        if (GObject.isInvalid(page)) {
            page=Metrics.inst().get_starting_default_page();
        }

        if (!GString.isStringWithText(Param.p.system.data()!.login_code)) page = "desk/login/login"

        let gadgets = new Gadgets(true, page!, {}, null, (success) => {
            if (success) {
                try {
                    let program_name = Gadgets.inst().head.program_name()
                    if (program_name === Constants.PROGRAM_NAME_LOGIN) Param.p.set_program(new Login())
                    else if (program_name === Constants.PROGRAM_NAME_DESIGNER) Param.p.set_program(new Designer())
                    else if (program_name === Constants.PROGRAM_NAME_MASTER) Param.p.set_program(new Master())
                    else Param.p.set_program(new Main())

                    if (Param.p.get_program())
                        gadgets.set_command_instance(Param.p.get_program().get_command_instance())
                } catch (e) {
                    Log.logExc("startup:constructor", e)
                }
            }
        })

    }
//*********************************************************************

}