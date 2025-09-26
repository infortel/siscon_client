import Commands from "../../../slibrary/framework/general/Commands"
import Log from "../../../slibrary/general/Log"
import Commands_General from "../../common/commands/Commands_General"
import Search from "./Search"

export default class Search_Commands extends Commands {
    private master:Search
    //***************************************************************************
    constructor(master:Search) {
        super()
        this.master=master
    }
    //***************************************************************************
    c_search() {
        //Execute the search.
        this.master._pattern=this.master.da.pattern.get_value()
        this.master._execute_search()
    }
    //***************************************************************************
}