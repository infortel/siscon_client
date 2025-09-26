import CComponent from "../../components_base/CComponent"
import getFromServer from "../../../server_interface/LServer";
import Param from "../../../../application/common/Param";
import * as React from "react";
import { STElement } from "../../../general/STypes";

export default class CTest extends CComponent {
    constructor(props:any) {
        super(props)
        this.gadget.set_com(this)
    }


    render() {
        let result: STElement =
            <button>Test</button>
        this.render_report(result)
        return result
    }
}



