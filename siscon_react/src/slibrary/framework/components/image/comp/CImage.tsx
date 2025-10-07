import CComponent from "../../../components_base/CComponent"
import GString from "../../../../general/GString";
import * as React from "react";
import { STElement, STObjectAny } from "../../../../general/STypes";

export default class CImage extends CComponent {
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
        const style=this.get_style()
        let url_image=GString.nullToText(this.state.image)
        let outer_style=this.get_style_outer()
        const result:STElement=
                <div
                    key={this.key([])}
                    style={outer_style}
                onClick={this.eventClick0}
                ref={this.ref_outer}
                onMouseDown={this.event.ctrl_mousedown}
                onMouseUp={this.event.ctrl_mouseup}
                >


            <img
                    key={this.key(["d"])}
                    style={this.get_style_size()}
                    src={url_image}
                    className={this.gadget.def.class_name_add_concat("GImage")}
                    ref={this.ref_inner}
                />
                {this.gadget.get_react_children_elements(null)}
                </div>

        this.render_report(result)
        return result
    }

}