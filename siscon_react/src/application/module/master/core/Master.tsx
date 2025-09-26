import Log from "../../../../slibrary/general/Log";
import Master_Commands from "./Master_Commands";
import Program_Base from "../../../common/entry/Program_Base"
import Constants from "../../../common/entry/Constants";
import Gadget from "../../../../slibrary/framework/gadget/Gadget";
import Gadgets from "../../../../slibrary/framework/gadgets/Gadgets";

export type Tda = {
    designer_mode: Gadget
}

export default class Master extends Program_Base {
    static commands:Master_Commands
    static da:Tda | undefined
    
    constructor() {
        super(Constants.PROGRAM_NAME_MASTER)
        try {
            Master.commands=new Master_Commands(this)
            Master.da=Gadgets.inst().da as Tda
            this.set_command_instance(Master.commands)
            Master.commands.c_read()
            //
        } catch (e) {
            Log.logExc("Designer.constructor",e)
        }
    }
    //*****************************************************
}