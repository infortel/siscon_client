import CComponent from "../../components_base/CComponent"
import GDefinitions from "../../gadget/GDefinitions";
import Gadget from "../../gadget/Gadget";
import * as React from "react";
import { STElement, STObjectAny } from "../../../general/STypes";
import Gen from "../../../general/Gen";
import GObject from "../../../general/GObject";
import Gadget_constants from "../../gadget/Gadget_constants";

export default class CToggle extends CComponent {
    constructor(props:any) {
        super(props)
        this.gadget.set_com(this)
    }

    eventClick0 = (event: STObjectAny) => {
        this.event.ctrl_area_click(event)
        if (!(this.get_readonly_render)) {
            this.event.ctrl_click(event)
            this.event.ctrl_command(event)
        }
    }

    //*****************************************************
    // Reference: https://www.bestcssbuttongenerator.com/
    render() {
        let readonly = this.gadget.def.readonly() ? true : false
        if (this.gadget.gadgets().is_designing()) readonly=true
        let style={...this.get_style_outer(), ...this.get_style()}
        if (this.gadget.def.readonly()) style={...style, ...Gadget_constants.READONLY_STYLE}

        let checked=GObject.isTrue(this.state.text)
        let className: string ="GToggle GToggle-off"
        if (checked) className ="GToggle GToggle-on"

        let result: STElement =
             <div
                key={this.key([])}
                onClick={this.eventClick0}
                style={style}
                className={className}
                ref={this.ref_outer}
                onMouseDown={this.event.ctrl_mousedown}
                onMouseUp={this.event.ctrl_mouseup}
            >
                {this.state.caption}

            </div>
        this.render_report(result)
        return result
    }
    //*****************************************************

}

