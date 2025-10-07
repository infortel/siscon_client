import CComponent from "../../components_base/CComponent"
import Log from "../../../general/Log";
import * as React from "react";
import { STElement, STObjectAny } from "../../../general/STypes";

export default class CLabel extends CComponent {
    constructor(props:any) {
        super(props)
        this.gadget.set_com(this)
    }

    eventClick0 = (event: STObjectAny) => {
        this.event.ctrl_click(event)
        this.event.ctrl_area_click(event)
        this.event.ctrl_command(event)
    }

    render() {
        //if (this.gadget.def.def().caption === "[#system.company_name]")
        try {
            let text=this.gadget.get_value() ?? null
            if (text===null) text=this.gadget.def.caption() ?? "<Empty>"
            const result:STElement=
                <label
                    className={this.gadget.def.class_name_add_concat("GLabel")}
                    key={this.key([])}
                    onClick={this.eventClick0}
                    style={{ ...this.get_style_outer(),...this.get_style(), whiteSpace: "nowrap" }}
                    ref={this.ref_outer}
                    onMouseDown={this.event.ctrl_mousedown}
                    onMouseUp={this.event.ctrl_mouseup}
                >
                    {text}
                </label>
            this.render_report(result)
            return result
        } catch (e) {
            Log.logExc("GLabel.render",e)
        }
    }

}