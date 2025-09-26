
//import Data_type from "../../../slibrary/framework/general/Data_type"
import Data_type from "../../../../slibrary/framework/general/Data_type";
import Log from "../../../../slibrary/general/Log"
import LServer from "../../../../slibrary/server_interface/LServer";
import Commands from "../../../../slibrary/framework/general/Commands";
import Main from "./Main";
import Param from "../../../common/Param";
import Commands_General from "../../../common/commands/Commands_General";
import Gadget from "../../../../slibrary/framework/gadget/Gadget";
import { STObjectAny } from "../../../../slibrary/general/STypes";
import Ajax from "../../../common/system/ajax/Ajax";

export default class Main_Commands extends Commands_General {
    private _master:Main
    //***************************************************************************
    constructor(master:Main) {
        super()
        this._master=master
    }
    //***************************************************************************
    c_test() {
        //Test option.
        Log.alert("Testing")
    }
    //***************************************************************************
}