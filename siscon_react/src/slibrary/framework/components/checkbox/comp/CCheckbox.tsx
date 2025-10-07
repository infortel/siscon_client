import * as React from "react"
import { STElement, STObjectAny } from "../../../../general/STypes"
import CComponent from "../../../components_base/CComponent"
import Gadget_constants from "../../../gadget/Gadget_constants"


//type STControlEvent = (event: GComponentEvent) => void

export default class CCheckbox extends CComponent {
    constructor(props:any) {
        super(props)
        this.gadget.set_com(this)
    }

    eventClick0 = (e: STObjectAny) => {
        if (!(this.gadget.def.readonly())) {
            this.event.ctrl_click(e)
        }
    }
    eventOnchange0 = (event: STObjectAny) => {
        if (!(this.gadget.def.readonly())) {
            this.event.ctrl_change(event)
            this.event.ctrl_command(null)
        }
    }

    eventOnFocus0 = (event: STObjectAny) => {
        this.onFocus(event)
    }

    eventAreaClick0 = (event: STObjectAny) => {
        this.event.ctrl_area_click(event)
    }

    eventOnBlur0 = (event: STObjectAny) => {
        this.onBlur(event)
    }

    render() {
        let checked: boolean = false;
        if (this.state.text) checked = (parseInt(this.state.text)>0)
        let style=this.get_style()
        if (this.gadget.def.readonly()) style={...style, ...Gadget_constants.READONLY_STYLE}

        const result:STElement=
            <div key={this.key(["-0"])}
                onClick={this.eventAreaClick0}
                style={{...this.get_style(), ...this.get_style_outer(), ...this.get_style_size() }}
                className={this.gadget.def.class_name_add_concat("GCheckbox")}
                ref={this.ref_outer}
                onMouseDown={this.event.ctrl_mousedown}
                onMouseUp={this.event.ctrl_mouseup}
            >
            <input key={this.key([])}
                   type="checkbox"
                    ref={this.ref_inner}
                    onClick={this.eventClick0}
                    onChange={this.eventOnchange0}
                    onFocus={this.eventOnFocus0}
                    onBlur={this.eventOnBlur0}
                   checked={checked}
                    readOnly={this.get_readonly_render()}
                    className="GCheckbox-box"
                    style={{width:"10px"}}
            />
                <label
                    className="GCheckbox-box"
                >{this.state.caption}</label>
            </div>

        this.render_report(result)
        return result
    }

}

