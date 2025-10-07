import * as React from 'react';
import CComponent from '../../../components_base/CComponent';
import { STElement, STObjectAny } from '../../../../general/STypes';

export default class CButton extends CComponent {
    constructor(props:any) {
        super(props)
        this.gadget.set_com(this)
    }

    eventClick0 = (event: STObjectAny) => {
        this.event.ctrl_click(event)
        this.event.ctrl_command(event)
        this.event.ctrl_area_click(event)
    }

    render() {
        const result:STElement=
            <button className={this.gadget.def.class_name_add_concat("GButton")}
                    style={{...this.get_style(), ...this.get_style_outer(), ...this.get_style_size()}}
                    key={this.key([])}
                    onClick={this.eventClick0}
                    ref={this.ref_outer}
                    onMouseDown={this.event.ctrl_mousedown}
                    onMouseUp={this.event.ctrl_mouseup}

            >
                {this.state.caption}
            </button>

        this.render_report(result)
        return result
    }

}

