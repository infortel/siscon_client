import Select_Company_Database from "./Select_Company_Database"
import Commands_General from "../../common/commands/Commands_General"
import Commands from "../../../slibrary/framework/general/Commands"
import Log from "../../../slibrary/general/Log"

export default class Select_Company_Database_Commands extends Commands {
    //***************************************************************************
    static _instance: Select_Company_Database_Commands
    //***************************************************************************
    static inst() {
        return Select_Company_Database_Commands._instance
    }
    //***************************************************************************
    constructor() {
        super()
        Select_Company_Database_Commands._instance = this
    }
    //***************************************************************************
    c_test() {
        //Test option.
        Log.alert("Testing")
    }
    //***************************************************************************
}