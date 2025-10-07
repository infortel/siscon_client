import * as React from 'react';
import Log from '../../../general/Log';
import { STNull, STObjectAny } from '../../../general/STypes';
import Gadget from '../../gadget/Gadget';
import CComponent from "../../components_base/CComponent"
import { Embedded } from '../../general/Embedded';
import CWidgetpanel from '../cwidgetpanel/CWidgetpanel';
import Gadgets from '../../gadgets/Gadgets';

export default class CWidget extends CComponent {
    constructor(props: any) {
        super(props)
        this.gadget.set_com(this)
    }

    /*
    select_onClick = (event: STObjectAny) => {
        let pan = this.get_widgetpanel()
        if (pan) if (pan.is_editMode()) {
            this.gadget.framework().clear_all_selections(Gadgets.LEVEL_DEEP)
            this.gadget.set_selected(true)
        }
    }
    */

    eventClick0 = (event: STObjectAny) => {
        this.event.ctrl_click(event)
        this.event.ctrl_command(event)
        this.event.ctrl_area_click(event)
    }

    get_widgetpanel(): CWidgetpanel|STNull {
        let gad=this.gadget.gadgets().get_owner()
        if (gad) return gad.gwidgetpanel()
        return null
    }

    is_editMode(): boolean {
        const panel = this.get_widgetpanel()
        if (panel) return panel.is_editMode()
        return false
    }

    event_action(type: string) {
        this.get_widgetpanel()!.get_panel_definitions()!.event_action(this.gadget.gadgets(),type)
    }

    render() {

        const rootGadget = this.gadget.def.root__get_root()

        let options = <></>
        const width=16
        if (this.is_editMode()) {
            options =
                <>
                    <td><img src="images/gadgets/gwidget/common/left.png" width={width} onClick={() => { this.event_action("l") }}></img></td>
                    <td><img src="images/gadgets/gwidget/common/down.png" width={width} onClick={() => { this.event_action("d") }}></img></td>
                    <td><img src="images/gadgets/gwidget/common/up.png" width={width} onClick={() => { this.event_action("u") }}></img></td>
                    <td><img src="images/gadgets/gwidget/common/right.png" width={width} onClick={() => { this.event_action("r") }}></img></td>
                    <td><img src="images/gadgets/gwidget/common/close.png" width={width} onClick={() => { this.event_action("c") }}></img></td>
                </>
        } else {
            options =<>
                <td></td>
            </>
        }

        let rend = <></>
        try {
            rend =
                <div
                    key={this.key([])}
                    onClick={this.eventClick0} style={this.get_style_outer()}
                    ref={this.ref_outer}
                    onMouseDown={this.event.ctrl_mousedown}
                    onMouseUp={this.event.ctrl_mouseup}
                >
                    <table className="GWidget"
                        ref={this.ref_inner}
                        style={this.get_style()}
                    >
                        <tbody>
                            <tr>
                                <td>
                                <table className="GWidget-bar">
                                    <tbody>
                                            <tr>
                                                <td width="100%">{this.state.caption}</td>
                                                {options }
                                        </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {this.gadget.get_react_children_elements(null)}
                                </td>
                            </tr>
                            </tbody>
                    </table>
                </div>


        } catch (e) {
            Log.logExc("Error rendering GWidget", e)
        }
        this.render_report(rend)
        return (rend)
    }

}

function useRef(arg0: null) {
    throw new Error('Function not implemented.');
}
