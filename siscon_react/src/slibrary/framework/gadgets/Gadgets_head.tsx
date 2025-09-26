import GObject from "../../general/GObject"
import { STNull, STObjectAny } from "../../general/STypes"
import SEvaluate from "../../sevaluations/SEvaluate"
import Gadget from "../gadget/Gadget"
import Gadgets from "./Gadgets"

export default class Gadget_head {
    //******************************************************************
    gadgets: Gadgets
    _head!: STObjectAny
    //******************************************************************
    constructor(gadgets: Gadgets) {
        this.gadgets = gadgets
    }
    //******************************************************************
    head() {
        return this._head
}
    //******************************************************************
    css(): string | STNull {
        if (GObject.isValid(this._head.css)) return this._head.css; else return null
    }
    //******************************************************************
    program_name(): string | STNull {
        if (GObject.isValid(this._head.program_name)) return this._head.program_name; else return null
    }
    //******************************************************************
    title(): string {
        return SEvaluate.Str(this._head.title)
    }
    //******************************************************************
}