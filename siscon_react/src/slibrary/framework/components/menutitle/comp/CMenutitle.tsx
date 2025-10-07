import * as React from 'react';
import Log from '../../../../general/Log';
import { STElement, STNull, STObjectAny } from '../../../../general/STypes';
import Gadget from '../../../gadget/Gadget';
import { Embedded } from '../../../general/Embedded';
import CComponent from '../../../components_base/CComponent';

export default class CMenutitle extends CComponent {
    private static IMAGE_MENU_TITLE_CLOSED="images/gadgets/gmenutitle/common/menu_title_closed.png"
    private static IMAGE_MENU_TITLE_OPENED="images/gadgets/gmenutitle/common/menu_title_opened.png"
    
    constructor(props: any) {
        super(props)
        this.gadget.set_com(this)
    }

    eventClick0 = (event: STObjectAny) => {
        this.event.ctrl_click(event)
        this.event.ctrl_command(event)
        this.event.ctrl_area_click(event)
    }


    render():STElement {

        const rootGadget = this.gadget.def.root__get_root()

        let rend = <></>
        try {

            let tab = 0   

            let menuImage =CMenutitle.IMAGE_MENU_TITLE_CLOSED
            if (rootGadget) {
                if (this.gadget.get_first_child()) if (!this.gadget.get_first_child()!.is_hidden()) menuImage = CMenutitle.IMAGE_MENU_TITLE_OPENED

                //Omit tab for first item.
                if (this.gadget.get_parent()!.isMenutitle() || this.gadget.get_parent()!.isMenuitem()) {
                    tab = rootGadget.def.tab() ?? 0                
                }
            }

            rend = < div
                    className={this.gadget.def.class_name_add_concat("GMenutitle")}
                style={{  ...this.get_style(), ...this.get_style_outer() }}
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
                        <tr><td height="4px"></td></tr>
                        <tr>
                        <td style={{ width: tab }}></td>
                            <td style={{ whiteSpace: "nowrap" }} >
                                <img src={menuImage}></img>
                            {this.state.caption}
                            {this.gadget.get_react_children_elements(null)}
                        </td>
                        
                        </tr>
                        </tbody>
                </table>
            </div >

        } catch (e) {
            Log.logExc("Error rendering GMenuTitle",e)
        }

        this.render_report(rend)
        return (rend)
    }

}
