import Gadget from "../../Gadget"
import * as React from "react";
import { STElement } from "../../../../general/STypes";

export default class Attach {
    _gadget!: Gadget
    constructor(gadget: Gadget) {
        this._gadget = gadget
    }
    //******************************************************************
    get_render_element(): STElement {
        return <label>Undefined Attach</label>
    }
    //*****************************************************
    //*****************************************************
    //*****************************************************
    //*****************************************************

}