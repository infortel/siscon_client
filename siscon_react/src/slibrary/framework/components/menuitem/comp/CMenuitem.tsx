import * as React from 'react';
import Log from '../../../../general/Log';
import { STObjectAny } from '../../../../general/STypes';
import CComponent from "../../../components_base/CComponent"
import Gadget_constants from '../../../gadget/Gadget_constants';

export default class CMenuitem extends CComponent {
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
        let style={...this.get_style_outer(),...this.get_style()}
        if (this.gadget.def.readonly()) style={...style, ...Gadget_constants.READONLY_STYLE}

        let rend = <></>
        const rootGadget = this.gadget.def.root__get_root()
        try {

            let tab = 0
            if (rootGadget) {
                //Omit tab for first item.
                if (this.gadget.get_parent()!.isMenutitle() || this.gadget.get_parent()!.isMenuitem()) {
                    tab = rootGadget.def.tab() ?? 0                
                }
            }

            rend = <div
                className={this.gadget.def.class_name_add_concat("GMenuitem")}
                style={style}
                key={this.key([])}
                onClick={this.eventClick0}
                ref={this.ref_outer}
                onMouseDown={this.event.ctrl_mousedown}
                onMouseUp={this.event.ctrl_mouseup}
                >
                <table style={{ border: "0px", borderSpacing: "0px", borderCollapse: "collapse" }}
                    ref={this.ref_inner}
                >
                    <tbody>
                    <tr>
                        <td style={{ width: tab }}></td>
                            <td style={{ whiteSpace: "nowrap" }} >
                            {this.state.caption}
                            {this.gadget.get_react_children_elements(null)}
                            </td></tr>
                    </tbody>
                </table>
            </div>
        } catch (e) {
            Log.logExc("Error rendering GMenuItem", e)
        }
        this.render_report(rend)
        return (rend)
    }

}

