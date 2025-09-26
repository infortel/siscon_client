import Log from "../../../../slibrary/general/Log";
import Main_Commands from "./Main_Commands";
import Gadget from "../../../../slibrary/framework/gadget/Gadget";
import Gadgets from "../../../../slibrary/framework/gadgets/Gadgets";
import SDate from "../../../../slibrary/general/SDate";
import Program_Base from "../../../common/entry/Program_Base";
import Constants from "../../../common/entry/Constants";
import { STNull, STObjectAny } from "../../../../slibrary/general/STypes";

export type Tda = {
    designer_mode: Gadget
}

export default class Main extends Program_Base {
    static commands:Main_Commands
    static da:Tda | undefined
    constructor() {
        super(Constants.PROGRAM_NAME_MAIN)
        Main.da=Gadgets.inst().da as Tda
        try {
            Main.commands=new Main_Commands(this)
            this.set_command_instance(Main.commands)
            //Gadgets.core.set_gadgets_oncommand(Main_On_Command.oncommand)
        } catch (e) {
            Log.logExc("Main.constructor",e)
        }
    }
    //*****************************************************
}